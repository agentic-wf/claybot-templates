# Claybot plugins (official)

Claybot's curated catalog: the agents the New agent page lists under
Development, Productivity, Monitoring, Deployment, and Automation. Claybot-api fetches
this repository (`--templates-repo`) and serves it at `GET /v1/templates`, so a
template added here reaches every Claybot within ten minutes, with no release.

The same repository is a Claude Code plugin marketplace, so the skills behind
each template also install on their own:

```
/plugin marketplace add claybots/claybot-plugins-official
/plugin install pr-reviewer@claybot-plugins-official
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
    apps/<name>/app.yaml                # the card's tool: input, actions, form — generated
    apps/<name>/app.html                # the card's page — generated
```

Claybot stages `skills/` (with every file beside a `SKILL.md`), `.mcp.json` and `apps/`.
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
| `category` | The New agent page's category: `Development`, `Productivity`, `Monitoring`, `Deployment`, or `Automation`. Keep four to ten per category. |
| `order` | Position within its category. |
| `runtime` | Optional `harness`, `provider`, `model` the template was written for, which quick create preselects. Leave it out to use the deployment's default (a free model). |

`agent.yaml` is an ordinary Claybot agent manifest. Leave out `provider`,
`model`, and `harness` so the deployment's defaults apply, and never put a
credential value in it: a secret is declared under `env` with `secret: true`
and linked by the operator.

## Cards

Every template ships one app: an MCP App card the agent opens in the owner's
console chat as the tool `app_<name>`, for the one decision its workflow has —
post this review, open this docs pull request, close these stale issues. The
card shows what the agent found (diffs with line comments, documents with
passage comments, findings to keep, rows to pick) and returns the owner's
decision; the agent then acts on it. The skill that owns the workflow says
when to call it, what each decision means, and to carry on as before when the
card is not offered (a deployment with package apps off, a Slack, Telegram or
Discord turn) or comes back unanswered.

The cards are generated. `scripts/apps/build.py` holds one spec per app and
writes its `app.yaml`, its `app.html` (the shared view in
`scripts/apps/lib.js` around `page.html` and the MCP Apps host protocol in
`protocol.js`, copied from Claybot's package-creator template) and the
`## Card` section of the owning skill. Change the spec or the view and run
`python3 scripts/apps/build.py`; `scripts/check.sh` fails when anything is out
of date. A gate card (`mode: gate`) holds the tool call up to 15 minutes; a
show card returns at once and the owner's later click becomes a new turn, so
scheduled and paging workflows never wait on a person.

A card's page lists no `csp`, so it reaches nothing outside itself, and a
decision is only ever one of its app.yaml's actions plus its flat `fields`:
comments and picked rows travel as JSON strings in those fields.

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
3. Give it a card: add a spec to `scripts/apps/build.py` and run it.
4. Run `scripts/check.sh`.
5. In the claybot repo, run
   `CLAYBOT_TEMPLATES_REPO=file://$PWD go test ./claybot-api/internal/api/playbook -run Template`,
   which puts every template through the review Create runs.

The whole repository is fetched in one clone, capped at 4 MiB of text and 4096
files (`packages.MaxCatalogBytes`; a Claybot from before the catalog cap reads
it against the 512 KiB package cap, which the cards exceed).
