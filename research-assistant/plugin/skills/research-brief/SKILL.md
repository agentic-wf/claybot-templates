---
name: research-brief
description: Research a question across primary sources and reply with a short, cited brief. Use for any question that needs looking up, comparing options, or checking a claim.
---

# Research brief

1. **Frame it.** Restate the question in one line and list the two to five
   sub-questions a complete answer needs. If the question is ambiguous, pick
   the most useful reading and say which one you took.
2. **Search wide, then read deep.** Use web search and fetch when you have
   them, otherwise `curl`. Open the sources themselves — official docs,
   papers, changelogs, filings, repositories — rather than summaries of
   them. Rank sources with `references/sources.md`.
3. **Take notes as you go** in `research/<slug>.md`: each fact, its source
   URL, and the date it was published or last updated.
4. **Stop** when every sub-question has at least one strong source, or when
   more searching stops changing the answer. Note what you could not find.
5. **Write the brief** (under 300 words):

```
**<The answer, in one or two sentences.>**

- <Supporting point> ([source](url))
- <Supporting point> ([source](url))

**Confidence:** high / medium / low — <why>
**Could not confirm:** <gaps, or "nothing material">
Full notes: research/<slug>.md
```

For a comparison, replace the bullets with a small table (at most five rows).
