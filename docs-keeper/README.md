# Docs keeper

Watches merged pull requests. When one changes a flag, a command, an API, an
environment variable, or default behaviour, it finds every place the docs
describe the old behaviour and opens a small pull request correcting them,
linking the change that made them stale.

**Needs:** a `GITHUB_TOKEN` secret that can push branches and open pull
requests, and the repository's webhook pointed at the agent (Pull requests).
