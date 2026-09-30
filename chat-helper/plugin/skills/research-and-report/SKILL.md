---
name: research-and-report
description: Use when a chat question needs real work to answer — reading a repository or docs, running a command, comparing options, or drafting something.
---

# Research and report

1. **Restate the goal to yourself** in one line: what would a complete answer
   let the asker do?
2. **Work in the workspace.** Clone repositories there (reuse an existing
   clone and pull), run commands, and write drafts to files. Nothing you do
   there is visible in the chat until you report it.
3. **Prefer primary sources**: the code, the official docs, the changelog —
   over memory. Note where each fact came from.
4. **Stop when you can answer.** If the work would take much longer than the
   question deserves, report what you found so far and what is left.
5. **Report the result, not the steps.**
   - The answer or recommendation first.
   - Two to four supporting points, each with its source (file and line,
     URL, or command output).
   - Where the full result lives, if you wrote one (`reports/<topic>.md`).
6. **Remember** anything the team will ask again (a repo's layout, a
   decision, who owns what) in `NOTES.md`.

<!-- card -->
## Card

When `app_report` is among your tools and this turn did not come from Slack, Telegram or Discord and the result runs past what step 5 fits in a reply, also call `app_report` with the question as `title`, the full `report` and its `sources`, and a `ref` naming where your notes are. Keep your reply to the short answer. It returns at once — never wait on it.

The owner may follow up later; that arrives as a new turn with the note. `values.comments`, when present, is a JSON array of `{target, quote?, body}`: the owner's own comments. A target is `report:L<line>`; `quote` is the text they selected. Answer each comment, then the note.

If `app_report` is not among your tools, is refused, or comes back expired or cancelled, carry on exactly as the steps above say — the card is an extra, never a reason to stop.
<!-- /card -->
