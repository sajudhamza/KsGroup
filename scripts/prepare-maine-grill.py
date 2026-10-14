#!/usr/bin/env python3
"""
Build The Maine Grill React site and copy it into
KsGroup/public/maine-grill/ for hosting at /maine-grill/
(served under /maine-grill/ on the main domain).
"""

from __future__ import annotations

import re
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


def write_route_pages(dest: Path) -> None:
    """Give every client-side route its own index.html (e.g. menu/index.html).

    The host has no rewrite rule for /maine-grill/<route>, so opening or
    refreshing a sub-page directly would otherwise fall through to the KS
    homepage. The host redirects /maine-grill/menu to /maine-grill/menu/, so
    each copy carries <base href> to keep the app's relative image paths
    pointing at /maine-grill/.
    """
    index = (dest / "index.html").read_text(encoding="utf-8")
    bundle = "".join(p.read_text(encoding="utf-8", errors="ignore") for p in (dest / "assets").glob("*.js"))
    routes = sorted(set(re.findall(r'path:"/([a-z0-9][a-z0-9-]*)"', bundle)))
    if "<base " not in index:
        index = index.replace("<head>", f'<head>\n    <base href="{BASE}" />', 1)
        (dest / "index.html").write_text(index, encoding="utf-8")
    for route in routes:
        title = f"{route.replace('-', ' ').title()} | The Maine Grill"
        page = re.sub(r"<title>.*?</title>", f"<title>{title}</title>", index, count=1)
        (dest / route).mkdir(exist_ok=True)
        (dest / route / "index.html").write_text(page, encoding="utf-8")
    print(f"Route pages written for: {', '.join(routes) or 'none'}")


def main() -> None:
    if "--routes-only" in sys.argv:
        write_route_pages(DEST)
        return

    dist = SOURCE / "dist"

    try:
        ensure_built(dist)
    except (subprocess.CalledProcessError, SystemExit) as err:
        if DEST.exists() and (DEST / "index.html").exists():
            print(f"Build failed ({err}); keeping existing {DEST}")
            write_route_pages(DEST)
            return
        raise

    if DEST.exists():
        shutil.rmtree(DEST)

    shutil.copytree(dist, DEST)
    print(f"Copied Maine Grill → {DEST} (served at {BASE})")
    write_route_pages(DEST)


if __name__ == "__main__":
    main()
