---
name: sweep-stale
description: Find issues and pull requests with no recent activity, nudge each once, and report or close the ones that stayed silent. Use on the daily schedule and when asked to sweep.
---

# Sweep stale items

State lives in `stale/state.json`: for each `<repo>#<number>`, when you
nudged it and the comment's id.

## 1. Find candidates

For each repository this agent works on, list open issues and pull requests
whose last update is older than `$STALE_DAYS` days (default 30). Skip any
labelled `pinned`, `security`, or `keep-open`, and drafts by a maintainer.

## 2. Nudge the new ones

For a candidate not in the state file, post the comment from
`references/nudge.md` (the issue or pull request variant), then record it.

## 3. Check the nudged ones

For each item in the state file:
- someone other than you commented or pushed since the nudge → it is alive:
  remove it from the state;
- closed meanwhile → remove it;
- silent for `$STALE_GRACE_DAYS` (default 14) since the nudge → **ready to
  close**. With `STALE_CLOSE=true`, close it with the closing comment from
  `references/nudge.md`; otherwise only list it.

## 4. Report

```
**Stale sweep · <date>**
Nudged <n>: #12, #40, …
Came back to life: <n>
Ready to close (<n>): #3 <title> (quiet since <date>), …
<Closed <n> (STALE_CLOSE is on).>
```

With nothing to do: `Nothing stale today.`

<!-- card -->
## Card

When `app_stale_sweep` is among your tools and this turn did not come from Slack, Telegram or Discord, when step 3 finds items that stayed silent, also call `app_stale_sweep` with a one-line `title`, those `items` (`id`, `title`, `url`, `kind`, `quiet`, `nudged`) and a `ref` naming the repository. It returns at once — never wait on it.

The owner may decide later; that arrives as a new turn with `values.ref`. `values.items` is a JSON array of the ids the owner selected.
- `close` — close each selected item with a kind closing comment (the note, if any, goes in it). The owner's selection is the permission STALE_CLOSE otherwise gives, for these items only; `pinned`, `security` and `keep-open` items are still never touched.
- `keep_open` — add the `keep-open` label to each selected item if you can, otherwise list them in `stale/keep-open.md`, and never nudge them again.

If `app_stale_sweep` is not among your tools, is refused, or comes back expired or cancelled, carry on exactly as the steps above say — the card is an extra, never a reason to stop.
<!-- /card -->
