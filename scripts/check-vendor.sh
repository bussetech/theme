#!/usr/bin/env bash
# Verify vendored third-party assets (assets/vendor/*) against their VENDOR.md
# checksum manifests. No deps beyond python3 stdlib. Runs in CI (ADR-0027).
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
exec python3 "$REPO_ROOT/scripts/check_vendor.py"
