#!/usr/bin/env python3
"""WCAG contrast validator for the studio theme palette.

Reads tokens/design-tokens.yml and asserts every intended
text/background pairing meets its WCAG 2.1 target ratio (AA = 4.5:1
for normal text, 3:1 for large text and UI component boundaries).

The pairings live under `contrast_checks:` in the token file so the
palette and its guarantees stay in one place. CI runs this; a failing
pair fails the build. This is the machine proof behind the acceptance
criterion "all text/background pairs pass WCAG AA".
"""
from __future__ import annotations

import pathlib
import sys

import yaml

REPO_ROOT = pathlib.Path(__file__).resolve().parent.parent
TOKENS = REPO_ROOT / "tokens" / "design-tokens.yml"


def _linear(c: float) -> float:
    c = c / 255.0
    return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4


def luminance(hex_color: str) -> float:
    h = hex_color.lstrip("#")
    r, g, b = (int(h[i : i + 2], 16) for i in (0, 2, 4))
    return 0.2126 * _linear(r) + 0.7152 * _linear(g) + 0.0722 * _linear(b)


def contrast(fg: str, bg: str) -> float:
    l1, l2 = luminance(fg), luminance(bg)
    hi, lo = max(l1, l2), min(l1, l2)
    return (hi + 0.05) / (lo + 0.05)


def resolve(tokens: dict, ref: str) -> str:
    """Resolve a dotted token path (e.g. 'color.action.strong') or a literal hex."""
    if ref.startswith("#"):
        return ref
    node = tokens
    for part in ref.split("."):
        node = node[part]
    if not isinstance(node, str) or not node.startswith("#"):
        raise ValueError(f"token {ref!r} did not resolve to a hex color (got {node!r})")
    return node


def main() -> int:
    tokens = yaml.safe_load(TOKENS.read_text())
    checks = tokens.get("contrast_checks", [])
    if not checks:
        print("no contrast_checks defined", file=sys.stderr)
        return 1

    failures = 0
    print(f"{'PAIR':<48} {'RATIO':>7}  {'MIN':>4}  RESULT")
    print("-" * 72)
    for chk in checks:
        fg = resolve(tokens, chk["fg"])
        bg = resolve(tokens, chk["bg"])
        target = float(chk.get("min", 4.5))
        ratio = contrast(fg, bg)
        ok = ratio >= target
        failures += not ok
        label = f"{chk['name']} ({fg} on {bg})"
        print(f"{label:<48} {ratio:>6.2f}:1 {target:>5.1f}  {'PASS' if ok else 'FAIL'}")

    print("-" * 72)
    if failures:
        print(f"{failures} pair(s) FAILED WCAG target", file=sys.stderr)
        return 1
    print(f"all {len(checks)} pairs pass")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
