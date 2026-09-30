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
