# Deployment checklist

**Secrets**
- No secret values in the diff (keys, tokens, passwords, connection strings).
- Secrets come from a secret store or Kubernetes Secret, not plain env in manifests.

**Images and builds**
- Base and deployed images pinned by tag *and* ideally digest; never `latest`.
- Containers run as non-root; no `privileged`, no added capabilities without reason.
- Multi-stage builds don't copy build secrets or `.git` into the final image.

**Kubernetes / Helm**
- CPU and memory requests set; memory limit set.
- Readiness and liveness probes present and not identical.
- More than one replica for serving workloads; a PodDisruptionBudget if critical.
- `hostPath`, `hostNetwork`, and broad RBAC (`*` verbs or resources) justified.

**Terraform**
- Changes that force replacement of stateful resources (databases, volumes, buckets).
- `prevent_destroy` or deletion protection on data stores.
- Public exposure: `0.0.0.0/0` ingress, public buckets, public IPs.
- IAM: wildcards in actions or resources.

**CI workflows**
- `permissions:` minimal; no `write-all`.
- Third-party actions pinned to a SHA.
- `pull_request_target` never checks out and runs untrusted code.
- Secrets not echoed or passed to untrusted steps.
