# Stale sweeper

Every morning it finds issues and pull requests with no activity for
`STALE_DAYS` (30), posts one friendly question on each ("is this still
relevant?"), and remembers it did. Items that stay silent for
`STALE_GRACE_DAYS` (14) after the nudge are listed as ready to close — or
closed with a note, only if you set `STALE_CLOSE=true`. Pinned and security
items are left alone.

**Needs:** a `GITHUB_TOKEN` that can comment, and the repositories it works on.
