# Issue triager

Triages each new issue: classifies it (bug, feature, question, docs) and a
bug's severity, runs three duplicate searches over open and closed issues,
asks the reporter for only what is missing, answers questions it can, and
suggests — or, with `TRIAGE_APPLY_LABELS=true`, applies — the repository's own
labels. It never closes, locks, or assigns.

**Needs:** a `GITHUB_TOKEN` secret that can read issues (and write labels if
applying them), and the repository's webhook pointed at the agent (Issues,
Issue comments). Recommended runtime: Claude Code with Claude Haiku 4.5.
GitLab is declared but switched off; turn it on in the agent's mailbox to
triage GitLab issues too.
