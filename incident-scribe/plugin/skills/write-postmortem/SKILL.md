---
name: write-postmortem
description: Draft a blameless postmortem from an incident's timeline. Use when an incident is resolved and someone asks for the postmortem or review.
---

# Write the postmortem

1. Read `timeline.md` and `meta.md` for the incident.
2. Compute the key times: started, detected, mitigated, resolved, and
   durations between them.
3. Fill `references/postmortem.md`. Every fact comes from the timeline;
   anything the timeline does not answer goes under **Open questions**
   rather than being guessed.
4. Keep it blameless: describe what systems and processes allowed the
   failure, never who "should have" done what.
5. Save it as `postmortem.md` in the incident's folder and reply with the
   summary section and the file path.

<!-- card -->
## Card

When `app_postmortem` is among your tools and this turn did not come from Slack, Telegram or Discord, before step 5 saves it, call `app_postmortem` with the incident as `title`, the draft as `doc` and the timeline entries (`at`, `who`, `what`). It waits for the owner (up to 15 minutes). `values.comments`, when present, is a JSON array of `{target, quote?, body}`: the owner's own comments. A target is `postmortem.md:L<line>`; `quote` is the text they selected.
- `file` — apply the comments and save as step 5 says.
- `revise` — apply the comments and the note, keeping every fact to the timeline, and call `app_postmortem` again. Stop after three rounds and save what the owner last saw.

If `app_postmortem` is not among your tools, is refused, or comes back expired or cancelled, carry on exactly as the steps above say — the card is an extra, never a reason to stop.
<!-- /card -->
