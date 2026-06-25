#!/usr/bin/env python3
"""
Copy The Rickey static mirror into KsGroup/public/rickey/ with paths
rewritten for hosting at www.kshospitalitygroup.com/rickey
"""

from __future__ import annotations

import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from microsite_footer import patch_microsite_html, strip_tao_references

SOURCE = ROOT / "rickey-mirror"
if not SOURCE.exists():
    SOURCE = ROOT.parent / "The rickey"
DEST = ROOT / "public" / "rickey"
PREFIX = "/rickey"
VENUE_SLUG = "venues/the-rickey-cocktail-lounge-new-york"

ASSET_DIRS = ("wp-content", "wp-includes", "_external", "wp-json")
EXTRA_PAGES = (
    "contact",
    "privacy-policy",
    "website-terms-of-use",
    "diversity-statement",
    "uk-tax-strategy",
    "press-inquiries",
    "careers",
    "giftcards",
    "sign-up",
    "special-events",
)

TEXT_EXTENSIONS = {
    ".html", ".htm", ".css", ".js", ".json", ".xml", ".svg", ".txt", ".map",
}

ROOT_REL_RE = re.compile(
    r'(?P<attr>href|src|action|data-src|data-background|poster|content)\s*=\s*(?P<q>["\'])/(?![/\s#]|rickey/)',
    re.I,
)
CSS_URL_RE = re.compile(r"""url\(\s*(?P<q>['"]?)/(?![/\s#]|rickey/)""", re.I)
CSS_URL_NO_QUOTE_RE = re.compile(r"""url\(\s*/(?![/\s#]|rickey/)""", re.I)


def rewrite_text(text: str) -> str:
    text = text.replace("https://taogroup.com/", f"{PREFIX}/")
    text = text.replace("http://taogroup.com/", f"{PREFIX}/")
    text = text.replace(f"/{VENUE_SLUG}/", f"{PREFIX}/")
    text = text.replace(f"/{VENUE_SLUG}", PREFIX)

    def attr_sub(match: re.Match[str]) -> str:
        return f'{match.group("attr")}={match.group("q")}{PREFIX}/'

    text = ROOT_REL_RE.sub(attr_sub, text)

    def css_sub(match: re.Match[str]) -> str:
        q = match.group("q") or ""
        return f"url({q}{PREFIX}/"

    text = CSS_URL_RE.sub(css_sub, text)
    text = CSS_URL_NO_QUOTE_RE.sub(f"url({PREFIX}/", text)

    text = text.replace(f'url={PREFIX}/{PREFIX}/', f'url={PREFIX}/')

    while f'{PREFIX}{PREFIX}' in text:
        text = text.replace(f'{PREFIX}{PREFIX}', PREFIX)

    text = strip_tao_references(text, PREFIX)
    return text


def write_rewritten(src: Path, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    if src.suffix.lower() in TEXT_EXTENSIONS or src.name.endswith(".min.js"):
        text = rewrite_text(src.read_text(encoding="utf-8", errors="ignore"))
        if src.suffix.lower() in {".html", ".htm"}:
            text = patch_microsite_html(text)
        dest.write_text(text, encoding="utf-8")
    else:
        shutil.copy2(src, dest)


def copy_tree_rewritten(src_dir: Path, dest_dir: Path) -> None:
    if not src_dir.exists():
        return
    for path in src_dir.rglob("*"):
        if path.is_dir():
            continue
        rel = path.relative_to(src_dir)
        write_rewritten(path, dest_dir / rel)


def main() -> None:
    if not SOURCE.exists():
        if DEST.exists():
            print(f"Rickey source not found at {SOURCE}; keeping existing {DEST}")
            return
        raise SystemExit(
            f"Rickey source not found. Copy the mirror to {ROOT / 'rickey-mirror'} "
            f"or place it at {ROOT.parent / 'The rickey'}"
        )

    if DEST.exists():
        shutil.rmtree(DEST)
    DEST.mkdir(parents=True)

    print(f"Preparing The Rickey at {DEST} ...")

    for name in ASSET_DIRS:
        copy_tree_rewritten(SOURCE / name, DEST / name)
        print(f"  assets: {name}")

    venue_src = SOURCE / VENUE_SLUG
    if not venue_src.exists():
        raise SystemExit(f"Missing venue folder: {venue_src}")

    for path in venue_src.rglob("*"):
        if path.is_dir():
            continue
        rel = path.relative_to(venue_src)
        write_rewritten(path, DEST / rel)
    print(f"  pages: {VENUE_SLUG} -> {PREFIX}/")

    for page in EXTRA_PAGES:
        page_src = SOURCE / page
        if page_src.exists():
            copy_tree_rewritten(page_src, DEST / page)
            print(f"  linked page: {page}")

    home = DEST / "index.html"
    if not home.exists():
        raise SystemExit("Rickey home index.html was not created")

    print(f"Done. The Rickey will be served at {PREFIX}/")


if __name__ == "__main__":
    main()
