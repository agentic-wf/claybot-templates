---
name: investigate-error
description: Investigate a new or regressed Sentry error — locate the code, find the root cause and the change that introduced it, and propose a fix. Use for every Sentry delivery.
---

# Investigate an error

## 1. Read the event

From the payload take: the issue title and link, the exception type and
message, the in-app stack frames (file, function, line), the release, the
environment, first-seen time, event count, and users affected. Skip the
delivery with one line if it is a resolved or ignored notification.

## 2. Check out the release

Find the repository by the frames' file paths among the repositories this
agent works on. Fetch it and check out the release (a tag or SHA; fall back
to the default branch and say so).

## 3. Find the cause

Read each in-app frame from the top, with enough surrounding code to
understand the inputs. Answer: what value was wrong, where did it come from,
and why did the code not handle it? Confirm by tracing the data, not by
pattern-matching the exception name. Classify with `references/causes.md`.

## 4. Find when it started

`git log -L` the failing lines, and list what merged between the previous
release and this one that touches the files. Name the introducing change
when the evidence supports it; otherwise say it is older.

## 5. Propose a fix

Write the smallest correct patch as a unified diff, fixing the cause rather
than hiding the symptom (no blanket try/except). Add a regression test when
the repository has tests nearby. With `ERROR_OPEN_DRAFT_PR=true`, push it to
`fix/sentry-<issue id>` and open a draft pull request linking the Sentry issue.

## 6. Write the note

```
**<Exception>: <message>** · <service> <release> · <count> events, <users> users
<Sentry link>

**Root cause:** <one or two sentences, with file:line>
**Introduced by:** <PR/commit, or "older than <release>">
**Fix:** <what the patch does>

<diff, or the draft PR link>
```

<!-- card -->
## Card

When `app_error_fix` is among your tools and this turn did not come from Slack, Telegram or Discord, after step 6 also call `app_error_fix` with the error's `title`, `url`, `release`, `culprit`, your `cause`, the in-app `frames`, the `suspect` change, the proposed fix as `files` (a diff per file), and a `ref` naming the repository, the release and the Sentry issue. It returns at once — never wait on it; your note is still the reply.

The owner may decide later; that arrives as a new turn carrying the decision and `values.ref`. `values.comments`, when present, is a JSON array of `{target, quote?, body}`: the owner's own comments. A target is `cause:L<line>` or `path:line` in the fix.
- `open_draft_pr` — open a draft pull request with the fix, the comments applied. The owner's click is the permission ERROR_OPEN_DRAFT_PR otherwise gives; never push to a default branch or merge.
- `dig` — look further along the note and comments, and reply with what changed in your understanding.
- `not_a_bug` — record the issue and the note in `errors/not-bugs.md` and read it before investigating the same error again.

If `app_error_fix` is not among your tools, is refused, or comes back expired or cancelled, carry on exactly as the steps above say — the card is an extra, never a reason to stop.
<!-- /card -->
