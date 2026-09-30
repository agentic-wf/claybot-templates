  // ---- HOST PROTOCOL: keep as is ------------------------------------------
  // MCP Apps (io.modelcontextprotocol/ui) over postMessage. The page answers
  // only its parent; the host checks origins on its side.
  var nextId = 0, pending = {}, handlers = {}
  function post(m) { window.parent.postMessage(m, "*") }
  function request(method, params) {
    var id = ++nextId
    post({ jsonrpc: "2.0", id: id, method: method, params: params || {} })
    return new Promise(function (ok, fail) { pending[id] = { ok: ok, fail: fail } })
  }
  function notify(method, params) { post({ jsonrpc: "2.0", method: method, params: params || {} }) }
  window.addEventListener("message", function (e) {
    if (e.source !== window.parent) return
    var m = e.data
    if (!m || m.jsonrpc !== "2.0") return
    if (m.method) {
      if (handlers[m.method]) handlers[m.method](m.params || {})
      if (m.id !== undefined && m.id !== null) post({ jsonrpc: "2.0", id: m.id, result: {} })
      return
    }
    var p = pending[m.id]
    if (!p) return
    delete pending[m.id]
    if (m.error) p.fail(new Error(m.error.message || "Refused")); else p.ok(m.result)
  })
  function theme(ctx) {
    if (!ctx) return
    if (ctx.theme) document.documentElement.setAttribute("data-theme", ctx.theme)
    var v = ctx.styles && ctx.styles.variables
    if (v) for (var k in v) if (k.indexOf("--") === 0) document.documentElement.style.setProperty(k, v[k])
  }
  var lastHeight = 0
  function resize() {
    var h = Math.ceil(document.documentElement.scrollHeight)
    if (h !== lastHeight) { lastHeight = h; notify("ui/notifications/size-changed", { height: h }) }
  }
  // Finish the card: the decision goes back to the agent that asked. It is
  // { action, note?, values? } and must match app.yaml, or the host refuses it.
  function submit(decision) {
    return request("tools/call", { name: "app_submit", arguments: { decision: decision } }).then(function (res) {
      if (res && res.isError) throw new Error((res.content && res.content[0] && res.content[0].text) || "Refused")
      return res
    })
  }
  handlers["ui/notifications/host-context-changed"] = theme
  handlers["ui/notifications/tool-input"] = function (p) { render(p.arguments || {}) }
  handlers["ui/notifications/tool-result"] = function (p) {
    var s = p.structuredContent || {}
    if (s.status && s.status !== "open" && s.status !== "shown") closed(s)
  }
  request("ui/initialize", { protocolVersion: "2026-01-26", appInfo: { name: document.title, version: "1" }, appCapabilities: {} })
    .then(function (res) { theme(res && res.hostContext); notify("ui/notifications/initialized", {}) })
  if (window.ResizeObserver) new ResizeObserver(resize).observe(document.documentElement)
  // ---- end HOST PROTOCOL --------------------------------------------------
