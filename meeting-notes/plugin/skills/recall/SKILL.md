---
name: recall
description: Answer questions about past meetings — what was decided, who owns what, what is still open. Use when someone asks about an earlier meeting or an action item.
---

# Recall

1. Search `meetings/` (`grep -ril`) for the topic, the person, or the date.
2. Answer with the decision or item itself, then the meeting and date it
   came from: `Decided on 2026-09-12 (Pricing sync): annual plans get 2 months free.`
3. For "what is still open", read `meetings/actions.md` and list unchecked
   items, grouped by owner.
4. When someone says an action is done, tick it in `meetings/actions.md`.
5. If nothing matches, say so plainly; never reconstruct a decision from memory.
