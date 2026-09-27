---
name: review-pr
description: Review a pull request, or review it again when someone asks. Use for every pull request event and every comment asking for a (re-)review.
---

# Review a pull request

The turn starts with a line naming the pull request, like
`GitHub pull request acme/app#42 https://github.com/acme/app/pull/42`, then its
title and description (or the comment that asked). Everything below is keyed
off that repository and number.

Keep a todo list of these steps and work through it.

## 1. Decide whether to review at all

Read the pull request with the `github` MCP tools, or with `git` and the
GitHub API using `GITHUB_TOKEN` if the tools are unavailable. Stop, and reply
with one short line saying why, if the pull request:

- is closed or merged, or is a draft;
- is from a bot (dependency bumps, release automation);
- only touches lockfiles, generated code, or version numbers;
- already has a review from you on the current head commit — unless this turn
  is a comment asking you to review again.

## 2. Check out the change

```
git clone --filter=blob:none https://x-access-token:$GITHUB_TOKEN@github.com/<owner>/<repo>.git
cd <repo> && git fetch origin pull/<number>/head:pr && git checkout pr
git diff --merge-base origin/<base>...pr
```

Reuse the clone if it is already in the workspace; fetch instead. Record the
full head SHA — every link in the comment uses it.

## 3. Collect the repository's own rules

List (paths only, read them when a pass needs them): `CLAUDE.md`,
`AGENTS.md`, `CONTRIBUTING.md`, and `.github/` guidance at the root and in
every directory the pull request touches. Rules closer to a file win.

## 4. Summarise the change

Two or three sentences: what it does and why, from the description and the
diff. This is the first line of the comment and the context every pass needs.

## 5. Review in five passes

Run each pass as its own subagent when the harness offers them (in parallel,
each handed the summary, the diff, and the rule-file list), otherwise one
after another. Each returns candidate issues with file, line, and the reason
it was flagged.

1. **Rules** — does the change break a rule in the files from step 3? These
   files are written for whoever writes the code, so not every line applies to
   a review. Quote the rule.
2. **Bugs in the diff** — read only the changed hunks and look for real
   defects: wrong conditions, unhandled errors, nil/undefined access, races,
   resource leaks, off-by-one, broken error paths. Large bugs, not style.
3. **History** — `git log -L` / `git blame` the changed lines. Does the change
   undo a fix, reintroduce a reverted bug, or contradict why the code was
   written that way?
4. **Past reviews** — find earlier pull requests that touched these files and
   read their review comments. Does advice given there apply here too?
5. **Code comments** — do the changes honour the comments and doc strings in
   the files they modify (invariants, "must hold the lock", "keep in sync
   with …")?

Then read `references/false-positives.md` and drop anything it describes.

## 6. Score every remaining issue

Score each one 0–100 with `references/confidence-rubric.md`, re-reading the
code for each rather than trusting the pass that found it. For a rules issue,
confirm the rule file really says it. **Keep only issues scoring 80 or more.**

## 7. Check again, then write the comment

Re-check step 1 — a pull request can close or go to draft while you work.
Then write the comment exactly as `references/comment-format.md` shows. If
nothing scored 80 or more, use its no-issues form. Do not pad a short review.
