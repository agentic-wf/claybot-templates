# Migration checker

Catches the migration that takes production down: a table rewrite under an
exclusive lock, an index built without `CONCURRENTLY`, a `NOT NULL` column
added to a big table, a column dropped while the old code still reads it,
or a change with no way back. For each migration in a pull request it says
what locks it takes, whether it is safe to run while serving traffic, and
the safer way to write it.

**Needs:** a `GITHUB_TOKEN` that can read the repositories, and the
repository's webhook pointed at the agent. Set `MIGRATION_DB_ENGINE` if the
repository does not make it obvious.
