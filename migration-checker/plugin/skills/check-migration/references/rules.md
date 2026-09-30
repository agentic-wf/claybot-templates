# Migration rules (Postgres first; MySQL notes where different)

| Change | Risk | Safer pattern |
|---|---|---|
| `CREATE INDEX` | Blocks writes for the build | `CREATE INDEX CONCURRENTLY` (outside a transaction) |
| `ADD COLUMN ... NOT NULL` without default | Fails on existing rows / rewrite on old versions | Add nullable → backfill in batches → `SET NOT NULL` (Postgres 12+: validate a `CHECK` first) |
| `ADD COLUMN ... DEFAULT <volatile>` | Table rewrite | Add without default, backfill, then set default |
| `ALTER COLUMN TYPE` | Rewrite + exclusive lock | New column, dual-write, backfill, switch, drop |
| `ADD FOREIGN KEY` | Locks both tables while validating | `NOT VALID`, then `VALIDATE CONSTRAINT` separately |
| `DROP COLUMN` / rename | Old code breaks | Stop reading it in one deploy, drop in the next |
| `DROP TABLE` / `TRUNCATE` | Data loss | Require explicit confirmation and a backup note |
| Large `UPDATE`/`DELETE` | Long locks, replication lag | Batches of ~1–10k rows with pauses |
| No down migration | No rollback | Provide one, or state why it is irreversible |

MySQL: prefer `ALGORITHM=INPLACE, LOCK=NONE` where supported, or an online
schema change tool (gh-ost, pt-online-schema-change) for big tables.

Also set a `lock_timeout` (e.g. `SET lock_timeout = '5s'`) so a blocked
migration fails fast instead of queueing every query behind it.
