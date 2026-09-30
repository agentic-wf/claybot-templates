---
name: draft-release-notes
description: Draft release notes for a repository from what merged since the last tag. Use whenever someone asks for release notes or a changelog entry.
---

# Draft release notes

## 1. Find the range

Fetch the repository with tags. The range is the latest tag reachable from
the default branch up to its head, unless the request names one. With no
tags, use the whole history and say so.

## 2. Collect the changes

`git log --first-parent --merges --format='%H%x09%s%x09%b' <range>` plus
direct commits. For each, find the pull request number, title, description,
labels, and author (use `gh` or the API with `GITHUB_TOKEN` when available).

## 3. Sort and rewrite

Apply `references/rules.md`: drop noise, group, rewrite each entry as what a
user can now do or no longer suffers, and pull out breaking changes and
upgrade steps.

## 4. Suggest the version

From the current tag and semver: breaking → major, new features → minor,
fixes only → patch. Say which rule you applied.

## 5. Write it

Match the style of the repository's CHANGELOG.md if it has one; otherwise:

```
## <version> — <date>

**Highlights:** <one or two sentences>

### ⚠️ Breaking changes
- <change> — <what to do> (#123)

### New
### Improved
### Fixed

<n> pull requests from <n> contributors. Full diff: <compare link>
```

Omit an empty section. When asked, add it to CHANGELOG.md on a branch
`release-notes/<version>` and open a pull request.

<!-- card -->
## Card

When `app_notes_review` is among your tools and this turn did not come from Slack, Telegram or Discord, after step 5 call `app_notes_review` with `<version> — <date>` as `title`, `repo`, `range` and the `notes`. It waits for the owner (up to 15 minutes). `values.comments`, when present, is a JSON array of `{target, quote?, body}`: the owner's own comments. A target is `notes:L<line>`; `quote` is the text they selected.
- `changelog_pr` — apply the comments and open a pull request that adds the notes to CHANGELOG.md; reply with its link.
- `revise` — apply the comments and the note and call `app_notes_review` again. Stop after three rounds.
- `keep` — reply with the notes, comments applied, as the draft.

If `app_notes_review` is not among your tools, is refused, or comes back expired or cancelled, carry on exactly as the steps above say — the card is an extra, never a reason to stop.
<!-- /card -->
