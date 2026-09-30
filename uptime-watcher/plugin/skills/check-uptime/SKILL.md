---
name: check-uptime
description: Check every URL in UPTIME_URLS, compare with the last results, and report only what changed. Use on the schedule and when asked for status.
---

# Check uptime

## 1. Check

For each entry in `$UPTIME_URLS` (comma-separated; `url=text` means the body
must contain `text`):

```
curl -sS -o body.tmp -w '%{http_code} %{time_total}' --max-time 10 -L <url>
```

A check **fails** on a connection error, a timeout, a status of 400 or more,
or missing required text. It is **slow** above `$UPTIME_SLOW_MS` (default
2000 ms).

## 2. Compare

Read `uptime/state.json` (create it on first run): per URL, its current
state (`up`, `slow`, `down`), since when, and consecutive failures. Append
each result to `uptime/history.csv` (`time,url,status,ms,ok`).

- A URL becomes **down** after 2 consecutive failures.
- It **recovers** on the first success after being down.
- It is **slow** after 2 consecutive slow checks.

Save the new state.

## 3. Report

On a scheduled turn with no change: `All <n> checks passing.` and nothing else.

Otherwise, one line per change, worst first:

```
🔴 DOWN  <url> — <status or error> since <time> (<n> checks)
🟡 SLOW  <url> — <ms> ms (threshold <ms>)
🟢 UP    <url> — recovered after <duration>
```

When asked for status, list every URL with its state, last response time,
and uptime over the last 24 hours from `history.csv`.

<!-- card -->
## Card

When `app_uptime_status` is among your tools and this turn did not come from Slack, Telegram or Discord, when step 3 reports a change, also call `app_uptime_status` with a one-line `title` and every URL in `checks` (`id` = the URL, `status`, `ms`, `code`, `change`, `since`). It returns at once — never wait on it, and never call it for an all-clear.

The owner may decide later; that arrives as a new turn. `values.urls` is a JSON array of the ids the owner selected.
- `recheck` — run step 1 now and report.
- `mute` — add each selected URL with the note (it says for how long) to `uptime/muted.md`, and skip them in step 3's report until then.

If `app_uptime_status` is not among your tools, is refused, or comes back expired or cancelled, carry on exactly as the steps above say — the card is an extra, never a reason to stop.
<!-- /card -->
