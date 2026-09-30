---
name: cut-release
description: Prepare, sign off and publish a release of a repository — readiness checks, version, notes, owner approval, then tag and GitHub release. Use when someone asks to release, cut, or ship a version.
---

# Cut a release

## 1. Prepare

Fetch the repository with tags. Identify the head commit of the default
branch (or the branch named) and the latest release tag.

## 2. Check readiness

Work through `references/checklist.md`. Each item is ✅, ⚠️ (proceed, but
say so), or ❌ (blocks). Any ❌ stops the release: reply with the blockers
and what would clear them.

## 3. Propose version and notes

Suggest the version by semver from what merged since the last tag. Draft the
notes the way the draft-release-notes procedure does: grouped, user-facing,
breaking changes with upgrade steps.

## 4. Get sign-off

In the console, call Claybot's `release` tool with the version, the
checklist items and their state, and the notes, and wait for the decision.
On a chat platform, post the same as text and ask for an explicit "yes,
release <version>". Anything else — silence, edits, "looks good?" — is not a
sign-off; apply requested edits and ask again.

## 5. Publish

Re-check that the head commit has not moved and the build is still green.
Then create an annotated tag `v<version>` on that commit, push the tag, and
create the GitHub release with the notes (`gh release create` or the API).

## 6. Report

```
Released <repo> v<version> · <tag link> · <release link>
From <short sha>. <n> changes. Deploy: <what the tag triggers, if known>
```
