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
