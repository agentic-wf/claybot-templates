#!/bin/sh
# Every template directory has what Claybot reads, and the marketplace lists
# exactly those directories' plugins. Claybot-api's own tests hold the
# contents to its review; this keeps the layout and the two indexes in step.
set -eu
cd "$(dirname "$0")/.."
fail=0
dirs=$(find . -mindepth 1 -maxdepth 1 -type d ! -name '.*' ! -name scripts | sed 's|^\./||' | sort)
for d in $dirs; do
  for f in template.yaml agent.yaml; do
    [ -f "$d/$f" ] || { echo "$d: missing $f"; fail=1; }
  done
  ls "$d"/plugin/skills/*/SKILL.md >/dev/null 2>&1 || { echo "$d: no plugin/skills/*/SKILL.md"; fail=1; }
  grep -q "\"source\": \"./$d/plugin\"" .claude-plugin/marketplace.json || { echo "$d: not listed in .claude-plugin/marketplace.json"; fail=1; }
done
listed=$(grep -o '"source": "\./[^/]*/plugin"' .claude-plugin/marketplace.json | sed 's|.*"\./\([^/]*\)/plugin"|\1|' | sort)
[ "$listed" = "$dirs" ] || { echo "marketplace.json lists: $listed"; echo "directories are:      $dirs"; fail=1; }
exit $fail
