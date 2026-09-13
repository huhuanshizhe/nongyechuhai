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
const assets = new Set(['/origin.css']);
for (const path of paths) {
  const response = await fetch(new URL(path, base), {
    signal: AbortSignal.timeout(40000),
  });
  assert.equal(response.status, 200, path);
  const html = await response.text();
  assert.ok(html.includes('<h1>'), `Heading: ${path}`);
  assert.ok(html.includes('lang="zh-CN"'), `Language: ${path}`);
  if (path === '/') {
    assert.ok(
      html.includes(
        '把企业零散的产品能力，组织成海外买家能够理解、比较、询价和持续合作的供应方案',
      ),
      'Core platform slogan',
    );
    for (const phrase of ['看得懂', '比得清', '能询价', '持续合作', '具体交付'])
      assert.ok(html.includes(phrase), phrase);
  }
  if (path === '/' || path === '/resources') {
    for (const phrase of [
      '45.23',
      '20',
      '绿色有机认证面积',
      '3.8',
      '2025',
      '区域数据',
      '不等同于全部取得有机认证',
      'rainbow-trout-editorial.webp',
      'www.qinghai.gov.cn',
      'www.qhio.gov.cn',
    ])
      assert.ok(html.includes(phrase), `Origin evidence ${path}: ${phrase}`);
  }
  if (path === '/resources')
    assert.equal((html.match(/class="product-card"/g) || []).length, 7);
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
