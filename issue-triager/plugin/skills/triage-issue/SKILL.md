---
name: triage-issue
description: Triage a newly opened issue — classify it, look for duplicates, and ask for what is missing. Use for every new issue and when a reporter answers a triage question.
---

# Triage an issue

The turn starts with a line naming the issue, like
`GitHub issue acme/app#128 https://github.com/acme/app/issues/128`, then its
title and body. Use the `github` MCP tools to read the issue, its comments,
and the repository; fall back to the GitHub API with `GITHUB_TOKEN`.

## 1. Skip what is not a new report

Reply with one short line and stop if the issue is already labelled and
assigned by a maintainer, is a pull request, or was opened by a bot.

## 2. Classify it

Pick one type with `references/types.md`, and for a bug, a severity with
`references/severity.md`. When the body is ambiguous, choose the most likely
reading and say which you chose.

## 3. Look for duplicates

Run three searches over open **and** closed issues, each with different words:

1. the most specific phrase in the title (an error message, a function name);
2. the component or feature name plus the symptom;
3. any error text or code quoted in the body, verbatim.

Read the top results. Call something a duplicate only if it describes the
same cause, not just the same area. A closed duplicate that was fixed is worth
linking with the release or commit that fixed it.

## 4. Check what is missing

Use the checklist for its type in `references/types.md`. Ask only for what is
really missing and would change what a maintainer does next — never for
information already in the issue.

## 5. Answer questions you can

If it is a question and the code or docs answer it, answer it, cite the file
or page, and suggest the reporter close the issue if that resolves it.

## 6. Labels

Find the repository's real labels (list them; never invent one). Map the type
and severity to the closest existing labels. If `TRIAGE_APPLY_LABELS` is
`true`, apply them; otherwise suggest them in the comment.

## 7. Write the comment

Use `references/comment-format.md`. Keep it under 150 words unless you are
answering a question.
