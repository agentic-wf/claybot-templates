---
name: keep-timeline
description: Record incident updates on a timeline and answer status questions. Use for every message during an incident.
---

# Keep the timeline

Each incident lives in `incidents/<YYYY-MM-DD>-<slug>/` with `timeline.md`
and `meta.md` (title, started, severity, commander, status).

## Starting

"Incident: <title>" or the first update in a new thread starts one: create
the folder, record the start time, and reply
`Started incident <slug>. Post updates here; ask "status?" any time.`

## Recording an update

Append `- <HH:MM UTC> <who>: <what they said, trimmed to the fact>` to
`timeline.md`. Tag it when it is one of: **impact**, **action**, **finding**,
**decision**, **resolved** (only when a responder says so). Reply with a
short acknowledgement only — `Logged.` — so the thread stays readable.

## Answering "status?"

```
**<title>** · <severity> · <open for 1h 20m>
**Impact:** <latest impact statement>
**Doing now:** <latest actions>
**Known:** <findings so far>
**Next update:** <if someone committed to one>
```

Build it only from the timeline.
