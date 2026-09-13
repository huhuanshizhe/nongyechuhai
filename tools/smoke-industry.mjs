import assert from 'node:assert/strict';
const base = process.argv[2];
if (!base) throw new Error('Supply the site URL.');
const paths = [
  '/',
  '/about',
  '/services',
  '/resources',
  '/cooperation',
  '/join',
  '/contact',
  '/privacy',
];
const assets = new Set();
for (const path of paths) {
  const response = await fetch(new URL(path, base), {
    signal: AbortSignal.timeout(40000),
  });
  assert.equal(response.status, 200, path);
  const html = await response.text();
  assert.ok(html.includes('<h1>'), `Heading: ${path}`);
  assert.ok(html.includes('lang="zh-CN"'), `Language: ${path}`);
  assert.ok(
    html.includes('https://www.farmetra.com/en'),
    `Overseas link: ${path}`,
  );
  for (const match of html.matchAll(/(?:src|href)="(\/[^"]*)"/g)) {
    const url = new URL(match[1], base);
    if (/\.[a-z]+$/.test(url.pathname)) assets.add(url.pathname);
    else
      assert.ok(
        paths.includes(url.pathname),
        `Unknown local route: ${url.pathname}`,
      );
  }
  console.log('PASS', path);
}
for (const asset of assets) {
  const r = await fetch(new URL(asset, base), {
    signal: AbortSignal.timeout(40000),
  });
  assert.equal(r.status, 200, asset);
}
const missing = await fetch(new URL('/missing-page-check', base));
assert.equal(missing.status, 404);
console.log(
  `PASS ${paths.length} pages, ${assets.size} assets, missing-page 404. No enquiry sent.`,
);
