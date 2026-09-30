---
name: update-docs
description: Find the documentation a merged pull request made wrong and open a pull request that fixes it. Use for every merged pull request that changes behaviour, configuration, commands, or public APIs.
---

# Update the docs a change made stale

## 1. Only merged, only meaningful

Stop silently unless the pull request is merged. Stop with nothing to report
if it changes only tests, CI, internal refactors, or dependencies.

## 2. Read the change

Clone or fetch the repository and read the merged diff. Write down each
**observable** change: a renamed flag, a new env var, a changed default, a
removed endpoint, a new required step. See `references/stale-signals.md`.

## 3. Search for the old truth

For each change, search the docs for the old name, value, or behaviour:
`git grep -n -i '<old>' -- '*.md' docs/ '*.rst' '*.txt'` plus doc comments,
`--help` text, example configs, and the CHANGELOG's unreleased section.
Also check whether a new feature needs a line where its siblings are
documented.

## 4. Fix only what is wrong

Edit in the docs' own voice and format. Change the minimum: the wrong value,
the missing option, the stale example. Do not restyle a page.

## 5. Publish

Branch `docs/pr-<number>` off the default branch, commit, push, and open a
pull request titled `Docs for #<number>: <summary>` that lists each file and
the sentence that was wrong.

## 6. Reply

```
Updated the docs this change affects in #<new pr>:
- `<file>` — <what was wrong>
```

When nothing was stale, say nothing unless someone asked; then:
`Checked <n> doc files; none describe what this changed.`
