"""HTML patches for Fishbowl and Rickey microsites (footer, rewards, etc.)."""

from __future__ import annotations

import re

TAO_FOOTER_RE = re.compile(
    r'<footer\s+id="tao-main-footer"[^>]*>.*?</footer>',
    re.DOTALL | re.IGNORECASE,
)

REWARDS_BANNER_SECTION_RE = re.compile(
    r'<section\b[^>]*>.*?Website-BannerWebBanner2025\.png.*?</section>',
    re.DOTALL | re.IGNORECASE,
)

REWARDS_NAV_BTN_RE = re.compile(
    r'<a\b[^>]*btn-main-cta[^>]*>\s*Rewards\s*</a>\s*',
    re.IGNORECASE,
)

REWARDS_MENU_CTA_RE = re.compile(
    r'<div class="col-lg-3[^"]*"[^>]*>\s*<div class="d-flex menu-lg-cta">.*?Join Rewards</a>\s*</div>\s*</div>\s*</div><!--End Col-->',
    re.DOTALL | re.IGNORECASE,
)

FOOTER_CSS = '<link rel="stylesheet" href="/ks-microsite-footer.css" id="ks-microsite-footer-css">'

KS_FOOTER_HTML = """<footer id="ks-hospitality-footer" class="ks-microsite-foot">
  <div class="ks-microsite-foot__grid">
    <div class="ks-microsite-foot__brand">
      <a href="/" class="ks-microsite-foot__logo">
        <span class="ks-microsite-foot__mark">KS</span>
        <span class="ks-microsite-foot__name">
          <strong>KS Hospitality Group</strong>
          <em>EST. 2024</em>
        </span>
      </a>
      <p class="ks-microsite-foot__tagline">A vertically integrated hospitality group.<br>Restaurants. Rooftops. Hotels. Residences.</p>
      <p class="ks-microsite-foot__contact"><a href="mailto:info@kshospitalitygroup.com">info@kshospitalitygroup.com</a></p>
      <p class="ks-microsite-foot__contact"><a href="tel:+16464238278">646-423-8278</a></p>
    </div>
    <div>
      <div class="ks-microsite-foot__heading">Navigate</div>
      <div class="ks-microsite-foot__links">
        <a href="/?page=portfolio">Portfolio</a>
        <a href="/?page=about">The Group</a>
        <a href="/?page=team">Team</a>
        <a href="/?page=contact">Contact</a>
      </div>
    </div>
    <div>
      <div class="ks-microsite-foot__heading">Categories</div>
      <div class="ks-microsite-foot__links">
        <a href="/?page=portfolio">Rooftops</a>
        <a href="/?page=portfolio">Lounges</a>
        <a href="/?page=portfolio">Real Estate</a>
        <a href="/?page=portfolio">Hotels</a>
      </div>
    </div>
    <div>
      <div class="ks-microsite-foot__heading">Follow</div>
      <div class="ks-microsite-foot__links">
        <a href="https://www.instagram.com/kshospitalitygroup/" target="_blank" rel="noopener noreferrer">Instagram →</a>
        <a href="mailto:careers@kshospitalitygroup.com">Careers →</a>
      </div>
    </div>
  </div>
  <div class="ks-microsite-foot__rule"></div>
  <div class="ks-microsite-foot__bottom">
    <span>© 2024 · KS Hospitality Group</span>
    <span>New York · Hamptons · Lewiston · Park City</span>
    <span>All rights reserved</span>
  </div>
</footer>"""


def inject_footer_css(html: str) -> str:
    if "ks-microsite-footer.css" in html:
        return html
    match = re.search(r"</head>", html, re.IGNORECASE)
    if not match:
        return html
    insert_at = match.start()
    return html[:insert_at] + f"  {FOOTER_CSS}\n" + html[insert_at:]


def remove_rewards_content(html: str) -> str:
    html = REWARDS_BANNER_SECTION_RE.sub("", html)
    html = REWARDS_MENU_CTA_RE.sub("", html)
    while True:
        updated = REWARDS_NAV_BTN_RE.sub("", html)
        if updated == html:
            break
        html = updated
    return html


def replace_tao_footer(html: str) -> str:
    if 'id="tao-main-footer"' not in html and 'id="ks-hospitality-footer"' not in html:
        return html
    html = TAO_FOOTER_RE.sub(KS_FOOTER_HTML, html)
    return inject_footer_css(html)


def patch_microsite_html(html: str) -> str:
    html = remove_rewards_content(html)
    return replace_tao_footer(html)
