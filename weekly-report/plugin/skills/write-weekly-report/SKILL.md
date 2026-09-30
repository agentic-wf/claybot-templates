---
name: write-weekly-report
description: Write a report of one week across the repositories this agent works on — shipped, stuck, trends, decisions. Use on the daily schedule and when someone asks for a weekly report.
---

# Write the weekly report

## 0. On the schedule, only when due

The schedule fires daily so a missed Monday is caught up. On a scheduled
turn, if `reports/<YYYY>-W<last week's ISO number>.md` already exists, reply
only `Week <n> report already written.` and stop.

## 1. Set the week

Default: last Monday 00:00 to Sunday 23:59 UTC. Use the week asked for when
someone names one.

## 2. Collect, per repository

With `gh` or the API (`GITHUB_TOKEN`), or `git log` when only git is
available:

- pull requests **merged** in the week (title, number, author, labels);
- pull requests **open** longer than 3 days with no review, or with changes
  requested and no update for 3 days;
- issues **opened** and **closed** in the week; open issues with no reply
  from a maintainer after 2 days;
- releases or tags created.

## 3. Make sense of it

Group merged work into two to five themes by what it does (a feature, an
area, "maintenance"), not by repository. Pick the one headline. Compare
opened vs closed issues with the previous week if `reports/` has it.

## 4. Write

Use `references/format.md`, under 300 words. Save a copy as
`reports/<YYYY>-W<week>.md` for next week's comparison.

<!-- card -->
## Card

When `app_weekly_report` is among your tools and this turn did not come from Slack, Telegram or Discord, after step 4 also call `app_weekly_report` with `title`, the opening as `summary`, and the `shipped`, `stuck` (with `why`) and `decisions` items, each with an `id`, plus a `ref` naming the week. It returns at once — never wait on it; the report is still your reply.

The owner may decide later; that arrives as a new turn. `values.stuck` is a JSON array of the ids the owner selected. `values.comments`, when present, is a JSON array of `{target, quote?, body}`: the owner's own comments. A target is `summary:L<line>`, `decision <id>` or `stuck <id>`.
- `discuss` — for each selected stuck item, dig into why it is stuck (reviews, CI, discussion) and reply with what would unstick it, answering each comment.

If `app_weekly_report` is not among your tools, is refused, or comes back expired or cancelled, carry on exactly as the steps above say — the card is an extra, never a reason to stop.
<!-- /card -->
