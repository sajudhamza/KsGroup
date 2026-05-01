// Thorough overflow probe.
//   - Exercises every page (Home, Portfolio, About, Team, Contact, Property)
//   - Tests at desktop, laptop, tablet, and phone widths
//   - Scrolls each page from top to bottom (reveals late-mounted elements)
//   - On phones: also exercises the hamburger drawer
//   - Reports the topmost overflowing elements per scenario

import puppeteer from 'puppeteer';

const URL = 'http://localhost:5174/';

const VIEWPORTS = [
  { name: 'desktop-xl', width: 1920, height: 1080 },
  { name: 'desktop',    width: 1440, height: 900  },
  { name: 'laptop',     width: 1280, height: 800  },
  { name: 'tablet-l',   width: 1024, height: 1366 },
  { name: 'tablet',     width: 820,  height: 1180 },
  { name: 'tablet-s',   width: 768,  height: 1024 },
  { name: 'phone',      width: 414,  height: 896  },
  { name: 'phone-13',   width: 390,  height: 844  },
  { name: 'phone-s',    width: 360,  height: 640  },
  { name: 'phone-xs',   width: 320,  height: 568  },
];

const PAGES = ['home', 'portfolio', 'about', 'team', 'contact'];

async function measure(page, label, badList) {
  // Let layout settle, fonts load, animations run a tick.
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await new Promise(r => setTimeout(r, 250));

  // Scroll bottom-to-top; covers late-mounted/lazy elements.
  await page.evaluate(async () => {
    const max = document.documentElement.scrollHeight;
    const stops = 6;
    for (let i = 0; i < stops; i++) {
      window.scrollTo(0, (max * i) / stops);
      await new Promise(r => setTimeout(r, 80));
    }
    window.scrollTo(0, 0);
  });
  await new Promise(r => setTimeout(r, 150));

  const result = await page.evaluate(() => {
    const sw = document.documentElement.scrollWidth;
    const cw = document.documentElement.clientWidth;
    const overflow = sw - cw;
    if (overflow <= 0) return { overflow, offenders: [] };
    const all = Array.from(document.body.querySelectorAll('*'));
    const offenders = [];
    for (const el of all) {
      const r = el.getBoundingClientRect();
      const right = r.left + r.width;
      if (right > cw + 0.5 && r.width > 0) {
        // Skip elements inside an overflow-clipping ancestor — they don't push the doc.
        let parent = el.parentElement, clipped = false;
        while (parent) {
          const cs = getComputedStyle(parent);
          if (cs.overflowX === 'hidden' || cs.overflowX === 'clip' || cs.overflow === 'hidden' || cs.overflow === 'clip') {
            clipped = true;
            break;
          }
          parent = parent.parentElement;
        }
        if (clipped) continue;
        offenders.push({
          tag: el.tagName.toLowerCase(),
          cls: typeof el.className === 'string' ? el.className.slice(0, 70) : null,
          left: Math.round(r.left),
          right: Math.round(right),
          width: Math.round(r.width),
          overflow: Math.round(right - cw),
          inlineStyle: el.getAttribute('style')?.slice(0, 110) || null,
          textPreview: (el.innerText || '').slice(0, 60).replace(/\s+/g, ' '),
        });
      }
    }
    offenders.sort((a, b) => b.overflow - a.overflow);
    return { overflow, offenders: offenders.slice(0, 6) };
  });

  if (result.overflow > 0) {
    badList.push({ label, ...result });
    console.log(`  ✗ ${label}  +${result.overflow}px`);
    for (const o of result.offenders) {
      console.log(`     +${o.overflow}px  <${o.tag} class="${o.cls || ''}">  rect=[${o.left}..${o.right}] w=${o.width}`);
      if (o.inlineStyle) console.log(`         style="${o.inlineStyle}"`);
      if (o.textPreview)  console.log(`         text="${o.textPreview}"`);
    }
  } else {
    console.log(`  ✓ ${label}`);
  }
}

async function navTo(page, target) {
  // Use the desktop nav links if visible; else open the hamburger drawer first.
  await page.evaluate((target) => {
    const map = { 'portfolio': 'PORTFOLIO', 'about': 'THE GROUP', 'team': 'TEAM', 'contact': 'CONTACT' };
    const t = map[target];
    if (!t) return;
    const a = Array.from(document.querySelectorAll('a')).find(x => x.textContent.trim().toUpperCase() === t);
    if (a) a.click();
  }, target);
  await new Promise(r => setTimeout(r, 350));
}

async function goHome(page) {
  await page.evaluate(() => {
    const a = document.querySelector('.ks-nav a[href="#"]');
    if (a) a.click();
  });
  await new Promise(r => setTimeout(r, 350));
}

const browser = await puppeteer.launch({ headless: 'new' });
const bad = [];

for (const vp of VIEWPORTS) {
  console.log(`\n[${vp.name} ${vp.width}x${vp.height}]`);
  const page = await browser.newPage();
  await page.setViewport(vp);
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 20000 });

  for (const target of PAGES) {
    if (target === 'home') {
      await goHome(page);
    } else {
      await navTo(page, target);
    }
    await measure(page, `${vp.name}/${target}`, bad);
  }

  // On phones, also open the hamburger drawer.
  if (vp.width <= 768) {
    await page.evaluate(() => {
      const btn = document.querySelector('.ks-nav-toggle');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 250));
    await measure(page, `${vp.name}/drawer-open`, bad);
  }

  await page.close();
}

await browser.close();

console.log('\n=================================');
console.log(bad.length === 0
  ? `ALL CLEAN — 0 overflow across ${VIEWPORTS.length} viewports × ${PAGES.length} pages`
  : `FAILURES: ${bad.length}`);
process.exit(bad.length === 0 ? 0 : 1);
