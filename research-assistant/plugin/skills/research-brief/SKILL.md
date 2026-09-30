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

<!-- card -->
## Card

When `app_research_brief` is among your tools and this turn did not come from Slack, Telegram or Discord, after step 5 also call `app_research_brief` with the question as `title`, the `brief`, each claim (`id`, `title`, `confidence`, `sources`) and a `ref` naming your notes file. It returns at once — never wait on it; the brief is still your reply.

The owner may decide later; that arrives as a new turn. `values.claims` is a JSON array of the ids the owner selected. `values.comments`, when present, is a JSON array of `{target, quote?, body}`: the owner's own comments. A target is `brief:L<line>` or `claim <id>`.
- `dig` — research the selected claims deeper, with the note as the angle, and reply with what held and what did not.
- `follow_up` — treat the note as a new question on the same notes.

If `app_research_brief` is not among your tools, is refused, or comes back expired or cancelled, carry on exactly as the steps above say — the card is an extra, never a reason to stop.
<!-- /card -->
