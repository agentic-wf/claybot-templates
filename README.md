# Claybot templates

The starting points Claybot's new-agent gallery offers. Claybot-api fetches
this repository (`--templates-repo`) and serves it at `GET /v1/templates`, so a
template added here reaches every Claybot within ten minutes, with no release.

The same repository is a Claude Code plugin marketplace, so the skills behind
each template also install on their own:

```
/plugin marketplace add agentic-wf/claybot-templates
/plugin install pr-reviewer@claybot-templates
```

## Layout

One directory per template. The directory name is the template's id.

```
pr-reviewer/
  template.yaml          # the gallery card — Claybot only
  agent.yaml             # the agent: system prompt, schedule, mailbox, env
  plugin/skills/<name>/SKILL.md   # the skills — also the marketplace plugin
```

`template.yaml`:

| key | |
|---|---|
| `title` | Card title, and the new agent's default name. |
| `summary` | One line under the title. |
| `icon` | A [lucide](https://lucide.dev/icons) icon name. |
| `connect` | Where work comes from: `github`, `gitlab`, `chat`, or `none`. Decides the step the console offers after Create. |
| `first_task` | A prompt put in the new agent's composer. |
| `order` | Position in the gallery. |

`agent.yaml` is an ordinary Claybot agent manifest. Leave out `provider`,
`model`, and `harness` so the deployment's defaults apply, and never put a
credential value in it: a secret is declared under `env` with `secret: true`
and linked by the operator.

## Adding a template

1. Copy a directory and edit it.
2. Add its plugin to `.claude-plugin/marketplace.json`.
3. Run `scripts/check.sh`.
4. In the claybot repo, run
   `CLAYBOT_TEMPLATES_REPO=file://$PWD go test ./claybot-api/internal/api/playbook -run Template`,
   which puts every template through the review Create runs.

The whole repository is fetched in one clone, capped at 512 KiB of text.
