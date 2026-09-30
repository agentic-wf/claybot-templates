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
