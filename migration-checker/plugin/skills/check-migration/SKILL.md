---
name: check-migration
description: Review the database migrations a pull request adds or changes for locking, downtime, data loss, and reversibility. Use for every pull request that touches migrations.
---

# Check a migration

## 1. Find the migrations

Check out the pull request. Migrations usually live in `migrations/`,
`db/migrate/`, `alembic/versions/`, `prisma/migrations/`, or files named
like `0042_*.sql`. None changed → stop.

Determine the engine from `$MIGRATION_DB_ENGINE`, else from the repository
(driver dependencies, docker-compose, ORM config).

## 2. Translate to SQL

For ORM migrations (Rails, Django, Alembic, Prisma, Ecto, golang-migrate),
work out the SQL each step runs. Read the actual migration, not its name.

## 3. Check each statement

Go through `references/rules.md`. For each statement decide: the lock it
takes and for how long, whether it rewrites the table, whether it can lose
data, and whether it is reversible.

## 4. Check the code side

A migration is only safe if the code deployed before and after it works
with the schema in between. Flag: a column dropped or renamed that the
current code still reads (`git grep` the name); a new `NOT NULL` column the
old code does not write.

## 5. Comment

```
Checked <n> migration(s) · assuming <engine version>

🔴 **<file>** — `<statement>`
<what happens on a large table>. **Safer:** <the pattern, with SQL>

✅ <file> — safe to run online.
```

<!-- card -->
## Card

When `app_migration_review` is among your tools and this turn did not come from Slack, Telegram or Discord, let your owner see the review before it is posted: after step 4, and before you write the final message:

1. Call `app_migration_review` with the pull request's `title`, `url`, `repo`, `number`, `author`, your `summary`, every finding you kept (`id`, `title`, `severity`, `category`, `file`, `line`, `body`, and `hunk`: the diff hunk around the line, copied from `git diff`), with `category` one of lock, downtime, data-loss or rollback, plus `engine` and the `sql` from step 2, and `files`: the changed files' patches (`path`, `patch`), at most 20.
2. It waits for the owner (up to 15 minutes) and returns the decision:
   - `post` — write the comment from the findings whose ids are in `values.keep` (a JSON array), with `values.summary` in place of your summary when present. Keep the format step 5 gives.
   - `request_changes` — the same, with the first line **Changes requested**.
   - `hold` — post nothing: end the turn with an empty final message.

   `values.comments`, when present, is a JSON array of `{target, quote?, body}`: the owner's own comments. A target is `path:line`, `path:-line` for a removed line, or `finding <id>`. Add each under a **Reviewer notes** heading, quoting the target, in the owner's words.
3. If `app_migration_review` is not among your tools, is refused, or comes back expired or cancelled, carry on exactly as the steps above say — the card is an extra, never a reason to stop.
<!-- /card -->
