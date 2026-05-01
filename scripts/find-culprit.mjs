import puppeteer from 'puppeteer';

const URL = process.env.URL || 'http://localhost:5174/';
const widths = [1440, 1280, 1100, 1024, 980, 900, 880, 820, 768, 600, 414, 390, 360];

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--force-device-scale-factor=1', '--hide-scrollbars=false'],
});

const page = await browser.newPage();

for (const w of widths) {
  await page.setViewport({ width: w, height: 800, deviceScaleFactor: 1 });
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 250));

  const data = await page.evaluate(() => {
    const docW = document.documentElement.clientWidth;
    const offenders = [];
    const all = document.querySelectorAll('body *');
    for (const el of all) {
      const r = el.getBoundingClientRect();
      // element extends past the right edge of the viewport
      if (r.right > docW + 0.5) {
        // Skip if it's clipped by an overflow:hidden ancestor (visually it's not really overflowing)
        let p = el.parentElement;
        let clipped = false;
        while (p) {
          const cs = getComputedStyle(p);
          if (cs.overflowX === 'hidden' || cs.overflowX === 'clip' ||
              cs.overflow === 'hidden' || cs.overflow === 'clip' ||
              cs.overflow === 'auto' || cs.overflowX === 'auto') {
            clipped = true;
            break;
          }
          p = p.parentElement;
        }
        if (clipped) continue;
        const id = el.id ? `#${el.id}` : '';
        const cls = el.className && typeof el.className === 'string'
          ? '.' + el.className.split(' ').filter(Boolean).slice(0, 3).join('.')
          : '';
        offenders.push({
          tag: el.tagName.toLowerCase() + id + cls,
          right: Math.round(r.right),
          width: Math.round(r.width),
          left: Math.round(r.left),
          docW,
        });
      }
    }
    return { docW, scrollW: document.documentElement.scrollWidth, offenders };
  });

  const overflow = data.scrollW - data.docW;
  console.log(`\n[${w}px] doc=${data.docW} scrollW=${data.scrollW} overflow=${overflow}px`);
  if (data.offenders.length) {
    console.log(`  ${data.offenders.length} elements past right edge (showing first 8 NOT inside an overflow:hidden parent):`);
    for (const o of data.offenders.slice(0, 8)) {
      console.log(`    ${o.tag}  right=${o.right}  w=${o.width}  left=${o.left}`);
    }
  } else if (overflow > 0) {
    console.log('  (overflow detected but no offenders — likely a sub-pixel rounding issue)');
  }
}

await browser.close();
