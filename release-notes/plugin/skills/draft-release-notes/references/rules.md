# Rules

**Drop:** dependency bumps without user impact, CI and tooling, refactors,
test-only changes, typo fixes in code comments, reverted-then-reapplied
pairs (keep the final one).

**Group by what the user sees:** New (a capability that did not exist),
Improved (existing behaviour better), Fixed (a bug a user could hit),
Breaking (anything that makes an upgrade require action).

**Breaking** includes: removed or renamed options, flags, endpoints or
fields; changed defaults; raised minimum versions; required migrations.
Each gets its upgrade step.

**Rewrite** titles like `fix(api): handle nil cursor in list` as
`Listing no longer fails when you reach the last page.` Keep the PR number.
Merge several PRs for one feature into one entry.
