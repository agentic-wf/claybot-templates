# Error investigator

Connect Sentry (Setup › Wakes up when › Sentry). For each new or regressed
issue it finds the failing line in your repository at the release that threw
it, works out why, checks which recent change introduced it, and writes a
note with the root cause and a proposed patch. Optionally it opens the patch
as a draft pull request.

**Needs:** Sentry's webhook, the repositories it works on, and a
`GITHUB_TOKEN` that can read them.
