# Alert triager

Point PagerDuty, Datadog, or Grafana at this agent (Setup › Wakes up when).
For each alert it decides whether it is new, a repeat, or already resolved,
rates its severity, checks what merged or deployed shortly before it fired,
and writes a short note: what is wrong, how bad, the likely cause, and the
first thing to check. It never touches production.

**Needs:** a webhook from each tool. Optional: a `GITHUB_TOKEN` and the
repositories it works on, to tie alerts to recent changes.
