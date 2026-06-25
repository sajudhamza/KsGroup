#!/usr/bin/env python3
"""Prepare all venue microsites bundled into KsGroup."""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = ("prepare-fishbowl.py", "prepare-rickey.py")


def main() -> None:
    for name in SCRIPTS:
        path = ROOT / "scripts" / name
        print(f"\n=== {name} ===")
        result = subprocess.run([sys.executable, str(path)], cwd=ROOT)
        if result.returncode != 0:
            raise SystemExit(result.returncode)


if __name__ == "__main__":
    main()
