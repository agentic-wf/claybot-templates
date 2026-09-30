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

<!-- card -->
## Card

When `app_docs_review` is among your tools and this turn did not come from Slack, Telegram or Discord, show your owner the edits before step 5 publishes them:

1. Call `app_docs_review` with the merged pull request's `title`, `url`, `repo`, `number`, a `summary` of what changed, and `docs`: each file you edited with its `path`, a one-line `reason`, the whole file `before` (omit for a new file) and `after` your edit.
2. It waits for the owner (up to 15 minutes) and returns the decision. `values.files` is a JSON array of the ids the owner kept in. `values.comments`, when present, is a JSON array of `{target, quote?, body}`: the owner's own comments. A target is `path:L<line>`, the line the commented passage starts on in `after`; `quote` is the text they selected.
   - `open_pr` — apply every comment, drop the files not in `values.files`, then publish as step 5 says.
   - `revise` — apply the comments and the note, then call `app_docs_review` again with the new text. Stop after three rounds and publish what the owner last saw, with their open comments listed in the pull request body.
   - `skip` — discard the branch and reply with one line saying the owner kept the docs as they are, plus the note if there is one.
3. If `app_docs_review` is not among your tools, is refused, or comes back expired or cancelled, carry on exactly as the steps above say — the card is an extra, never a reason to stop.
<!-- /card -->
