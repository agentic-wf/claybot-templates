---
name: write-postmortem
description: Draft a blameless postmortem from an incident's timeline. Use when an incident is resolved and someone asks for the postmortem or review.
---

# Write the postmortem

1. Read `timeline.md` and `meta.md` for the incident.
2. Compute the key times: started, detected, mitigated, resolved, and
   durations between them.
3. Fill `references/postmortem.md`. Every fact comes from the timeline;
   anything the timeline does not answer goes under **Open questions**
   rather than being guessed.
4. Keep it blameless: describe what systems and processes allowed the
   failure, never who "should have" done what.
5. Save it as `postmortem.md` in the incident's folder and reply with the
   summary section and the file path.
