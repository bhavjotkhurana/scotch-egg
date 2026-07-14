#!/usr/bin/env node
// Runs after `vite build`. Serves the built dist/ locally, visits every real
// route in a headless browser, waits for React to finish rendering (data
// fetch, KaTeX, charts), and writes the fully-rendered HTML back into dist/
// as <route>/index.html. Static hosts (Cloudflare Pages included) serve a
// folder's index.html for an exact path match before falling back to the
// SPA shell, so crawlers and on-demand agent fetches get real content
// without executing JS.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { preview } from 'vite';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');

function getRoutes() {
  const indexPath = path.join(root, 'src', 'data', 'questions', 'index.json');
  const units = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
  const routes = ['/', '/about', '/book'];
  for (const unit of units) {
    routes.push(`/practice/${unit.unitSlug}`);
    for (const topic of unit.topics) {
      routes.push(`/practice/${unit.unitSlug}/${topic.topicSlug}`);
    }
  }
  return routes;
}

function outputPathFor(route) {
  if (route === '/') return path.join(distDir, 'index.html');
  return path.join(distDir, route.slice(1), 'index.html');
}

async function main() {
  const routes = getRoutes();
  console.log(`Prerendering ${routes.length} routes...`);

  const server = await preview({ root, preview: { port: 4173, strictPort: false } });
  const base = server.resolvedUrls.local[0];

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  const failures = [];

  for (const route of routes) {
    const url = new URL(route, base).toString();
    try {
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
      await page.waitForFunction(() => !document.body.innerText.includes('Loading'), {
        timeout: 10000,
      });
      // Settle time for chart mount animations (Recharts) after content appears.
      await new Promise((resolve) => setTimeout(resolve, 250));

      const html = await page.evaluate(() => '<!doctype html>\n' + document.documentElement.outerHTML);
      const outPath = outputPathFor(route);
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, html);
      console.log(`  ✓ ${route}`);
    } catch (err) {
      failures.push({ route, message: err.message });
      console.error(`  ✗ ${route}: ${err.message}`);
    }
  }

  await browser.close();
  await new Promise((resolve, reject) => {
    server.httpServer.close((err) => (err ? reject(err) : resolve()));
  });

  if (failures.length > 0) {
    console.error(`\nPrerender failed for ${failures.length} of ${routes.length} routes.`);
    process.exit(1);
  }

  console.log(`\nPrerendered all ${routes.length} routes.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
