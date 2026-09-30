---
name: review-deploy-change
description: Review a pull request's changes to Dockerfiles, Kubernetes/Helm, Terraform, or CI workflows for security, reliability, and cost risks. Use for every pull request that touches deployment configuration.
---

# Review a deployment change

## 1. Scope

Check out the pull request and list its changed files that match:
`Dockerfile*`, `*.dockerfile`, `k8s/`, `kubernetes/`, `charts/`, `helm/`,
`*.tf`, `*.tfvars`, `.github/workflows/`, `.gitlab-ci.yml`, `docker-compose*`.
Nothing matches → stop (one line if someone asked).

## 2. Review against the checklist

Read each matching hunk with its surrounding file and go through
`references/checklist.md`. For Terraform, also reason about the plan: which
resources would be replaced or destroyed?

## 3. Keep only real risks

A finding names the line, the concrete consequence, and the fix. Drop
style nits and anything the file already mitigates elsewhere (a limit set
in a values file, a policy enforced by the cluster). Rank: 🔴 must fix
before merge, 🟡 should fix, 🔵 consider.

## 4. Comment

```
Reviewed <n> deployment files.

🔴 **<title>** — `<file>:<line>`
<consequence>. <fix, with a snippet if short>

🟡 …
```

With nothing found: `Reviewed <n> deployment files; no risks found.`

<!-- card -->
## Card

When `app_deploy_review` is among your tools and this turn did not come from Slack, Telegram or Discord, let your owner see the review before it is posted: after step 3, and before you write the final message:

1. Call `app_deploy_review` with the pull request's `title`, `url`, `repo`, `number`, `author`, your `summary`, every finding you kept (`id`, `title`, `severity`, `category`, `file`, `line`, `body`, and `hunk`: the diff hunk around the line, copied from `git diff`), with `category` one of security, reliability or cost, and `kinds`, and `files`: the changed files' patches (`path`, `patch`), at most 20.
2. It waits for the owner (up to 15 minutes) and returns the decision:
   - `post` — write the comment from the findings whose ids are in `values.keep` (a JSON array), with `values.summary` in place of your summary when present. Group them by category as step 4 says.
   - `request_changes` — the same, with the first line **Changes requested**.
   - `hold` — post nothing: end the turn with an empty final message.

   `values.comments`, when present, is a JSON array of `{target, quote?, body}`: the owner's own comments. A target is `path:line`, `path:-line` for a removed line, or `finding <id>`. Add each under a **Reviewer notes** heading, quoting the target, in the owner's words.
3. If `app_deploy_review` is not among your tools, is refused, or comes back expired or cancelled, carry on exactly as the steps above say — the card is an extra, never a reason to stop.
<!-- /card -->
