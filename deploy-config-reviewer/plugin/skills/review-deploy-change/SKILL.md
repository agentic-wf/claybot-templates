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
