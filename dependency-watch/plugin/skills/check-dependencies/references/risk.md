# Ranking

1. **Known vulnerability, reachable** — the vulnerable function is called
   (govulncheck says so; for others, the package is a runtime dependency and
   the advisory's affected API is used). Severity high/critical first.
2. **Known vulnerability, not shown reachable** — runtime dependencies before
   dev-only ones.
3. **Unmaintained or deprecated** packages (the registry says so).
4. **Major versions behind** — breaking upgrades pile up; note the changelog link.
5. **Minor and patch behind** — list, collapsed.

Always give the fixed version when one exists, and say when no fix is
available yet.
