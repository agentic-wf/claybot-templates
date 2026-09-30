---
name: triage-alert
description: Triage one monitoring alert from PagerDuty, Datadog, or Grafana — dedupe it, rate it, tie it to recent changes, and write the on-call note. Use for every alert delivery.
---

# Triage an alert

The turn starts with `Webhook delivery from <source>` and the raw payload.

## 1. Read the payload

Pull out: alert name, service, environment, status (firing / resolved),
the metric and threshold, the value, when it started, and any link back to
the tool. Payload shapes differ per tool; read the fields, don't assume them.

## 2. Dedupe

Look in `alerts/open.md` in the workspace for the same alert and service.
- **Resolved** delivery for an open alert: remove it from `open.md`, reply
  `Resolved: <alert> after <duration>.` and stop.
- **Repeat** of an open alert: reply with one line (`Still firing: … since
  <time>, <n> repeats.`) and update the count. Stop.
- **New**: add it to `open.md` with its start time and continue.

## 3. Rate it

Use `references/severity.md`. Severity is about user impact, not the
number's size.

## 4. Look for the cause

- Recent changes: for the repositories this agent works on, list what merged
  to the default branch in the 3 hours before the alert
  (`git log --since` on a fresh fetch). Name the ones that touch the alerting
  service.
- Related alerts: anything else in `open.md` that started within 15 minutes.
- Obvious patterns: a round-hour start (cron), a gradual climb (leak,
  growth), a cliff (deploy, dependency outage).

Rank at most three likely causes. It is fine to say "no evidence yet".

## 5. Write the note

```
**<SEV> · <alert> · <service> (<env>)** — firing since <time>
<One sentence: what is wrong for users.>

**Likely cause:** <cause> — <evidence>
**Check first:** <the single most useful next step>
**Recent changes:** <PR/commit links, or "none in the last 3h">
<link to the alert>
```
