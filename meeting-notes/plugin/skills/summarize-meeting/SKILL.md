---
name: summarize-meeting
description: Turn a meeting transcript or rough notes into decisions, action items and open questions, and file them. Use whenever someone shares notes or a transcript.
---

# Summarize a meeting

1. **Identify the meeting**: title, date (today if not given), and who spoke.
   Ask nothing — infer, and mark guesses with "(?)".
2. **Extract**, reading the whole text before writing:
   - **Decisions** — something the group agreed. Not proposals, not opinions.
   - **Action items** — a task with an owner. Take the due date only if one
     was said.
   - **Open questions** — raised and not settled, including unclear owners.
   - **Context** — at most three lines a reader who missed it needs.
3. **Write** exactly as `references/format.md` shows. Under 250 words; cut
   context before cutting decisions or actions.
4. **File** the summary as `meetings/<YYYY-MM-DD>-<slug>.md`, and append each
   action item to `meetings/actions.md` as `- [ ] <owner>: <task> (<due>) — <meeting>`.

<!-- card -->
## Card

When `app_meeting_summary` is among your tools and this turn did not come from Slack, Telegram or Discord, before step 4 files it, call `app_meeting_summary` with the meeting `title`, `date`, `people`, and the `decisions`, `actions` (`title`, `owner`, `due`) and open `questions`, each with an `id`. It waits for the owner (up to 15 minutes). `values.comments`, when present, is a JSON array of `{target, quote?, body}`: the owner's own comments. A target is `decision <id>`, `action <id>` or `question <id>`.
- `file` — apply the comments (an owner or a date they give is now stated) and file as step 4 says.
- `revise` — apply the comments and the note and call `app_meeting_summary` again. Stop after three rounds and file what the owner last saw.

If `app_meeting_summary` is not among your tools, is refused, or comes back expired or cancelled, carry on exactly as the steps above say — the card is an extra, never a reason to stop.
<!-- /card -->
