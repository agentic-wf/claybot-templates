  // ---- VIEW: shared by every app in this catalog --------------------------
  // Everything below draws the tool's input from APP.sections and turns what
  // the owner does (comments, picks, edits) into the decision's values. The
  // input is written by a model, so it is drawn with textContent only.
  var S = { input: {}, comments: [], sel: {}, edits: {}, picked: null, finished: false }
  var $ = function (id) { return document.getElementById(id) }
  function el(tag, cls, text) {
    var e = document.createElement(tag)
    if (cls) e.className = cls
    if (text !== undefined && text !== null) e.textContent = String(text)
    return e
  }
  function button(label, cls, onclick) {
    var b = el("button", cls, label)
    b.type = "button"
    if (onclick) b.addEventListener("click", onclick)
    return b
  }
  function arr(v) { return Array.isArray(v) ? v : [] }
  function str(v) { return v === undefined || v === null ? "" : String(v) }
  function isURL(u) { return typeof u === "string" && /^https?:\/\//i.test(u) }
  function link(text, url) {
    if (!isURL(url)) return el("span", null, text)
    var a = el("a", "link", text)
    a.href = url
    a.rel = "noopener noreferrer"
    a.addEventListener("click", function (e) { e.preventDefault(); request("ui/open-link", { url: url }).catch(function () {}) })
    return a
  }
  var TONE = {
    bad: /^(critical|crit|high|sev1|p1|blocker|danger|down|fail|failed|failing|error|red|vulnerable|breaking|data-loss|security|removed)$/,
    warn: /^(medium|med|sev2|p2|warn|warning|slow|degraded|yellow|major|lock|downtime|reliability|changed|stale|nudged|flaky|skipped)$/,
    ok: /^(low|sev3|p3|ok|up|pass|passed|passing|green|recovered|added|new|fixed|minor|patch|info|cost)$/,
  }
  function chip(v) {
    var s = str(v).toLowerCase(), c = "chip"
    if (TONE.bad.test(s)) c += " bad"; else if (TONE.warn.test(s)) c += " warn"; else if (TONE.ok.test(s)) c += " ok"
    return el("span", c, v)
  }

  // Comments: a target names what the comment is on ("docs/a.md:L12",
  // "src/x.go:40", "finding 3"), quote is text the owner selected there.
  function quoteIn(scope) {
    var s = window.getSelection && window.getSelection()
    if (!s || s.isCollapsed || !scope || !scope.contains(s.anchorNode)) return ""
    return String(s).trim().slice(0, 400)
  }
  function commentable(target, scope) {
    var thread = el("div", "thread")
    var b = button("+", "cbtn")
    b.title = "Comment"
    b.setAttribute("aria-label", "Comment on " + target)
    b.addEventListener("mousedown", function (e) { e.preventDefault() }) // keep the selection
    b.addEventListener("click", function (e) { e.stopPropagation(); compose(thread, target, quoteIn(scope)) })
    return { btn: b, thread: thread }
  }
  function compose(thread, target, quote) {
    if (S.finished || !APP.comments) return
    var open = thread.querySelector(".composer")
    if (open) { open.querySelector("textarea").focus(); return }
    var box = el("div", "composer")
    if (quote) box.appendChild(el("blockquote", "quote", quote))
    var ta = el("textarea")
    ta.rows = 2
    ta.placeholder = "Comment on " + target
    var cancel = button("Cancel", "small", function () { box.remove(); resize() })
    var add = button("Comment", "small primary", function () {
      var body = ta.value.trim()
      if (!body) { ta.focus(); return }
      var c = { target: target, body: body }
      if (quote) c.quote = quote
      S.comments.push(c)
      box.remove()
      bubble(thread, c)
      tally()
    })
    ta.addEventListener("keydown", function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") add.click()
      if (e.key === "Escape") cancel.click()
    })
    var row = el("div", "row end")
    row.append(cancel, add)
    box.append(ta, row)
    thread.appendChild(box)
    ta.focus()
    resize()
  }
  function bubble(thread, c) {
    var b = el("div", "bubble")
    if (c.quote) b.appendChild(el("blockquote", "quote", c.quote))
    b.appendChild(el("div", null, c.body))
    var x = button("×", "x", function () {
      if (S.finished) return
      S.comments.splice(S.comments.indexOf(c), 1)
      b.remove()
      tally()
    })
    x.setAttribute("aria-label", "Remove comment")
    b.appendChild(x)
    thread.appendChild(b)
  }
  function lineComments(row, target, scope) {
    if (!APP.comments) return
    row.classList.add("pick")
    row.tabIndex = 0
    var thread = null
    function go() {
      if (!thread) { thread = el("div", "thread"); row.after(thread) }
      compose(thread, target, quoteIn(scope || row))
    }
    row.addEventListener("click", function (e) { if (!(e.target.closest && e.target.closest("a,button,input"))) go() })
    row.addEventListener("keydown", function (e) { if (e.key === "Enter" && e.target === row) go() })
  }

  // Selection: a section with a field lets the owner pick rows; the decision
  // carries the picked ids as a JSON array in that field.
  function pick(field, id, on) {
    S.sel[field] = S.sel[field] || {}
    if (on) S.sel[field][id] = true; else delete S.sel[field][id]
    tally()
  }
  function picked(field) { return Object.keys(S.sel[field] || {}) }
  function checkbox(field, id, on, label) {
    var l = el("label", "check")
    var c = el("input")
    c.type = "checkbox"
    c.checked = on
    c.setAttribute("aria-label", label || "Select")
    pick(field, id, on)
    c.addEventListener("change", function () { pick(field, id, c.checked); l.closest(".item") && l.closest(".item").classList.toggle("off", !c.checked) })
    l.appendChild(c)
    return l
  }

  // Markdown, the subset a model writes: headings, paragraphs, lists, quotes,
  // fenced code, tables, `code`, **bold** and [links](https://…).
  function inline(parent, text) {
    var re = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\[([^\]]+)\]\((https?:\/\/[^)\s]+)\))/g, last = 0, m
    text = str(text)
    while ((m = re.exec(text))) {
      if (m.index > last) parent.appendChild(document.createTextNode(text.slice(last, m.index)))
      if (m[1]) parent.appendChild(el("code", null, m[1].slice(1, -1)))
      else if (m[2]) parent.appendChild(el("strong", null, m[2].slice(2, -2)))
      else parent.appendChild(link(m[4], m[5]))
      last = re.lastIndex
    }
    if (last < text.length) parent.appendChild(document.createTextNode(text.slice(last)))
  }
  var LIST = /^\s*([-*+]|\d+[.)])\s+/
  function blocks(md) {
    var out = [], lines = str(md).replace(/\r/g, "").split("\n"), i = 0
    while (i < lines.length) {
      var l = lines[i], start = i + 1, buf = []
      if (!l.trim()) { i++; continue }
      if (/^\s*```/.test(l)) {
        for (i++; i < lines.length && !/^\s*```/.test(lines[i]); i++) buf.push(lines[i])
        i++
        out.push({ kind: "code", text: buf.join("\n"), line: start })
      } else if (/^#{1,6}\s/.test(l)) {
        out.push({ kind: "h", level: l.match(/^#+/)[0].length, text: l.replace(/^#+\s+/, ""), line: start }); i++
      } else if (LIST.test(l)) {
        out.push({ kind: "li", text: l.replace(LIST, ""), line: start, indent: /^\s{2,}/.test(l) }); i++
      } else if (/^>/.test(l)) {
        for (; i < lines.length && /^>/.test(lines[i]); i++) buf.push(lines[i].replace(/^>\s?/, ""))
        out.push({ kind: "quote", text: buf.join(" "), line: start })
      } else if (/^\s*\|/.test(l)) {
        for (; i < lines.length && /^\s*\|/.test(lines[i]); i++) buf.push(lines[i])
        out.push({ kind: "table", text: buf.join("\n"), line: start })
      } else {
        for (; i < lines.length && lines[i].trim() && !/^(\s*```|#{1,6}\s|>|\s*\|)/.test(lines[i]) && !LIST.test(lines[i]); i++) buf.push(lines[i].trim())
        out.push({ kind: "p", text: buf.join(" "), line: start })
      }
    }
    return out
  }
  function mdTable(text) {
    var t = el("table", "mdtable")
    text.split("\n").forEach(function (row, i) {
      if (/^\s*\|?\s*:?-{2,}/.test(row)) return
      var tr = el("tr")
      row.replace(/^\s*\|/, "").replace(/\|\s*$/, "").split("|").forEach(function (cell) {
        var c = el(i === 0 ? "th" : "td")
        inline(c, cell.trim())
        tr.appendChild(c)
      })
      t.appendChild(tr)
    })
    var wrap = el("div", "scroll")
    wrap.appendChild(t)
    return wrap
  }
  function mdBlock(b) {
    var e
    if (b.kind === "code") { e = el("pre", "code"); e.appendChild(el("code", null, b.text)); return e }
    if (b.kind === "table") return mdTable(b.text)
    if (b.kind === "h") e = el("div", "mdh h" + Math.min(b.level, 4))
    else if (b.kind === "li") e = el("div", "mdli" + (b.indent ? " in" : ""))
    else if (b.kind === "quote") e = el("blockquote", "mdq")
    else e = el("p", "mdp")
    inline(e, b.text)
    return e
  }
  function norm(s) { return str(s).replace(/\s+/g, " ").trim() }
  // markdown draws md; with path it is commentable per block, and with before
  // it marks the blocks that are new and lists what was taken out.
  function markdown(md, o) {
    o = o || {}
    var wrap = el("div", "md"), bs = blocks(md)
    var had = null
    if (typeof o.before === "string") {
      had = {}
      blocks(o.before).forEach(function (b) { had[norm(b.text)] = true })
    }
    bs.forEach(function (b) {
      var row = el("div", "mdrow"), cell = el("div", "mdcell")
      cell.appendChild(mdBlock(b))
      if (had && !had[norm(b.text)]) row.classList.add("changed")
      row.appendChild(cell)
      wrap.appendChild(row)
      if (o.comment && APP.comments) {
        var c = commentable((o.path ? o.path + ":" : "") + "L" + b.line, cell)
        row.appendChild(c.btn)
        wrap.appendChild(c.thread)
      }
    })
    if (had) {
      var now = {}
      bs.forEach(function (b) { now[norm(b.text)] = true })
      var gone = blocks(o.before).filter(function (b) { return !now[norm(b.text)] })
      if (gone.length) {
        var d = el("details", "removed")
        d.appendChild(el("summary", null, gone.length + (gone.length === 1 ? " passage" : " passages") + " taken out"))
        gone.forEach(function (b) { d.appendChild(el("div", "del", b.text)) })
        d.addEventListener("toggle", resize)
        wrap.appendChild(d)
      }
    }
    return wrap
  }

  // A unified diff, commentable per line: "path:N" is line N of the new file,
  // "path:-N" line N of the old one.
  function diff(file, open) {
    var d = el("details", "file")
    d.open = open !== false
    var head = el("summary", "filehead")
    head.appendChild(el("span", "mono", file.path || "change"))
    var add = 0, del = 0
    var body = el("div", "diff scroll"), table = el("div", "difft"), o = 0, n = 0
    str(file.patch).replace(/\r/g, "").split("\n").forEach(function (l) {
      if (/^(diff --git|index |--- |\+\+\+ |\\ No newline)/.test(l) || l === "") return
      var m = /^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@(.*)$/.exec(l)
      if (m) { o = +m[1]; n = +m[2]; table.appendChild(el("div", "dl hunk", l)); return }
      var sign = l.charAt(0), text = l.slice(1), cls = "ctx", on = "", nn = "", target
      if (sign === "+") { cls = "add"; nn = n; target = file.path + ":" + n; n++; add++ }
      else if (sign === "-") { cls = "del"; on = o; target = file.path + ":-" + o; o++; del++ }
      else { on = o; nn = n; target = file.path + ":" + n; o++; n++; if (sign !== " ") text = l }
      var row = el("div", "dl " + cls)
      row.append(el("span", "dn", on), el("span", "dn", nn), el("span", "ds", cls === "add" ? "+" : cls === "del" ? "−" : ""), el("span", "dt", text))
      table.appendChild(row)
      lineComments(row, target, row)
    })
    var stats = el("span", "stats")
    stats.append(el("span", "plus", "+" + add), el("span", "minus", "−" + del))
    head.appendChild(stats)
    if (isURL(file.url)) head.appendChild(link("open", file.url))
    body.appendChild(table)
    d.append(head, body)
    d.addEventListener("toggle", resize)
    return d
  }

  // ---- sections ------------------------------------------------------------
  function section(label, hint) {
    var s = el("section", "sec")
    if (label) s.appendChild(el("h2", null, label))
    if (hint) s.appendChild(el("p", "muted hint", hint))
    return s
  }
  var DRAW = {
    header: function (sec, input) {
      var h = el("header", "head")
      var t = el("h1")
      t.appendChild(isURL(input[sec.link]) ? link(input.title || APP.title, input[sec.link]) : document.createTextNode(input.title || APP.title))
      h.appendChild(t)
      var chips = el("div", "chips")
      arr(sec.chips).forEach(function (k) { arr(input[k]).concat(typeof input[k] === "string" ? [input[k]] : []).forEach(function (v) { if (v) chips.appendChild(chip(v)) }) })
      if (chips.childNodes.length) h.appendChild(chips)
      var meta = arr(sec.meta).map(function (k) { return str(input[k]) }).filter(Boolean)
      if (meta.length) h.appendChild(el("p", "muted", meta.join(" · ")))
      return h
    },
    markdown: function (sec, input) {
      if (!str(input[sec.key]).trim()) return null
      var s = section(sec.label, sec.comment && APP.comments ? "Select text or press + to comment." : "")
      s.appendChild(markdown(input[sec.key], { comment: sec.comment, path: sec.path || sec.key }))
      return s
    },
    docs: function (sec, input) {
      var list = arr(input[sec.key])
      if (!list.length) return null
      var s = section(sec.label, APP.comments ? "Select text or press + beside a passage to comment. New passages are marked." : "")
      list.forEach(function (f, i) {
        var id = str(f.path || i + 1)
        var box = el("div", "item doc")
        var top = el("div", "row between")
        var left = el("div", "row")
        if (sec.field) left.appendChild(checkbox(sec.field, id, true, "Include " + id))
        left.appendChild(isURL(f.url) ? link(id, f.url) : el("strong", "mono", id))
        top.appendChild(left)
        if (f.status) top.appendChild(chip(f.status))
        box.appendChild(top)
        if (f.reason) box.appendChild(el("p", "muted", f.reason))
        box.appendChild(markdown(f.after !== undefined ? f.after : f.content, { comment: true, path: id, before: f.before }))
        s.appendChild(box)
      })
      return s
    },
    findings: function (sec, input) {
      var list = arr(input[sec.key])
      var s = section(sec.label + (list.length ? " · " + list.length : ""), list.length && sec.field ? "Untick a finding to leave it out." : "")
      if (!list.length) { s.appendChild(el("p", "muted", sec.empty || "Nothing found.")); return s }
      list.forEach(function (f, i) {
        var id = str(f.id !== undefined ? f.id : i + 1)
        var box = el("div", "item")
        var top = el("div", "row between")
        var left = el("div", "row")
        if (sec.field) left.appendChild(checkbox(sec.field, id, f.keep !== false, "Keep " + (f.title || id)))
        left.appendChild(el("strong", null, f.title || "Finding " + id))
        top.appendChild(left)
        var right = el("div", "chips")
        ;[f.severity, f.category, f.confidence !== undefined ? "confidence " + f.confidence : ""].forEach(function (v) { if (v) right.appendChild(chip(v)) })
        var c = commentable("finding " + id, box)
        if (APP.comments) right.appendChild(c.btn)
        top.appendChild(right)
        box.appendChild(top)
        if (f.file) box.appendChild(isURL(f.url) ? link(f.file + (f.line ? ":" + f.line : ""), f.url) : el("div", "muted mono", f.file + (f.line ? ":" + f.line : "")))
        if (f.body) box.appendChild(markdown(f.body))
        if (f.suggestion) { var p = el("pre", "code"); p.appendChild(el("code", null, f.suggestion)); box.appendChild(p) }
        if (f.hunk) box.appendChild(diff({ path: f.file || "change", patch: f.hunk }, true))
        box.appendChild(c.thread)
        s.appendChild(box)
      })
      return s
    },
    diffs: function (sec, input) {
      var list = arr(input[sec.key])
      if (!list.length) return null
      var s = section(sec.label + " · " + list.length, APP.comments ? "Press a line to comment on it." : "")
      list.forEach(function (f, i) { s.appendChild(diff(f, i < 4)) })
      return s
    },
    items: function (sec, input) {
      var list = arr(input[sec.key])
      if (!list.length) return sec.empty ? (function () { var s = section(sec.label); s.appendChild(el("p", "muted", sec.empty)); return s })() : null
      var s = section(sec.label + " · " + list.length, sec.hint || "")
      list.forEach(function (it, i) {
        if (typeof it !== "object" || it === null) it = { title: it }
        var id = str(it[sec.id || "id"] !== undefined ? it[sec.id || "id"] : i + 1)
        var box = el("div", "item")
        var top = el("div", "row between")
        var left = el("div", "row grow")
        if (sec.field) left.appendChild(checkbox(sec.field, id, !!sec.checked, "Select " + id))
        var title = str(it[sec.title || "title"]) || id
        left.appendChild(isURL(it[sec.url || "url"]) ? link(title, it[sec.url || "url"]) : el("strong", null, title))
        top.appendChild(left)
        var right = el("div", "chips")
        arr(sec.chips).forEach(function (k) { if (it[k] !== undefined && it[k] !== "") right.appendChild(chip(it[k])) })
        var c = sec.comment && APP.comments ? commentable(sec.target ? sec.target + " " + id : id, box) : null
        if (c) right.appendChild(c.btn)
        top.appendChild(right)
        box.appendChild(top)
        var meta = arr(sec.meta).map(function (k) {
          var v = it[k]
          if (Array.isArray(v)) v = v.join(", ")
          return v === undefined || v === "" || v === null ? "" : (sec.labels && sec.labels[k] ? sec.labels[k] + " " : "") + v
        }).filter(Boolean)
        if (meta.length) box.appendChild(el("div", "muted", meta.join(" · ")))
        if (sec.body && it[sec.body]) box.appendChild(markdown(it[sec.body]))
        if (sec.links) arr(it[sec.links]).forEach(function (l) { var p = el("div", "src"); p.appendChild(link(l.title || l.url, l.url)); box.appendChild(p) })
        if (c) box.appendChild(c.thread)
        s.appendChild(box)
      })
      return s
    },
    changes: function (sec, input) {
      var list = arr(input[sec.key])
      if (!list.length) return null
      var s = section(sec.label + " · " + list.length, "Untick a change to keep your original wording.")
      list.forEach(function (ch, i) {
        var id = str(ch.id !== undefined ? ch.id : i + 1)
        var box = el("div", "item")
        var top = el("div", "row")
        top.appendChild(checkbox(sec.field, id, true, "Accept change " + id))
        var pair = el("div", "grow")
        if (ch.before) pair.appendChild(el("div", "del", ch.before))
        if (ch.after) pair.appendChild(el("div", "ins", ch.after))
        top.appendChild(pair)
        box.appendChild(top)
        if (ch.why) box.appendChild(el("p", "muted", ch.why))
        s.appendChild(box)
      })
      return s
    },
    checks: function (sec, input) {
      var list = arr(input[sec.key])
      if (!list.length) return null
      var s = section(sec.label)
      list.forEach(function (c) {
        if (typeof c !== "object" || c === null) c = { name: c }
        var row = el("div", "row between line")
        var left = el("div", "grow")
        left.appendChild(isURL(c.url) ? link(c.name, c.url) : el("span", null, c.name))
        if (c.detail) left.appendChild(el("div", "muted", c.detail))
        row.appendChild(left)
        if (c.status) row.appendChild(chip(c.status))
        s.appendChild(row)
      })
      return s
    },
    timeline: function (sec, input) {
      var list = arr(input[sec.key])
      if (!list.length) return null
      var s = section(sec.label)
      var ol = el("ol", "timeline")
      list.forEach(function (t) {
        var li = el("li")
        li.appendChild(el("span", "mono muted", str(t.at)))
        var what = el("span")
        if (t.who) what.appendChild(el("strong", null, t.who + " "))
        what.appendChild(document.createTextNode(str(t.what)))
        li.appendChild(what)
        ol.appendChild(li)
      })
      s.appendChild(ol)
      return s
    },
    kv: function (sec, input) {
      var src = sec.key ? input[sec.key] || {} : input
      var rows = arr(sec.keys).filter(function (k) { return src[k[0]] !== undefined && src[k[0]] !== "" })
      if (!rows.length) return null
      var s = section(sec.label)
      var dl = el("dl", "kv")
      rows.forEach(function (k) { dl.append(el("dt", null, k[1]), el("dd", null, str(src[k[0]]))) })
      s.appendChild(dl)
      return s
    },
    text: function (sec, input) {
      var v = sec.key.split(".").reduce(function (o, k) { return o && o[k] }, input)
      if (!str(v).trim()) return null
      var d = el("details", "sec")
      d.appendChild(el("summary", null, sec.label))
      var p = el("pre", "code scroll")
      p.appendChild(el("code", null, v))
      d.appendChild(p)
      d.addEventListener("toggle", resize)
      return d
    },
    edit: function (sec, input) {
      var s = section(sec.label, sec.hint)
      var ta = el("textarea", "edit")
      ta.rows = sec.rows || 6
      ta.value = str(input[sec.key])
      ta.setAttribute("aria-label", sec.label)
      S.edits[sec.field] = ta.value
      ta.addEventListener("input", function () { S.edits[sec.field] = ta.value; resize() })
      s.appendChild(ta)
      return s
    },
  }

  function render(input) {
    S.input = input || {}
    var root = $("app")
    root.textContent = ""
    S.sel = {}
    APP.sections.forEach(function (sec) {
      var node = DRAW[sec.type](sec, S.input)
      if (node) root.appendChild(node)
    })
    var bar = $("actions")
    bar.textContent = ""
    APP.actions.forEach(function (a) {
      bar.appendChild(button(a.label, a.tone === "primary" || a.tone === "danger" ? a.tone : "", function () { decide(a) }))
    })
    tally()
  }

  function tally() {
    var parts = []
    if (S.comments.length) parts.push(S.comments.length + (S.comments.length === 1 ? " comment" : " comments"))
    APP.sections.forEach(function (sec) {
      if (!sec.field || sec.type === "edit") return
      var n = picked(sec.field).length, of = arr(S.input[sec.key]).length
      if (of) parts.push(n + " of " + of + " " + (sec.noun || "selected"))
    })
    var t = $("tally")
    if (t) t.textContent = parts.join(" · ")
    resize()
  }

  function values() {
    var v = {}
    if (APP.comments && S.comments.length) v.comments = JSON.stringify(S.comments)
    APP.sections.forEach(function (sec) {
      if (!sec.field) return
      if (sec.type === "edit") { if (S.edits[sec.field] !== str(S.input[sec.key])) v[sec.field] = S.edits[sec.field]; return }
      v[sec.field] = JSON.stringify(picked(sec.field))
    })
    if (APP.ref && S.input.ref) v.ref = str(S.input.ref)
    return v
  }

  // A button with a note opens the box first; the second press sends.
  function decide(a) {
    if (S.finished) return
    $("error").hidden = true
    var note = $("note").value.trim()
    if (a.needs && !picked(a.needs).length) return fail("Select at least one first.")
    if (a.note && S.picked !== a.id) {
      S.picked = a.id
      $("note-wrap").hidden = false
      $("note-label").textContent = "Note for " + a.label + (a.note === "optional" ? " · optional" : "")
      $("note").focus()
      resize()
      return
    }
    if (a.note === "required" && !note) return fail("Add a note for " + a.label + ".")
    var d = { action: a.id, values: values() }
    if (a.note && note) d.note = note
    busy(true)
    submit(d)
      .then(function () { closed({ status: "decided", decision: { action: a.id } }) })
      .catch(function (e) { busy(false); fail(e.message) })
  }
  function busy(on) {
    Array.prototype.forEach.call(document.querySelectorAll("button, input, textarea"), function (x) { x.disabled = on || S.finished })
  }
  function fail(msg) { $("error").textContent = msg; $("error").hidden = false; resize() }
  // The card after it ends, including when it is redrawn later from its result.
  function closed(s) {
    S.finished = true
    busy(true)
    document.body.classList.add("finished")
    var a = s.decision && APP.actions.filter(function (x) { return x.id === s.decision.action })[0]
    $("done").textContent = a ? a.label : s.status === "expired" ? "No answer in time" : "Closed"
    $("done").hidden = false
    $("note-wrap").hidden = true
    resize()
  }
