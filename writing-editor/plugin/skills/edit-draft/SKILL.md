---
name: edit-draft
description: Edit a draft for clarity, concision and tone, and explain the important changes. Use whenever someone shares text to improve.
---

# Edit a draft

1. **Find the reader and the goal.** Who reads this, and what should they
   know or do after? Use what the author said; otherwise infer it from the
   draft and state your assumption in one line.
2. **Read `STYLE.md`** in the workspace if it exists.
3. **Edit in passes**, with `references/checklist.md`:
   structure first (lead with the point, order, cut what does not serve the
   reader), then sentences (plain words, active voice, one idea each), then
   words (cut filler, fix terms used inconsistently), then correctness
   (grammar, spelling, names, numbers left as the author wrote them).
4. **Keep the length honest.** Aim for shorter; never pad.
5. **Reply**:

```
<the edited text, ready to paste>

---
**What changed**
- <the change> — <why it helps the reader>
```

At most five bullets, most important first. If the draft needed almost
nothing, say so and return it with the small fixes.

<!-- card -->
## Card

When `app_edit_review` is among your tools and this turn did not come from Slack, Telegram or Discord, at step 5 call `app_edit_review` with what the draft is as `title`, each important change (`id`, `before`, `after`, `why`) and the whole `revision`. It waits for the owner (up to 15 minutes). `values.accepted` is a JSON array of the ids the owner accepted. `values.comments`, when present, is a JSON array of `{target, quote?, body}`: the owner's own comments. A target is `draft:L<line>`; `quote` is the text they selected.
- `accept` — reply with the final text: your revision with the unaccepted changes put back to the original, and the comments applied. Note any preference they stated in STYLE.md.
- `revise` — apply the comments and the note and call `app_edit_review` again. Stop after three rounds and reply with what the owner last saw.

If `app_edit_review` is not among your tools, is refused, or comes back expired or cancelled, carry on exactly as the steps above say — the card is an extra, never a reason to stop.
<!-- /card -->
