import assert from 'node:assert/strict';
const base = process.argv[2];
if (!base) throw new Error('Pass the running local preview URL.');
const products = [
  'goji',
  'sea-buckthorn',
  'highland-barley',
  'quinoa',
  'black-goji',
  'honey',
];
const paths = [
  '',
  '/services',
  '/about',
  '/partners',
  '/traceability',
  '/collections',
  '/sourcing',
  '/privacy',
  '/buying-guide',
  ...products.map((slug) => '/collections/' + slug),
];
const forbidden = [
  '平台筹建',
  '拟由新设',
  '拟议组织架构',
  '当前版本只',
  '首期选品方向',
  '供应待核验',
  'AI 品牌场景',
  '不参与投资',
  'PLATFORM IN DEVELOPMENT',
  'not a verified farm photograph',
  'Planned outputs',
  'legacy supply catalogue',
];
let passed = 0;
let failed = 0;
for (const locale of ['zh', 'en']) {
  for (let i = 0; i < paths.length; i += 3) {
    await Promise.all(
      paths.slice(i, i + 3).map(async (path) => {
        try {
          const r = await fetch(new URL('/' + locale + path, base), {
            signal: AbortSignal.timeout(40000),
          });
          const html = await r.text();
          assert.equal(r.status, 200);
          assert.ok(html.includes('<h1'), 'Main heading');
          assert.ok(html.includes('rel="canonical"'), 'Canonical');
          for (const phrase of forbidden)
            assert.ok(
              !html.toLowerCase().includes(phrase.toLowerCase()),
              'Internal copy leaked: ' + phrase,
            );
          if (path !== '/privacy')
            assert.ok(
              (html.match(/<img\s/g) || []).length >= 1,
              'In-page photograph',
            );
          if (path === '')
            assert.ok(
              (html.match(/<img\s/g) || []).length >= 10,
              'Image-rich homepage',
            );
          if (path === '/partners')
            assert.ok(
              html.includes('https://www.hengyuancui.com/'),
              'Partner source link',
            );
          if (path.startsWith('/collections/')) {
            const match = html.match(/property="og:image" content="([^"]+)"/);
            assert.ok(
              match && match[1].includes('/images/brand-v2/'),
              'Product-specific social image',
            );
          }
          passed++;
          console.log('PASS /' + locale + path);
        } catch (e) {
          failed++;
          console.log('FAIL /' + locale + path, e.message);
        }
      }),
    );
  }
}
for (const path of [
  '/zh/sourcing?direction=black-goji',
  '/en/sourcing?direction=goji',
  '/zh/sourcing?topic=partnership',
]) {
  try {
    const r = await fetch(new URL(path, base));
    const html = await r.text();
    const selected = path.includes('black-goji')
      ? 'black-goji'
      : path.includes('partnership')
        ? 'partnership'
        : 'goji';
    assert.ok(
      new RegExp('<option[^>]*value="' + selected + '"[^>]*selected').test(
        html,
      ),
      'Selected topic',
    );
    passed++;
    console.log('PASS prefill', path);
  } catch (e) {
    failed++;
    console.log('FAIL prefill', path, e.message);
  }
}
for (const path of ['/zh/collections/missing', '/en/collections/missing']) {
  try {
    const r = await fetch(new URL(path, base));
    assert.equal(r.status, 404);
    passed++;
    console.log('PASS 404', path);
  } catch (e) {
    failed++;
    console.log('FAIL 404', path, e.message);
  }
}
console.log(
  passed +
    ' passed; ' +
    failed +
    ' failed. Read-only HTTP checks; no browser interaction or enquiry submission.',
);
if (failed) process.exitCode = 1;
