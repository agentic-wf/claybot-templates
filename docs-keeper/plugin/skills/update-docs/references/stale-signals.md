# Changes that usually make docs stale

- A CLI flag, subcommand, or option added, renamed, or removed.
- An environment variable or config key added, renamed, or its default changed.
- An HTTP route, request field, response field, or status code changed.
- A public function's signature or behaviour changed.
- A setup step added (a new service, a migration, a required secret).
- A limit changed (size, rate, timeout).
- Something deprecated or removed.

Places to look beyond `docs/`: the README's quick start, `CONTRIBUTING.md`,
`.env.example`, Helm `values.yaml` comments, OpenAPI files, `--help` strings,
and code samples in doc comments.
