# Release checklist

- **Build** — the CI status of the exact head commit is success (❌ if failed
  or pending).
- **Blockers** — no open issues or pull requests labelled `release-blocker`
  or milestone-blocked for this version (❌).
- **Unreleased changes** — there is at least one change since the last tag (❌ if none).
- **Migrations** — any database migrations since the last tag are listed (⚠️).
- **Config** — new or changed environment variables or config keys are
  listed with defaults (⚠️).
- **Breaking changes** — each has an upgrade step in the notes (❌ if missing).
- **Version** — the proposed version is greater than the last tag and
  matches semver for the changes (❌).
