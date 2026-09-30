---
name: check-dependencies
description: Check a repository's dependencies for known vulnerabilities and outdated versions, rank them by risk, and keep one "Dependency report" issue current. Use on the daily schedule (it runs weekly) and when asked.
---

# Check dependencies

## 0. On the schedule, only when due

The schedule fires daily so a missed day is caught up. On a scheduled turn,
read the date in `deps/last-run`; if it is less than 7 days old, reply only
`Next dependency check <date>.` and stop. After a full check, write today's
date there.

## 1. Detect ecosystems

Fetch each repository and find its manifests: `package.json` (+ lockfile),
`go.mod`, `requirements*.txt`/`pyproject.toml`/`poetry.lock`, `Cargo.toml`,
`Gemfile`, `pom.xml`/`build.gradle`. Handle monorepos: every manifest counts.

## 2. Run the tools

| Ecosystem | Vulnerabilities | Outdated |
|---|---|---|
| npm | `npm audit --json` | `npm outdated --json` |
| Go | `govulncheck ./...` | `go list -m -u -json all` |
| Python | `pip-audit -f json` | `pip list --outdated --format json` |
| Rust | `cargo audit --json` | `cargo outdated` |
| Ruby | `bundle audit` | `bundle outdated` |

Install a missing tool if the sandbox allows; otherwise say which check was
skipped. Never run install or upgrade commands that write to the repository.

## 3. Rank

Use `references/risk.md`. Deduplicate the same package across manifests.

## 4. Update the tracking issue

Find the open issue titled `Dependency report` (create it if missing) and
replace its body:

```
_Updated <date> · <n> manifests checked_

### 🔴 Vulnerabilities (<n>)
| Package | Installed | Fixed in | Advisory | Reachable |
|---|---|---|---|---|

### 🟡 Major versions behind (<n>)
### 🔵 Minor and patch behind (<n>) — collapsed list

Skipped: <checks that could not run, and why>
```

## 5. Reply

One line per repository: what is new or fixed since last week (compare with
`deps/<repo>.json`, then save the new results there), with the issue link.
`No change since <date>.` when nothing moved.
