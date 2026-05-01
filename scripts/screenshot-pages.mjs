// Screenshots every page (incl. property detail) at problem widths.
import puppeteer from 'puppeteer';
import fs from 'fs';

const URL = 'http://localhost:5174/';
const OUT = 'scripts/shots';
fs.mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
  { name: '1440', width: 1440, height: 900 },
  { name: '1024', width: 1024, height: 800 },
  { name: '768',  width: 768,  height: 1024 },
  { name: '414',  width: 414,  height: 896 },
  { name: '320',  width: 320,  height: 568 },
];

const browser = await puppeteer.launch({ headless: 'new' });

for (const vp of VIEWPORTS) {
  const page = await browser.newPage();
  await page.setViewport(vp);
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 20000 });

  const navTo = async (label) => {
    const desktopVisible = await page.evaluate(() => {
      const el = document.querySelector('.ks-nav-links');
      return el && getComputedStyle(el).display !== 'none';
    });
    if (!desktopVisible) {
      await page.evaluate(() => document.querySelector('.ks-nav-toggle')?.click());
      await new Promise(r => setTimeout(r, 250));
    }
    await page.evaluate((label) => {
      const link = Array.from(document.querySelectorAll('a')).find(a => a.textContent.trim().toUpperCase() === label);
      link?.click();
    }, label);
    await new Promise(r => setTimeout(r, 400));
  };

  // Portfolio page
  await navTo('PORTFOLIO');
  await page.screenshot({ path: `${OUT}/portfolio-${vp.name}.png` });

  // Click first property card → detail
  await page.evaluate(() => {
    const link = document.querySelector('.ks main a[href="#"]') || document.querySelector('section[style*="120px"] a[href="#"]');
    link?.click();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: `${OUT}/property-${vp.name}.png` });

  // Measure final width
  const m = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  console.log(`${vp.name}: docSW=${m.sw} CW=${m.cw} delta=${m.sw - m.cw}`);

  await page.close();
}

await browser.close();
