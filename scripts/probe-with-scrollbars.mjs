import puppeteer from 'puppeteer';

const URL = process.env.URL || 'http://localhost:5174/';
const widths = [1440, 1280, 1024, 820, 768, 414, 390, 375, 360, 320];

const browser = await puppeteer.launch({
  headless: 'new',
  args: [
    '--force-device-scale-factor=1',
    '--disable-features=OverlayScrollbar',
    '--enable-features=OverlayScrollbarFlashAfterAnyScrollUpdate',
    '--hide-scrollbars=false',
  ],
});

const page = await browser.newPage();
let bad = 0;
for (const w of widths) {
  await page.setViewport({ width: w, height: 800, deviceScaleFactor: 1 });
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 300));

  const data = await page.evaluate(() => {
    const html = document.documentElement;
    const body = document.body;
    return {
      htmlScroll: html.scrollWidth,
      htmlClient: html.clientWidth,
      bodyScroll: body.scrollWidth,
      bodyClient: body.clientWidth,
      innerW: window.innerWidth,
      hasHScroll: html.scrollWidth > html.clientWidth || body.scrollWidth > body.clientWidth,
    };
  });

  const tag = data.hasHScroll ? '✗ OVERFLOW' : '✓';
  if (data.hasHScroll) bad++;
  console.log(`${tag} ${w}px  html ${data.htmlClient}/${data.htmlScroll}  body ${data.bodyClient}/${data.bodyScroll}  inner ${data.innerW}`);
}
await browser.close();
if (bad) {
  console.log(`\n✗ ${bad} viewport(s) with horizontal overflow`);
  process.exit(1);
}
console.log('\n✓ NO horizontal overflow with scrollbars enabled');
