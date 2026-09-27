# Grouping, noise, and risk

## Group by what it means for the team
Use the conventional-commit prefix or the pull request's labels when present:

| Group | Signals |
|---|---|
| Features | `feat`, labels `feature`/`enhancement` |
| Fixes | `fix`, labels `bug` |
| Performance | `perf` |
| Internal | `refactor`, `chore`, `build`, `ci`, `test`, `docs` |

With no signal, read the diff stat and the title and choose.

## Drop the noise
- Bot authors (dependabot, renovate, github-actions) — count them in one line
  instead ("12 dependency updates") unless a major version moved.
- A commit and its revert inside the same range — mention neither.
- Merge commits of the base branch into itself, version bumps, and
  formatting-only changes.

## Flag risks under "Watch out"
- Database migrations or schema files.
- Configuration, environment, or feature-flag defaults changed.
- CI, build, or deployment files changed.
- A dependency's **major** version bumped.
- Security-sensitive paths: auth, permissions, crypto, secrets handling.
- Reverts of something that shipped in an earlier digest.
- Large changes (more than ~500 lines) with no tests touched.
