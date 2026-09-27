# PR reviewer

Reviews each pull request when it is opened, and again when someone comments
asking for it. It reads the repository's own rules (CLAUDE.md, AGENTS.md,
CONTRIBUTING.md), reviews in five passes — rules, bugs, history, past
reviews, code comments — scores each finding, and comments only on those it
is at least 80% sure of, each linked to the exact lines.

Adapted from the `code-review` plugin in
[anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official).

**Needs:** a `GITHUB_TOKEN` secret that can read the repositories it reviews,
and the repository's webhook pointed at the agent (Pull requests, Issue
comments). Recommended runtime: Claude Code with Claude Sonnet 5 — the passes
run as parallel subagents there.
