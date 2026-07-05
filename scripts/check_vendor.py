#!/usr/bin/env python3
"""Verify vendored third-party assets against their checksum manifest.

The frontend analogue of the pinned-Action lint (ADR-0027, docs/security.md
threat 2): no vendored library file may change without a matching, human-
reviewed update to its VENDOR.md manifest. Parses the "Checksums" table in
each assets/vendor/*/VENDOR.md and asserts every listed file's sha256, and
that no unlisted files hide in the vendor dir.
"""
from __future__ import annotations

import hashlib
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
VENDOR = ROOT / "assets" / "vendor"
ROW = re.compile(r"^\|\s*`([^`]+)`\s*\|\s*(\d+)\s*\|\s*`([0-9a-f]{64})`\s*\|\s*$", re.M)

errors: list[str] = []
verified = 0

for manifest in sorted(VENDOR.glob("*/VENDOR.md")):
    base = manifest.parent
    listed: set[str] = set()
    for rel, size, want in ROW.findall(manifest.read_text(encoding="utf-8")):
        listed.add(rel)
        f = base / rel
        if not f.is_file():
            errors.append(f"{base.name}: manifest lists {rel!r} but the file is missing")
            continue
        got = hashlib.sha256(f.read_bytes()).hexdigest()
        actual_size = f.stat().st_size
        if got != want:
            errors.append(f"{base.name}/{rel}: sha256 {got} != manifest {want}")
        elif actual_size != int(size):
            errors.append(f"{base.name}/{rel}: size {actual_size} != manifest {size}")
        else:
            verified += 1
    # every non-manifest file under the vendor dir must be listed
    for f in sorted(base.rglob("*")):
        if not f.is_file() or f.name == "VENDOR.md":
            continue
        rel = str(f.relative_to(base))
        if rel not in listed:
            errors.append(f"{base.name}: {rel!r} is present but not in VENDOR.md (unpinned asset)")

if errors:
    for e in errors:
        print(f"::error::vendor: {e}")
    print(f"Vendor check FAILED: {len(errors)} problem(s)")
    sys.exit(1)
print(f"Vendor check OK: {verified} file(s) match their manifest")
