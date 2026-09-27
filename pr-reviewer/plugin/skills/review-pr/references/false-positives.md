# Not worth a comment

Drop a candidate issue if it is any of these:

- **Pre-existing.** It was there before this pull request, or it is on a line
  the pull request did not change.
- **Not actually a bug.** It looks wrong but is correct in context — read the
  callers and the tests before claiming otherwise.
- **Tooling's job.** A linter, type checker, compiler, or formatter would
  catch it: imports, types, formatting, unused variables, broken tests. CI
  runs those; do not run them to find review comments.
- **Pedantic.** A nitpick a senior engineer would not raise.
- **Generic quality.** "Add tests", "improve docs", "consider security" —
  unless a rule file requires it for this kind of change.
- **Silenced.** A rule the code explicitly opts out of (a lint-ignore comment,
  a documented exception).
- **Intended.** A behaviour change that is plainly the point of the pull
  request, or follows directly from it.
