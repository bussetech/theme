#!/usr/bin/env python3
"""Generate _sass/_tokens.scss from tokens/design-tokens.yml.

One source of truth (the YAML) → CSS custom properties + Sass variables.
Consuming sites (via remote_theme) pull the committed _tokens.scss; they
never run this script. So the generated file is committed, and CI runs this
with --check to fail the build if the committed CSS drifts from the tokens
(same freshness contract the platform uses for dns/zone.yml).

Custom properties are emitted under :root as `--<group>-<key>` (nested keys
joined with '-'). Sass variables mirror them as `$<group>-<key>` so partials
can use either. Nothing in _sass/ should hardcode a value that lives here.
"""
from __future__ import annotations

import pathlib
import sys

import yaml

REPO_ROOT = pathlib.Path(__file__).resolve().parent.parent
TOKENS = REPO_ROOT / "tokens" / "design-tokens.yml"
OUT = REPO_ROOT / "_sass" / "_tokens.scss"

# Token groups that become CSS custom properties + Sass vars, in emit order.
GROUPS = [
    ("type", "type"),
    ("space", "space"),
    ("gray", "gray"),
    ("color", "color"),
    ("border", "border"),
    ("radius", "radius"),
    ("layout", "layout"),
    ("breakpoint", "bp"),
]


def flatten(node, prefix: str, out: dict[str, str]) -> None:
    """Flatten nested scalars into 'prefix-key' -> value; skip non-scalars."""
    if isinstance(node, dict):
        for k, v in node.items():
            key = str(k).strip("'\"")
            flatten(v, f"{prefix}-{key}" if prefix else key, out)
    elif isinstance(node, (str, int, float)):
        out[prefix] = str(node)
    # lists (contrast_checks etc.) are not emitted


def render(tokens: dict) -> str:
    lines = [
        "// _tokens.scss — GENERATED from tokens/design-tokens.yml.",
        "// Do not edit by hand. Run scripts/build-tokens.sh after changing the",
        "// token source; CI (--check) fails if this file is stale.",
        "",
        ":root {",
    ]
    sass_vars: list[str] = []
    for group, alias in GROUPS:
        node = tokens.get(group)
        if node is None:
            continue
        flat: dict[str, str] = {}
        flatten(node, alias, flat)
        lines.append(f"  /* {group} */")
        for name, value in flat.items():
            lines.append(f"  --{name}: {value};")
            sass_vars.append(f"${name}: var(--{name});")
        lines.append("")
    lines.append("}")
    lines.append("")
    lines.append("// Sass aliases → the custom properties above.")
    lines.extend(sass_vars)
    lines.append("")
    return "\n".join(lines)


def main() -> int:
    check = "--check" in sys.argv
    tokens = yaml.safe_load(TOKENS.read_text())
    generated = render(tokens)

    if check:
        current = OUT.read_text() if OUT.exists() else ""
        if current != generated:
            print(
                "_sass/_tokens.scss is stale — run scripts/build-tokens.sh and commit.",
                file=sys.stderr,
            )
            return 1
        print("_sass/_tokens.scss is up to date.")
        return 0

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(generated)
    print(f"wrote {OUT.relative_to(REPO_ROOT)} ({generated.count(chr(10))} lines)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
