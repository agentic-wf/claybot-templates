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
