# Dependency watch

Once a week it runs the ecosystem's own tools on each repository this
agent works on — `npm audit`/`npm outdated`, `govulncheck`/`go list -u`,
`pip-audit`, `cargo audit`, `bundle audit` — ranks what it finds (known
vulnerabilities first, then major versions behind, then the rest), and
keeps a single "Dependency report" issue per repository current.

**Needs:** a `GITHUB_TOKEN` that can create and edit issues, and the
repositories it works on. The sandbox needs the language toolchains; say
which in the first chat if they are missing.
