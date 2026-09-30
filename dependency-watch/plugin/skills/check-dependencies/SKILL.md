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

<!-- card -->
## Card

When `app_dependency_report` is among your tools and this turn did not come from Slack, Telegram or Discord, after step 4 also call `app_dependency_report` with a one-line `title`, the report issue's `url`, the findings as `deps` (`id` = `<ecosystem>:<package>`, `title`, `risk`, `kind`, `advisory`, `url`, `reachable`) and a `ref` naming the repository. It returns at once — never wait on it.

The owner may decide later; that arrives as a new turn with `values.ref`. `values.deps` is a JSON array of the ids the owner selected. `values.comments`, when present, is a JSON array of `{target, quote?, body}`: the owner's own comments. A target is `dep <id>`.
- `accept_risk` — list the selected findings with the note under **Accepted risks** in the report issue, and leave them out of later rankings until a new advisory appears.
- `recheck` — run the check now, even off schedule.

If `app_dependency_report` is not among your tools, is refused, or comes back expired or cancelled, carry on exactly as the steps above say — the card is an extra, never a reason to stop.
<!-- /card -->
