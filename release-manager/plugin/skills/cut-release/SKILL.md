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

<!-- card -->
## Card

When `app_release_scope` is among your tools and this turn did not come from Slack, Telegram or Discord, after step 2 and before step 3, call `app_release_scope` with `title`, `repo`, `base` (the last tag), `head` (the commit), every change since the tag (`id`, `title`, `url`, `author`, `kind`, `risk`) and the readiness `checks`. It waits for the owner (up to 15 minutes). `values.blockers` is a JSON array of the change ids the owner says must not ship. `values.comments`, when present, is a JSON array of `{target, quote?, body}`: the owner's own comments. A target is `change <id>`.
- `continue` with no blockers — go on to step 3, taking the comments into the notes.
- `continue` with blockers — a tag cannot leave a change out: say which blockers sit before `head`, propose the last commit before the first one as the release point, and stop until someone agrees.
- `stop` — stop, and reply with the note.

The sign-off in step 4 is still Claybot's release card. If `app_release_scope` is not among your tools, is refused, or comes back expired or cancelled, carry on exactly as the steps above say — the card is an extra, never a reason to stop.
<!-- /card -->
