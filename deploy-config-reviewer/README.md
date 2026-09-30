# Deploy config reviewer

A second pair of eyes on the files that change production: Dockerfiles,
Kubernetes and Helm, Terraform, and CI workflows. It checks each change
against a checklist — secrets, privileges, pinned images, resource limits,
probes, destructive infrastructure changes, CI permissions — and comments
only on concrete risks, ranked, with the line and the fix.

**Needs:** a `GITHUB_TOKEN` that can read the repositories, and the
repository's webhook pointed at the agent (Pull requests, Issue comments).
