# Release manager

"Release acme/app" — it checks the release is ready (green build on the head
commit, no open blockers, migrations and config noted), proposes the next
version and the notes, and asks you to sign off on a release card in the
console. Only after you approve does it create the tag and the GitHub
release. It never deploys, and never releases a red build.

**Needs:** a `GITHUB_TOKEN` that can create tags and releases, and the
repositories it works on. Recommended runtime: Claude Code (the sign-off
card is an MCP app).
