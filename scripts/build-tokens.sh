#!/usr/bin/env bash
# Regenerate _sass/_tokens.scss from tokens/design-tokens.yml and validate
# the palette against WCAG AA. Bootstraps a local venv with pyyaml (same
# pattern as the platform repo's scripts). Pass --check to verify freshness
# and contrast without writing (CI mode).
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VENV="$REPO_ROOT/scripts/.venv"

if [ ! -x "$VENV/bin/python" ]; then
  python3 -m venv "$VENV"
  "$VENV/bin/pip" --quiet install 'pyyaml>=6,<7'
fi

"$VENV/bin/python" "$REPO_ROOT/scripts/check_contrast.py"
exec "$VENV/bin/python" "$REPO_ROOT/scripts/build_tokens.py" "$@"
