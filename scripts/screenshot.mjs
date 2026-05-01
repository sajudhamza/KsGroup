// Saves a top-of-page screenshot at every width so we can visually verify
// nothing escapes the viewport, plus a "full page" screenshot at one width.
import puppeteer from 'puppeteer';
import fs from 'fs';

const URL = 'http://localhost:5174/';
const OUT = 'scripts/shots';
fs.mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
  { name: '1920', width: 1920, height: 1080 },
  { name: '1440', width: 1440, height: 900  },
  { name: '1280', width: 1280, height: 800  },
  { name: '1100', width: 1100, height: 800  },
  { name: '1024', width: 1024, height: 800  },
  { name: '900',  width: 900,  height: 800  },
  { name: '820',  width: 820,  height: 1180 },
  { name: '768',  width: 768,  height: 1024 },
  { name: '600',  width: 600,  height: 800  },
  { name: '414',  width: 414,  height: 896  },
  { name: '390',  width: 390,  height: 844  },
  { name: '360',  width: 360,  height: 640  },
  { name: '320',  width: 320,  height: 568  },
];

const browser = await puppeteer.launch({ headless: 'new' });

for (const vp of VIEWPORTS) {
  const page = await browser.newPage();
  await page.setViewport(vp);
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 20000 });
  await new Promise(r => setTimeout(r, 600));
  const path = `${OUT}/home-${vp.name}.png`;
  await page.screenshot({ path });
  // Measure once more
  const m = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    bodyW: document.body.scrollWidth,
  }));
  console.log(`${vp.name}: docSW=${m.scrollWidth} CW=${m.clientWidth} bodySW=${m.bodyW}  →  ${path}`);
  await page.close();
}

await browser.close();
