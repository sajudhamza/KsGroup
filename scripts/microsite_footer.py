"""HTML patches for Fishbowl and Rickey microsites (footer, rewards, etc.)."""

from __future__ import annotations

import re

TAO_FOOTER_RE = re.compile(
    r'<footer\s+id="tao-main-footer"[^>]*>.*?</footer>',
    re.DOTALL | re.IGNORECASE,
)

REWARDS_BANNER_SECTION_RE = re.compile(
    r'<section\b[^>]*>(?:(?!</section>).)*?Website-BannerWebBanner2025\.png(?:(?!</section>).)*?</section>',
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

KS_EMAIL = "info@kshospitalitygroup.com"
KS_PHONE = "646-423-8278"
KS_PHONE_TEL = "+16464238278"
KS_SITE = "https://www.kshospitalitygroup.com"
KS_HOST = "www.kshospitalitygroup.com"
KS_THEME_PATH_TOKEN = "__KS_THEME_PATH__"

WEGLOT_RE = re.compile(
    r'<script type="application/json" id="weglot-data">.*?</script>\s*',
    re.DOTALL | re.IGNORECASE,
)

TAO_NAVBAR_BRAND_RE = re.compile(
    r'<a class="navbar-brand d-flex align-items-center" href="[^"]*" rel="home" title="[^"]*">\s*<svg.*?</svg>\s*</a>',
    re.DOTALL | re.IGNORECASE,
)

TAO_MOBILE_NAV_LOGO_RE = re.compile(
    r'<li class="d-block d-lg-none ms-3 pb-4 pl-3"[^>]*>\s*<svg[^>]*class="svg-footer-logo"[^>]*>.*?</svg>\s*</li>',
    re.DOTALL | re.IGNORECASE,
)

CORPORATE_CONTACT_LINKS_RE = re.compile(
    r'<div class="content-block__links">\s*(?:<a\s+class="btn btn-link btn-link--underline my-2"[^>]*>.*?</a>\s*)+</div>',
    re.DOTALL | re.IGNORECASE,
)

CORPORATE_CONTACT_INTRO_RE = re.compile(
    r"<p>Have general questions or comments for (?:Tao Group Hospitality|KS Hospitality Group)\?</p>",
    re.IGNORECASE,
)

TAO_CONTACT_HEADROOM_RE = re.compile(
    r'<div class="headroom[^"]*">.*?</div><!--End Headroom-->',
    re.DOTALL | re.IGNORECASE,
)

CONTACT_FORM_REGION_OPTIONS = """<option value="Select a Contact">Select a Contact</option>
<option value="New York">New York</option>
<option value="Hamptons">Hamptons</option>
<option value="Maine">Maine</option>
<option value="Park City">Park City</option>
<option value="Press Inquiries">Press Inquiries</option>"""

CONTACT_FORM_NY_LOCATIONS_SHORTCODE = (
    '[select* newyork-locations first_as_label class:form-control '
    '"Select A Location" "Elsie Rooftop" "Elsie Penthouse" "Rosehill Rooftop" '
    '"Stone & Soil" "Skewr" "Brewr" "Casa CeCe" "The Rickey" "Fishbowl" '
    '"LIC Manhattan View Hotel"]'
)

CONTACT_FORM_HIDDEN_FIELDSET = (
    '<fieldset class="hidden-fields-container"><input type="hidden" name="_wpcf7" value="3133" />'
    '<input type="hidden" name="_wpcf7_version" value="6.1.6" />'
    '<input type="hidden" name="_wpcf7_locale" value="en_US" />'
    '<input type="hidden" name="_wpcf7_unit_tag" value="wpcf7-f3133-o1" />'
    '<input type="hidden" name="_wpcf7_container_post" value="0" />'
    '<input type="hidden" name="_wpcf7_posted_data_hash" value="" />'
    '<input type="hidden" name="_wpcf7cf_hidden_group_fields" value="[]" />'
    '<input type="hidden" name="_wpcf7cf_hidden_groups" value="[]" />'
    '<input type="hidden" name="_wpcf7cf_visible_groups" value="[]" />'
    '<input type="hidden" name="_wpcf7cf_repeaters" value="[]" />'
    '<input type="hidden" name="_wpcf7cf_steps" value="{}" />'
    '<input type="hidden" name="_wpcf7cf_options" value="{&quot;form_id&quot;:3133,'
    '&quot;conditions&quot;:[{&quot;then_field&quot;:&quot;newyork-locations&quot;,'
    '&quot;and_rules&quot;:[{&quot;if_field&quot;:&quot;contact&quot;,'
    '&quot;operator&quot;:&quot;equals&quot;,&quot;if_value&quot;:&quot;New York&quot;}]}],'
    '&quot;settings&quot;:{&quot;animation&quot;:&quot;yes&quot;,'
    '&quot;animation_intime&quot;:200,&quot;animation_outtime&quot;:200,'
    '&quot;conditions_ui&quot;:&quot;normal&quot;,&quot;notice_dismissed&quot;:false,'
    '&quot;repeater_remove_button&quot;:&quot;bottom&quot;,'
    '&quot;notice_dismissed_rollback-cf7-5.9.5&quot;:true}}" />'
    '<input type="hidden" name="_wpcf7_recaptcha_response" value="" />\n</fieldset>'
)

SITE_CONTENT_RE = re.compile(
    r'<main class="site-content" id="content">.*?</main>',
    re.DOTALL | re.IGNORECASE,
)

SPECIAL_EVENTS_PAGE_RE = re.compile(
    r"<title>[^<]*Special Events[^<]*</title>",
    re.IGNORECASE,
)

CONTACT_REGION_SELECT_RE = re.compile(
    r'(<select class="wpcf7-form-control wpcf7-select[^"]*"[^>]*name="contact"[^>]*>).*?(</select>)',
    re.DOTALL | re.IGNORECASE,
)

NY_LOCATIONS_FIELD_RE = re.compile(
    r"<p>New York Locations.*?(\[select\* newyork-locations.*?\])\s*</p>",
    re.DOTALL | re.IGNORECASE,
)

TAO_FAVICON_BLOCK_RE = re.compile(
    r"<!-- Fav and touch icons -->.*?<meta name=\"msapplication-square310x310logo\"[^>]*>\s*",
    re.DOTALL | re.IGNORECASE,
)

KS_FAVICON_HTML = """<!-- KS favicon -->
<link rel="icon" href="/ks-favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/ks-favicon.svg">
<link rel="shortcut icon" href="/ks-favicon.svg">
<meta name="theme-color" content="#0e0d0b">
<meta name="application-name" content="KS Hospitality Group">
"""

FOOTER_CSS = '<link rel="stylesheet" href="/ks-microsite-footer.css" id="ks-microsite-footer-css">'

VENUE_BY_PREFIX = {
    "/rickey": ("The Rickey", "/rickey/"),
    "/fishbowl": ("Fishbowl", "/fishbowl/"),
}

KS_VENUE_CATEGORIES = (
    {
        "name": "Rooftops",
        "venues": (
            ("Elsie Rooftop", "https://www.elsierooftop.com", "Midtown, NY"),
            ("Elsie Penthouse", "http://www.elsiepenthouse.com", "Midtown, NY"),
            ("Rosehill Rooftop", "http://www.rosehillrooftop.com", "Rose Hill, NY"),
        ),
    },
    {
        "name": "Lounges",
        "venues": (
            ("Stone & Soil", "/?page=portfolio", "Rose Hill, NY"),
            ("Skewr", "/?page=portfolio", "Rose Hill, NY"),
            ("Brewr", "/?page=portfolio", "Rose Hill, NY"),
            ("Casa CeCe", "/?page=portfolio", "Midtown, NY"),
            ("Premiere Park City", "http://www.premiereparkcity.com", "Park City, UT"),
            ("The Rickey", "/rickey/", "Dream Midtown, NY"),
            ("Fishbowl", "/fishbowl/", "Dream Midtown, NY"),
        ),
    },
    {
        "name": "Hotels",
        "venues": (
            ("Clarion Lewiston Maine", "/?page=portfolio", "Lewiston, ME"),
            ("LIC Manhattan View Hotel", "/?page=portfolio", "Long Island City, NY"),
        ),
    },
    {
        "name": "Real Estate",
        "venues": (
            ("The Watermark Hamptons", "http://www.thewatermarkhamptons.com", "Southampton, NY"),
            ("The Landmark Hamptons", "http://www.thelandmarkhamptons.com", "East Hampton, NY"),
            ("The Benchmark Hamptons", "http://www.thebenchmarkhamptons.com", "Bridgehampton, NY"),
        ),
    },
)

KS_REGIONS = (
    ("New York", "/?page=portfolio"),
    ("Hamptons", "/?page=portfolio"),
    ("Maine", "/?page=portfolio"),
    ("Park City", "/?page=portfolio"),
)

KS_SHARED_FEATURED_LOCATIONS = (
    {
        "name": "Elsie Rooftop",
        "location": "Midtown, NY",
        "href": "https://www.elsierooftop.com",
        "img": "/img/Rooftops/Elsie Rooftop/1.jpg",
    },
    {
        "name": "Rosehill Rooftop",
        "location": "Rose Hill, NY",
        "href": "http://www.rosehillrooftop.com",
        "img": "/img/Rooftops/Rosehill Rooftop/1.jpg",
    },
    {
        "name": "Stone & Soil",
        "location": "Rose Hill, NY",
        "href": "/?page=portfolio",
        "img": "/img/Lounges/Stone and Soil/1.jpg",
    },
    {
        "name": "Premiere Park City",
        "location": "Park City, UT",
        "href": "http://www.premiereparkcity.com",
        "img": "/img/Lounges/Premiere Park City/1.png",
    },
)

FISHBOWL_FEATURED_LOCATIONS = (
    {
        "name": "The Rickey",
        "location": "New York",
        "href": "/rickey/",
        "img": "/img/Lounges/Rickey/1.jpg",
        "fallback_img": "/fishbowl/wp-content/uploads/2019/09/NYC-TheRickey.jpg",
    },
    *KS_SHARED_FEATURED_LOCATIONS,
)

RICKEY_FEATURED_LOCATIONS = (
    {
        "name": "Fishbowl",
        "location": "New York",
        "href": "/fishbowl/",
        "img": "/img/Lounges/Fishbowl/1.jpg",
        "fallback_img": "/rickey/wp-content/uploads/2019/09/NYC-Fishbowl.jpg",
    },
    *KS_SHARED_FEATURED_LOCATIONS,
)

VENUE_FEATURED_SECTION_RE = re.compile(
    r'(<h2 class="h4 font-weight-light" data-splitting>)Featured (?:Branded Locations|Venues)(</h2>\s*'
    r'</div>\s*<div class="content-blocks__block">\s*'
    r'<div class="featured-slider-wrapper"[^>]*>\s*'
    r'<div class="featured-slider JS-event-section carousel"[^>]*>).*?(</div><!--End Featured Slider-->)',
    re.DOTALL | re.IGNORECASE,
)

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


def ks_nav_logo_html(home_href: str) -> str:
    return f"""<a class="navbar-brand d-flex align-items-center ks-microsite-nav-logo-wrap" href="{home_href}" rel="home" title="KS Hospitality Group">
  <span class="ks-microsite-nav-logo__mark" aria-hidden="true">KS</span>
  <span class="ks-microsite-nav-logo__text">
    <span class="ks-microsite-nav-logo__name">KS Hospitality Group</span>
    <span class="ks-microsite-nav-logo__sub">EST. 2024</span>
  </span>
</a>"""


def ks_mobile_nav_logo_html() -> str:
    return """<li class="d-block d-lg-none ms-3 pb-4 pl-3" role="presentation">
  <span class="ks-microsite-nav-logo-wrap ks-microsite-nav-logo-wrap--mobile">
    <span class="ks-microsite-nav-logo__mark" aria-hidden="true">KS</span>
    <span class="ks-microsite-nav-logo__name">KS Hospitality Group</span>
  </span>
</li>"""


def ks_corporate_contact_links_html() -> str:
    return f"""<div class="content-block__links">
            <a
        class="btn btn-link btn-link--underline my-2"
        href="mailto:{KS_EMAIL}"
        title="{KS_EMAIL}"
	      target=""
      >
                  {KS_EMAIL}
        <span></span>
      </a>
            <a
        class="btn btn-link btn-link--underline my-2"
        href="tel:{KS_PHONE_TEL}"
        title="{KS_PHONE}"
	      target=""
      >
                  {KS_PHONE}
        <span></span>
      </a>
          </div>"""


def _venue_link_attrs(url: str) -> tuple[str, str]:
    if url.startswith("http"):
        return url, ' target="_blank" rel="noopener noreferrer"'
    return url, ""


def _mega_menu_category_column(category: dict) -> str:
    items = []
    for name, url, loc in category["venues"]:
        href, attrs = _venue_link_attrs(url)
        items.append(
            f"""<li role="none" itemscope="itemscope" itemtype="https://www.schema.org/SiteNavigationElement">
              <a href="{href}"{attrs} class="dropdown-item-with-icon d-flex" role="menuitem">
                <div class="info d-flex align-items-center">
                  <div class="title d-flex align-items-center">{name}</div>
                  <div class="description">{loc}</div>
                </div>
              </a>
            </li>"""
        )
    return f"""<div class="col-md-3 mb-3">
              <h3 class="h6 mb-3">{category["name"]}</h3>
              <ul class="list-unstyled p-md-0 mb-2" role="menu">
                {"".join(items)}
              </ul>
            </div>"""


def ks_contact_navbar_html(prefix: str) -> str:
    venue_label, venue_href = VENUE_BY_PREFIX.get(prefix, ("", ""))
    category_cols = "".join(_mega_menu_category_column(cat) for cat in KS_VENUE_CATEGORIES)
    region_items = "".join(
        f"""<li role="none" itemscope="itemscope" itemtype="https://www.schema.org/SiteNavigationElement">
              <a href="{href}" class="dropdown-item d-flex" role="menuitem">
                <div class="info d-flex flex-column">
                  <div class="title">{label}</div>
                </div>
              </a>
            </li>"""
        for label, href in KS_REGIONS
    )
    venue_nav = ""
    if venue_label:
        venue_nav = f"""<li itemscope="itemscope" itemtype="https://www.schema.org/SiteNavigationElement" class="nav-item">
              <a class="nav-link" href="{venue_href}">{venue_label}</a>
            </li>"""

    return f"""<div class="headroom ks-contact-headroom">

  <nav class="navbar navbar-expand-lg ks-contact-nav" aria-label="Main navigation">
    <div class="container container--fluid ks-contact-nav__bar">

      <div class="ks-contact-nav__brand logo">
        {ks_nav_logo_html("/")}
      </div>

      <button id="nav-icon" class="navbar-toggler ks-contact-nav__toggle" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </button>

      <div class="collapse navbar-collapse ks-contact-nav__menu" id="navbarSupportedContent">
        <ul class="navbar-nav ks-contact-nav__links ms-lg-auto">
          {ks_mobile_nav_logo_html()}

          <li itemscope="itemscope" itemtype="https://www.schema.org/SiteNavigationElement" class="dropdown nav-item position-static ks-contact-nav__dropdown">
            <button type="button"
                    title="Portfolio"
                    data-toggle="dropdown"
                    aria-haspopup="menu"
                    aria-expanded="false"
                    class="dropdown-toggle nav-link ks-contact-nav__link"
                    id="menu-item-dropdown-portfolio">
              <span>Portfolio</span>
            </button>
            <div class="dropdown-menu mega-menu animate-menu slide-in-menu w-100 mt-0 ks-contact-mega-menu" aria-labelledby="menu-item-dropdown-portfolio">
              <div class="container--xl">
                <div class="row">
                  <div class="col-lg-9 p-0 py-md-2 mb-2">
                    <div class="row">
                      {category_cols}
                    </div>
                  </div>
                  <div class="col-lg-3 p-0 py-md-2">
                    <h3 class="h6 mb-3">Our Regions</h3>
                    <ul class="list-unstyled p-md-0 mb-4" role="menu">
                      {region_items}
                      <li role="none" itemscope="itemscope" itemtype="https://www.schema.org/SiteNavigationElement">
                        <a href="/?page=portfolio" class="dropdown-item d-flex" role="menuitem">
                          <div class="info d-flex flex-column">
                            <div class="title">View Full Portfolio</div>
                          </div>
                        </a>
                      </li>
                    </ul>
                    <a href="/?page=portfolio" class="btn ks-contact-mega-menu__cta">Explore Venues</a>
                  </div>
                </div>
              </div>
            </div>
          </li>

          <li itemscope="itemscope" itemtype="https://www.schema.org/SiteNavigationElement" class="nav-item">
            <a class="nav-link ks-contact-nav__link" href="/?page=about">The Group</a>
          </li>
          <li itemscope="itemscope" itemtype="https://www.schema.org/SiteNavigationElement" class="nav-item">
            <a class="nav-link ks-contact-nav__link" href="/?page=team">Team</a>
          </li>
          <li itemscope="itemscope" itemtype="https://www.schema.org/SiteNavigationElement" class="nav-item">
            <a class="nav-link ks-contact-nav__link active" href="/?page=contact" aria-current="page">Contact</a>
          </li>
          {venue_nav.replace('class="nav-link"', 'class="nav-link ks-contact-nav__link ks-contact-nav__venue"') if venue_nav else ""}

          <li class="ks-contact-nav__social nav-item d-flex align-items-center d-lg-none">
            <a href="https://www.instagram.com/kshospitalitygroup/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewbox="0 0 16 16"><title>Instagram</title><g fill="currentColor"><circle fill="currentColor" cx="12.145" cy="3.892" r="0.96"></circle> <path data-color="color-2" d="M8,12c-2.206,0-4-1.794-4-4s1.794-4,4-4s4,1.794,4,4S10.206,12,8,12z M8,6C6.897,6,6,6.897,6,8 s0.897,2,2,2s2-0.897,2-2S9.103,6,8,6z"></path> <path fill="currentColor" d="M12,16H4c-2.056,0-4-1.944-4-4V4c0-2.056,1.944-4,4-4h8c2.056,0,4,1.944,4,4v8C16,14.056,14.056,16,12,16z M4,2C3.065,2,2,3.065,2,4v8c0,0.953,1.047,2,2,2h8c0.935,0,2-1.065,2-2V4c0-0.935-1.065-2-2-2H4z"></path></g></svg>
            </a>
          </li>
        </ul>
        <a href="mailto:{KS_EMAIL}" class="ks-contact-nav__cta d-none d-lg-inline-flex">Get in touch <span aria-hidden="true">→</span></a>
        <a href="mailto:{KS_EMAIL}" class="ks-contact-nav__cta ks-contact-nav__cta--mobile d-lg-none">Get in touch <span aria-hidden="true">→</span></a>
      </div>

    </div>
  </nav>

</div><!--End Headroom-->"""


def patch_contact_form_locations(html: str) -> str:
    def region_sub(match: re.Match[str]) -> str:
        return f"{match.group(1)}{CONTACT_FORM_REGION_OPTIONS}{match.group(2)}"

    html = CONTACT_REGION_SELECT_RE.sub(region_sub, html)

    def ny_sub(match: re.Match[str]) -> str:
        return (
            "<p>New York Locations <span class=\"text-danger\">*</span>"
            f"{CONTACT_FORM_NY_LOCATIONS_SHORTCODE}\n\t\t\t\t\t</p>"
        )

    return NY_LOCATIONS_FIELD_RE.sub(ny_sub, html)


def detect_microsite_prefix(html: str) -> str:
    if '"/fishbowl/' in html or "'/fishbowl/" in html or 'href="/fishbowl"' in html:
        return "/fishbowl"
    if '"/rickey/' in html or "'/rickey/" in html or 'href="/rickey"' in html:
        return "/rickey"
    return ""


def is_corporate_contact_page(html: str) -> bool:
    return "wpcf7-f3133" in html or (
        CORPORATE_CONTACT_INTRO_RE.search(html) is not None
        and "content-block__links" in html
    )


def patch_corporate_contact_page(html: str) -> str:
    if not is_corporate_contact_page(html):
        return html

    prefix = detect_microsite_prefix(html)
    html = TAO_CONTACT_HEADROOM_RE.sub(ks_contact_navbar_html(prefix), html)
    html = CORPORATE_CONTACT_LINKS_RE.sub(ks_corporate_contact_links_html(), html)
    html = patch_contact_form_locations(html)

    return add_ks_corporate_contact_body_class(html)


def add_ks_corporate_contact_body_class(html: str) -> str:
    if "ks-corporate-contact" in html:
        return html
    return html.replace(
        '<body class="wp-singular',
        '<body class="ks-corporate-contact wp-singular',
        1,
    )


def apply_ks_corporate_contact_chrome(html: str, prefix: str) -> str:
    html = TAO_CONTACT_HEADROOM_RE.sub(ks_contact_navbar_html(prefix), html)
    return add_ks_corporate_contact_body_class(html)


def ks_corporate_contact_main_html(prefix: str) -> str:
    form_action = f"{prefix}/contact/#wpcf7-f3133-o1"
    ny_field = (
        "<p>New York Locations <span class=\"text-danger\">*</span>"
        f"{CONTACT_FORM_NY_LOCATIONS_SHORTCODE}\n\t\t\t\t\t</p>"
    )
    return f"""    <main class="site-content" id="content">


  <!-- Page Header -->
  <div class="page-header">
    

  <section class="page-section page-section--dark  page-section--padding--sm" data-section="dark" >
    
    
    <div class="container container--lg">
      
  <div>
    <h1 class="sr-only">Contact</h1>
  </div>



<div class="content-blocks text-left">
            <div class="content-blocks__block">
          <h2 class="h1 font-weight-light" data-splitting>Contact</h2>
      </div>
      </div>    </div>

    

  </section>
  </div>
  <!-- Page Builder -->
  <div id="page-body">
            

  <section class="page-section page-section--dark  page-section--padding--sm" data-section="dark" >
    
    
    <div class="container container--lg">
      <div class="row">
                        
      
      <div class="d-flex flex-column col-12 mb-4 col-lg-6 order-lg-0">
        

<div class="content-blocks text-left">
            <div class="content-blocks__block">
          <div class="content-block__text">
    <div class="moveUp in-view">
<p>Have general questions or comments for KS Hospitality Group?</p>
<p>Use the contact form to send us a message and we’ll promptly get back to you.</p>
<p>Please note: if this question is for a particular venue it is best to contact the venue direct on their website.</p>
</div>
  </div>
      </div>
      </div>      </div>
                      
      
      <div class="d-flex flex-column col-12 mb-4 col-lg-6 order-lg-0">
        

<div class="content-blocks text-lg-right">
            <div class="content-blocks__block">
          {ks_corporate_contact_links_html()}
      </div>
      </div>      </div>
      </div>
    </div>

    

  </section>
          

  <section class="page-section page-section--dark  page-section--padding--none" data-section="dark" >
    
    
    <div class="container container--lg">
      <div>
  

<div class="content-blocks text-left">
            <div class="content-blocks__block">
        
<div class="form-style--dark">
    
                
<div class="wpcf7 no-js" id="wpcf7-f3133-o1" lang="en-US" dir="ltr" data-wpcf7-id="3133">
<div class="screen-reader-response"><p role="status" aria-live="polite" aria-atomic="true"></p> <ul></ul></div>
<form action="{form_action}" method="post" class="wpcf7-form init" aria-label="Contact form" novalidate="novalidate" data-status="init">
{CONTACT_FORM_HIDDEN_FIELDSET}
<div class="custom-form">
	<div class="row">
		<div class="col-lg-6">
			<div class="form-group">
				<p><label>Your Name <span class="text-danger">*</span></label><span class="wpcf7-form-control-wrap" data-name="your-name"><input size="40" maxlength="400" class="wpcf7-form-control wpcf7-text wpcf7-validates-as-required form-control" aria-required="true" aria-invalid="false" value="" type="text" name="your-name" /></span>
				</p>
			</div>
		</div>
		<div class="col-lg-6">
			<div class="form-group">
				<p><label>Email <span class="text-danger">*</span></label><span class="wpcf7-form-control-wrap" data-name="your-email"><input size="40" maxlength="400" class="wpcf7-form-control wpcf7-email wpcf7-validates-as-required wpcf7-text wpcf7-validates-as-email form-control" aria-required="true" aria-invalid="false" value="" type="email" name="your-email" /></span>
				</p>
			</div>
		</div>
		<div class="col-lg-6">
			<div class="form-group">
				<p><label>Phone <span class="text-danger">*</span></label><span class="wpcf7-form-control-wrap" data-name="phone"><input size="40" maxlength="400" class="wpcf7-form-control wpcf7-tel wpcf7-validates-as-required wpcf7-text wpcf7-validates-as-tel form-control" aria-required="true" aria-invalid="false" value="" type="tel" name="phone" /></span>
				</p>
			</div>
		</div>
		<div class="col-lg-6">
			<div class="form-group">
				<p><label>Contact <span class="text-danger">*</span></label><span class="wpcf7-form-control-wrap" data-name="contact"><select class="wpcf7-form-control wpcf7-select wpcf7-validates-as-required form-control" aria-required="true" aria-invalid="false" name="contact">{CONTACT_FORM_REGION_OPTIONS}</select></span>
				</p>
			</div>
		</div>
		<div class="col-lg-12">
			<div class="form-group">
				<div data-id="newyork-locations" data-orig_data_id="newyork-locations"  class="" data-class="wpcf7cf_group">
					{ny_field}
				</div>
			</div>
		</div>
		<div class="col-lg-12">
			<div class="form-group">
				<p><label>Subject <span class="text-danger">*</span></label><span class="wpcf7-form-control-wrap" data-name="your-subject"><input size="40" maxlength="400" class="wpcf7-form-control wpcf7-text wpcf7-validates-as-required form-control" aria-required="true" aria-invalid="false" value="" type="text" name="your-subject" /></span>
				</p>
			</div>
		</div>
		<div class="col-lg-12">
			<div class="form-group">
				<p><label>Message <span class="text-danger">*</span></label><span class="wpcf7-form-control-wrap" data-name="your-message"><textarea cols="40" rows="10" maxlength="2000" class="wpcf7-form-control wpcf7-textarea wpcf7-validates-as-required form-control message" aria-required="true" aria-invalid="false" name="your-message"></textarea></span>
				</p>
			</div>
		</div>
	</div>
	<p><input class="wpcf7-form-control wpcf7-submit has-spinner btn" type="submit" value="Send" />
	</p>
	<p><small>This site is protected by reCAPTCHA.<br />
The Google <a style="opacity: 0.7;" href="https://policies.google.com/privacy" target="_blank">Privacy Policy</a> and <a style="opacity: 0.7;" href="https://policies.google.com/terms" target="_blank">Terms of Service</a> apply.<br />
</small>
	</p>
</div><div class="wpcf7-response-output" aria-hidden="true"></div>
</form>
</div>
        
    
  
  
</div>
      </div>
      </div></div>

    </div>

    

  </section>
        </div>



  </main>"""


def is_special_events_page(html: str) -> bool:
    return "page-id-20029" in html and "Select A City" in html


def patch_special_events_page(html: str) -> str:
    if not is_special_events_page(html):
        return html

    prefix = detect_microsite_prefix(html)
    html = apply_ks_corporate_contact_chrome(html, prefix)
    html = SITE_CONTENT_RE.sub(ks_corporate_contact_main_html(prefix), html, count=1)
    html = SPECIAL_EVENTS_PAGE_RE.sub(
        "<title>Contact | KS Hospitality Group</title>",
        html,
        count=1,
    )
    return html


def patch_book_special_event_links(html: str) -> str:
    prefix = detect_microsite_prefix(html)
    if prefix != "/fishbowl":
        return html
    return html.replace(
        'href="/fishbowl/special-events/index.html"',
        'href="/fishbowl/contact/index.html"',
    )


def replace_ks_favicon(html: str) -> str:
    if "ks-favicon.svg" in html:
        return html
    if "<!-- Fav and touch icons -->" not in html:
        return html
    return TAO_FAVICON_BLOCK_RE.sub(KS_FAVICON_HTML, html)


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


def strip_tao_references(text: str, prefix: str = "") -> str:
    """Replace Tao Group branding, domains, and contact info with KS Hospitality Group."""
    text = text.replace("tao-group-v2", KS_THEME_PATH_TOKEN)

    microsite_origin = f"{KS_SITE}{prefix}" if prefix else KS_SITE
    microsite_origin_slash = f"{microsite_origin.rstrip('/')}/"
    microsite_origin_json = microsite_origin_slash.replace("/", "\\/")
    microsite_origin_encoded = (
        microsite_origin_slash.replace("https://", "https%3A%2F%2F").replace("/", "%2F")
    )

    # Tao-owned subdomains and third-party integrations
    for old in (
        "tickets.taogroup.com",
        "taogroup.us12.list-manage.com",
        "taogroup.cashstar.com",
        "taogroup.myguestaccount.com",
        "taogroup.train.paytronix.com",
        "tao.tripleseat.com",
        "taodowntown.com",
        "taorestaurant.com",
        "www.taodowntown.com",
        "www.taorestaurant.com",
    ):
        text = text.replace(old, KS_HOST)

    text = text.replace(
        "linkedin.com/company/tao-group-hospitality",
        "instagram.com/kshospitalitygroup",
    )
    text = text.replace("com.taogroup", "com.kshospitalitygroup")
    text = re.sub(r"/taocares/", "/?page=about", text, flags=re.IGNORECASE)

    text = re.sub(r"@taogroup\.com", "@kshospitalitygroup.com", text, flags=re.IGNORECASE)

    company_replacements = (
        ("Tao Group Hospitality", "KS Hospitality Group"),
        ("TAO Group Hospitality", "KS Hospitality Group"),
        ("TaoGroup Hospitality", "KS Hospitality Group"),
        ("TaoGroup.com", "KS Hospitality Group"),
        ("TaoGroup", "KS Hospitality Group"),
        ("Tao Group", "KS Hospitality Group"),
        ("TAO GROUP", "KS HOSPITALITY GROUP"),
        ("taogrouphospitality", "kshospitalitygroup"),
        ("taogroup-com", "kshospitalitygroup-com"),
        ("taogroup-faq", "ks-faq"),
        ("#taogroup-faq", "#ks-faq"),
    )
    for old, new in company_replacements:
        text = text.replace(old, new)

    url_replacements = (
        ("https://www.taogroup.com/", microsite_origin_slash),
        ("http://www.taogroup.com/", microsite_origin_slash),
        ("https://taogroup.com/", microsite_origin_slash),
        ("http://taogroup.com/", microsite_origin_slash),
        ("https://www.taogroup.com", microsite_origin),
        ("http://www.taogroup.com", microsite_origin),
        ("https://taogroup.com", microsite_origin),
        ("http://taogroup.com", microsite_origin),
        ("https:\\/\\/www.taogroup.com\\/", microsite_origin_json),
        ("http:\\/\\/www.taogroup.com\\/", microsite_origin_json),
        ("https:\\/\\/taogroup.com\\/", microsite_origin_json),
        ("http:\\/\\/taogroup.com\\/", microsite_origin_json),
        ("https:\\/\\/www.taogroup.com", microsite_origin.replace("/", "\\/")),
        ("https:\\/\\/taogroup.com", microsite_origin.replace("/", "\\/")),
        ("https%3A%2F%2Fwww.taogroup.com%2F", microsite_origin_encoded),
        ("https%3A%2F%2Ftaogroup.com%2F", microsite_origin_encoded),
        ("https%3A%2F%2Fwww.taogroup.com", microsite_origin_encoded.rstrip("%2F")),
        ("https%3A%2F%2Ftaogroup.com", microsite_origin_encoded.rstrip("%2F")),
    )
    for old, new in url_replacements:
        text = text.replace(old, new)

    text = text.replace('"domains":["taogroup.com"]', f'"domains":["{KS_HOST}"]')
    microsite_origin_json_plain = microsite_origin.replace("/", "\\/")
    microsite_wp_json_root = microsite_origin_slash.replace("/", "\\/") + "wp-json\\/"
    text = re.sub(
        r'"site_url"\s*:\s*"https?:\\?/\\?/taogroup\.com"',
        f'"site_url":"{microsite_origin_json_plain}"',
        text,
        flags=re.IGNORECASE,
    )
    text = re.sub(
        r'"root"\s*:\s*"https?:\\?/\\?/taogroup\.com\\?/\\?/wp-json\\?/\\?/"',
        f'"root":"{microsite_wp_json_root}"',
        text,
        flags=re.IGNORECASE,
    )
    text = re.sub(r"(?<!-)taogroup\.com", KS_HOST, text, flags=re.IGNORECASE)

    text = WEGLOT_RE.sub("", text)
    text = text.replace(KS_THEME_PATH_TOKEN, "tao-group-v2")
    return text


def apply_ks_branding(html: str) -> str:
    return strip_tao_references(html, detect_microsite_prefix(html))


def _featured_carousel_cell(
    slide_num: int,
    total: int,
    name: str,
    location: str,
    href: str,
    img: str,
) -> str:
    link_attrs = ""
    if href.startswith("http"):
        link_attrs = ' target="_blank" rel="noopener noreferrer"'
    return f"""        <div
          class="carousel-cell"
          role="group"
          aria-roledescription="slide"
          aria-label="Slide {slide_num} of {total}"
        >
          <a href="{href}"{link_attrs} aria-label="{name}, {location}">
            <div class="carousel-media">
              <img src="{img}" class="object-fit" alt="{name}">
            </div>
            <div class="carousel-content pt-2 float-start">
              <h2 class="h5 mb-0 mt-3"><strong>{name}</strong></h2>
                              <div>
                  <h6 class="text-muted">{location}</h6>
                </div>
                          </div>
          </a>
        </div>"""


def _featured_slider_html(prefix: str, locations: tuple[dict, ...]) -> str:
    total = len(locations)
    cells = []
    for index, venue in enumerate(locations, start=1):
        img = venue["img"]
        if prefix and venue.get("fallback_img"):
            img = venue["fallback_img"]
        cells.append(
            _featured_carousel_cell(
                index,
                total,
                venue["name"],
                venue["location"],
                venue["href"],
                img,
            )
        )
    return "\n\n      \n".join(cells)


def patch_venue_featured_locations(html: str) -> str:
    if "featured-slider JS-event-section carousel" not in html:
        return html

    prefix = detect_microsite_prefix(html)
    if "postid-2928" in html:
        locations = FISHBOWL_FEATURED_LOCATIONS
        prefix = prefix or "/fishbowl"
    elif "postid-2988" in html:
        locations = RICKEY_FEATURED_LOCATIONS
        prefix = prefix or "/rickey"
    else:
        return html

    slider_html = _featured_slider_html(prefix, locations)

    def section_sub(match: re.Match[str]) -> str:
        return (
            f'{match.group(1)}Featured Venues{match.group(2)}\n\n      \n{slider_html}\n\n          '
            f"{match.group(3)}"
        )

    return VENUE_FEATURED_SECTION_RE.sub(section_sub, html, count=1)


def replace_tao_footer(html: str) -> str:
    if 'id="tao-main-footer"' not in html and 'id="ks-hospitality-footer"' not in html:
        return html
    html = TAO_FOOTER_RE.sub(KS_FOOTER_HTML, html)
    return inject_footer_css(html)


def patch_microsite_html(html: str) -> str:
    html = remove_rewards_content(html)
    html = apply_ks_branding(html)
    html = replace_ks_favicon(html)
    html = patch_corporate_contact_page(html)
    html = patch_special_events_page(html)
    html = patch_book_special_event_links(html)
    html = patch_venue_featured_locations(html)
    return replace_tao_footer(html)
