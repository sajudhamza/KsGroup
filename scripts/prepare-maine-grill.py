#!/usr/bin/env python3
"""
Build The Maine Grill React site and copy it into
KsGroup/public/maine-grill/ for hosting at /maine-grill/
(same pattern as /fishbowl/ and /rickey/).
"""

from __future__ import annotations

import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT.parent / "The-Maine-Grill"
DEST = ROOT / "public" / "maine-grill"
PREFIX = "/maine-grill"
BASE = f"{PREFIX}/"


def ensure_built(dist: Path) -> None:
    if not SOURCE.exists():
        raise SystemExit(f"Maine Grill source not found: {SOURCE}")

    package_json = SOURCE / "package.json"
    if not package_json.exists():
        raise SystemExit(f"Missing package.json in {SOURCE}")

    node_modules = SOURCE / "node_modules"
    if not node_modules.exists():
        print("Installing The Maine Grill dependencies…")
        subprocess.run(["npm", "install"], cwd=SOURCE, check=True)

    print(f"Building The Maine Grill with base {BASE}…")
    subprocess.run(
        ["npm", "run", "build", "--", "--base", BASE],
        cwd=SOURCE,
        check=True,
    )

    if not dist.exists() or not (dist / "index.html").exists():
        raise SystemExit(f"Build did not produce {dist / 'index.html'}")


def main() -> None:
    dist = SOURCE / "dist"

    try:
        ensure_built(dist)
    except (subprocess.CalledProcessError, SystemExit) as err:
        if DEST.exists() and (DEST / "index.html").exists():
            print(f"Build failed ({err}); keeping existing {DEST}")
            return
        raise

    if DEST.exists():
        shutil.rmtree(DEST)

    shutil.copytree(dist, DEST)
    print(f"Copied Maine Grill → {DEST} (served at {BASE})")


if __name__ == "__main__":
    main()
