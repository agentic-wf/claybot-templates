---
name: write-digest
description: Use when asked for a digest, a summary of recent changes, or on the daily schedule.
---

# Write the digest

1. Clone `$REPO_URL` into the workspace if it is not there; otherwise fetch.
2. List the commits on the default branch from the last 24 hours. Group merge commits with the pull request they came from.
3. Write:
   - **Headline**: one sentence on the most important change.
   - **Changes**: one bullet per merged change — what it does for a user or
     developer, and who made it. Cite short SHAs.
   - **Watch out**: anything risky — migrations, config changes, reverted work.
4. If nothing merged, say so in one line.

Keep it under 200 words.
