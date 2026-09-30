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

<!-- card -->
## Card

When `app_alert_triage` is among your tools and this turn did not come from Slack, Telegram or Discord, after step 5 also call `app_alert_triage` with the alert's `title`, `severity`, `source`, `url`, your note as `summary`, the candidate `changes` from step 4 (`title`, `url`, `when`, `why`), the checks for a person as `next`, and a `ref` naming the alert and the repositories you looked at. It returns at once — never wait on it; your note is still the reply.

The owner may decide later; that arrives as a new turn carrying the decision and `values.ref`. `values.comments`, when present, is a JSON array of `{target, quote?, body}`: the owner's own comments. A target is `summary:L<line>` or `change <id>`.
- `dig` — investigate further along the note and comments, and reply with what you found.
- `false_alarm` — record the alert's signature and the note in `alerts/false-alarms.md`, which step 2 reads when it dedupes.
- `escalate` — draft a short escalation message for a person to send: impact, what is known, what is not.

If `app_alert_triage` is not among your tools, is refused, or comes back expired or cancelled, carry on exactly as the steps above say — the card is an extra, never a reason to stop.
<!-- /card -->
