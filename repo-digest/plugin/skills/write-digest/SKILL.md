---
name: write-digest
description: Write a digest of what merged on a repository's branch since the last digest. Use on the daily schedule and whenever someone asks what changed.
---

# Write the digest

## 1. Update the clone

Clone `$REPO_URL` into `repo/` in the workspace on first use (with
`GITHUB_TOKEN` as the password for a private repository), otherwise
`git fetch`. Follow `$DIGEST_BRANCH`, or the default branch when it is empty.

## 2. Find the range

Read the last reported commit from `.digest-state` in the workspace. The range
is that commit up to the branch head. With no state file — the first run —
use the last 7 days. If the saved commit is no longer in the history (force
push), fall back to the last 7 days and say so.

If the range is empty, reply `No changes merged since <date>.` and stop.

## 3. Collect the changes

`git log --first-parent --format='%H%x09%an%x09%s' <range>` lists one line per
merge or direct commit. For a merge, read the pull request title and number
from the subject or the merged commits. Then apply `references/rules.md`:
group, drop noise, and flag risks.

## 4. Write it

Use `references/format.md`. Under 250 words; cut detail before cutting
changes.

## 5. Remember

Only after writing the digest, save the head SHA to `.digest-state`, so a
failed run is retried from the same point tomorrow.
