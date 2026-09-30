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
  template.yaml                         # the gallery card — Claybot only
  agent.yaml                            # the agent: system prompt, schedule, mailbox, env
  README.md                             # what it does and what it needs
  plugin/                               # the marketplace plugin, staged into the agent
    .mcp.json                           # MCP servers (Claude Code dialect)
    skills/<name>/SKILL.md              # the procedure
    skills/<name>/references/*.md       # rubrics, checklists, formats the skill reads
```

Claybot stages `skills/` (with every file beside a `SKILL.md`) and `.mcp.json`.
It does not stage `commands/`, `agents/`, or hooks yet, so a template puts its
procedure in a skill and runs subagents from there when the harness has them.

`template.yaml`:

| key | |
|---|---|
| `title` | Card title, and the new agent's default name. |
| `summary` | One line under the title. |
| `icon` | A [lucide](https://lucide.dev/icons) icon name. |
| `connect` | Where work comes from: `github`, `gitlab`, `chat`, or `none`. Decides the step the console offers after Create. |
| `first_task` | A prompt put in the new agent's composer. |
| `categories` | The gallery shelves the card sits on, e.g. `[Engineering, Code]`. A card with none is shelved as Other. |
| `order` | Position in the gallery. |
| `runtime` | Optional `harness`, `provider`, `model` the template was written for, which quick create preselects. Leave it out to use the deployment's default (a free model). |

`agent.yaml` is an ordinary Claybot agent manifest. Leave out `provider`,
`model`, and `harness` so the deployment's defaults apply, and never put a
credential value in it: a secret is declared under `env` with `secret: true`
and linked by the operator.

## Writing a good template

The bar is [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official):
a template is a procedure, not a paragraph.

- **Steps, in order,** including when to stop early (drafts, bots, nothing to do).
- **Rubrics and checklists** in `references/`, so judgement is consistent:
  what counts, what is noise, how confident is confident enough.
- **An exact output format.** The agent's final message is what Claybot posts
  back to the thread, issue, or pull request — so say what it looks like, and
  tell the agent not to post it itself.
- **Guardrails** in `agent.yaml`: what the agent never does.
- **Declared needs:** every credential under `env` (`secret: true`, no value),
  and a `runtime` when the procedure needs more than the free default — MCP
  servers need a harness with MCP (Claude Code, Codex, OpenCode; not Pi).
- A forge-triggered turn starts with a line naming the resource, e.g.
  `GitHub pull request acme/app#42 https://github.com/acme/app/pull/42`.

## Adding a template

1. Copy a directory and edit it.
2. Add its plugin to `.claude-plugin/marketplace.json`.
3. Run `scripts/check.sh`.
4. In the claybot repo, run
   `CLAYBOT_TEMPLATES_REPO=file://$PWD go test ./claybot-api/internal/api/playbook -run Template`,
   which puts every template through the review Create runs.

The whole repository is fetched in one clone, capped at 512 KiB of text.
