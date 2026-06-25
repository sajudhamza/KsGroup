// iOS and Android Smart Banner
// ─── 1) Configuration ───────────────────────────────────────────────────────
const HIDE_DURATION = 24 * 60 * 60 * 1000; // 24h

const PLATFORM = {
    IOS: {
        key:      'sb_ios_closed_at',
        icon:     'https://taogroup.com/wp-content/themes/tao-group-v2/images/app-banner-icon.jpg',
        title:    'Tao Group Hospitality Rewards',
        subtitle:  'Eat. Drink. Earn. Repeat.',
        universalLink: 'https://taogroup.com/rewards',
        appStoreUrl:   'https://apps.apple.com/us/app/tao-group-hospitality-rewards/id1537602625'
    },
    ANDROID: {
        key:     'sb_android_closed_at',
        icon:    'https://taogroup.com/wp-content/themes/tao-group-v2/images/app-banner-icon.jpg',
        title:   'Tao Group Hospitality Rewards',
        subtitle:'Eat. Drink. Earn. Repeat.',
        package: 'com.taogroup'
    }
};


// ─── HELPERS ────────────────────────────────────────────────────────────
function isIOS() {
    return /iP(hone|od|ad)/.test(navigator.userAgent);
}
function isAndroid() {
    return /Android/.test(navigator.userAgent);
}

function wasClosed(storageKey) {
    try {
        const ts = parseInt(localStorage.getItem(storageKey), 10);
        return ts && (Date.now() - ts) < HIDE_DURATION;
    } catch {
        return false;
    }
}
function setClosed(storageKey) {
    try {
        localStorage.setItem(storageKey, Date.now().toString());
    } catch {
        // ignore
    }
}

// ─── BANNER RENDERER ──────────────────────────────────────────────────────
function showBanner(cfg, isIos) {
    // 1) Create wrapper
    const banner = document.createElement('div');
    banner.className = 'sb-banner';

    // 2) Icon
    const img = document.createElement('img');
    img.className = 'sb-icon';
    img.src = cfg.icon;
    img.alt = 'App Icon';

    // 3) Text
    const content = document.createElement('div');
    content.className = 'sb-content';
    const h1 = document.createElement('p');
    h1.className = 'sb-title';
    h1.textContent = cfg.title;
    const p = document.createElement('p');
    p.className = 'sb-subtitle';
    p.textContent = cfg.subtitle;
    content.append(h1, p);

    // 4) CTA button
    const btn = document.createElement('a');
    btn.className = 'sb-button ' + (isIos ? 'ios' : 'android');
    btn.textContent = 'Open';
    btn.setAttribute('aria-label', 'Open App');

    if (isIos) {
        btn.href = cfg.universalLink;
        btn.addEventListener('click', () => {
            setTimeout(() => {
                if (document.visibilityState === 'visible') {
                    window.location.href = cfg.appStoreUrl;
                }
            }, 1500);
        });
    } else {
        btn.href = `intent://details?id=${cfg.package}` +
            `#Intent;scheme=market;package=com.android.vending;end`;
    }

    // 5) Close button
    const closeBtn = document.createElement('span');
    closeBtn.className = 'sb-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'Close banner');
    closeBtn.addEventListener('click', () => {
        banner.remove();
        document.body.classList.remove('sb-has-banner');
        if (isIos) {
            const nav = document.querySelector('nav');
            if (nav) nav.classList.remove('ios-banner-active');
        }
        setClosed(cfg.key);
    });

    // 6) Assemble & insert
    banner.append(img, content, btn, closeBtn);
    document.body.prepend(banner);
    document.body.classList.add('sb-has-banner');
    if (isIos) {
        const nav = document.querySelector('nav');
        if (nav) nav.classList.add('ios-banner-active');
    }
}

// App banner INIT ------------------------//
document.addEventListener('DOMContentLoaded', () => {
    if (isIOS() && !wasClosed(PLATFORM.IOS.key)) {
        showBanner(PLATFORM.IOS, true);
    } else if (isAndroid() && !wasClosed(PLATFORM.ANDROID.key)) {
        showBanner(PLATFORM.ANDROID, false);
    }
});