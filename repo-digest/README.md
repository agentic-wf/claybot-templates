# Daily repo digest

Every morning at 09:00, a one-minute summary of what merged on a branch since
the last digest: grouped into features, fixes, and internal work, with bot
updates, revert pairs, and formatting noise dropped, and risks — migrations,
config and CI changes, major dependency bumps, security-sensitive paths —
called out. It remembers the last commit it reported, so a missed morning is
covered the next day.

**Needs:** `REPO_URL`. Optional: `DIGEST_BRANCH`, and a `GITHUB_TOKEN` secret
for a private repository. Runs on the deployment's default model.
