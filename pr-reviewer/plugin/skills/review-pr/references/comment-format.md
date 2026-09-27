# Comment format

Brief, no emojis, every issue linked. A link must use the **full** head SHA
and a line range with at least one line of context either side, e.g.
`https://github.com/acme/app/blob/1d54823877c4de72b2316a64032a54afc404e619/src/pay.go#L41-L45`.
Never build the SHA with a shell expression — the comment is rendered as-is.

## With issues

```
### Code review

<one or two sentences: what the change does>

Found 2 issues:

1. <what goes wrong, and when> (CLAUDE.md says "<quoted rule>")

   <permalink>

2. <what goes wrong, and when> (bug: <the condition that triggers it>)

   <permalink>

<optional: one line on anything you could not verify>
```

## With none

```
### Code review

<one or two sentences: what the change does>

No issues found. Checked for bugs, history regressions, and compliance with the repository's rules.
```

## Asked to review again

Start with `Re-reviewed at <short sha>.` and say which earlier issues are now
resolved before listing any that remain or are new.
