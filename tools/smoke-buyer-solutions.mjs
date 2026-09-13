import assert from 'node:assert/strict';
const base = process.argv[2];
if (!base) throw new Error('Supply the overseas site URL.');
async function page(path) {
  const response = await fetch(new URL(path, base), {
    signal: AbortSignal.timeout(40000),
  });
  assert.equal(response.status, 200, path);
  return response.text();
}
for (const locale of ['en', 'zh']) {
  const html = await page(`/${locale}/collections`);
  assert.equal(
    (html.match(/class="ft-offering-card"/g) || []).length,
    15,
    'Product and development formats',
  );
  const selected = await page(
    `/${locale}/collections?buyer=manufacturers&stage=ingredient&focus=vitamin-c`,
  );
  assert.equal(
    (selected.match(/class="ft-offering-card"/g) || []).length,
    2,
    'Combined buyer, stage and composition filters',
  );
  assert.ok(selected.includes('sea-buckthorn') || selected.includes('沙棘'));
  assert.ok(selected.includes('Rosa roxburghii') || selected.includes('刺梨'));
  const solutions = await page(`/${locale}/solutions`);
  assert.equal(
    (solutions.match(/class="ft-buyer-segment-body"/g) || []).length,
    6,
    'Buyer segments',
  );
  for (const source of [
    'pubmed.ncbi.nlm.nih.gov/18486400',
    'pubs.rsc.org',
    'pubmed.ncbi.nlm.nih.gov/10552673',
    'pubmed.ncbi.nlm.nih.gov/36939010',
  ])
    assert.ok(solutions.includes(source), source);
  const brief =
    locale === 'zh'
      ? 'NFC 红枸杞果汁\n枸杞原浆\n请提供样品与包装选项。'
      : 'NFC red goji juice\nGoji purée\nPlease share samples and packs.';
  const enquiry = await page(
    `/${locale}/sourcing?${new URLSearchParams({ brief, buyer: 'brands', topic: 'product-development' })}`,
  );
  assert.ok(
    /<option[^>]*value="brands"[^>]*selected/.test(enquiry),
    'Buyer prefill',
  );
  assert.ok(
    /<option[^>]*value="product-development"[^>]*selected/.test(enquiry),
    'Development topic',
  );
  assert.ok(enquiry.includes(brief), 'Shortlist brief prefill');
  console.log(
    'PASS buyer formats, combined filters, segments, sources and enquiry prefill',
    locale,
  );
}
const sitemap = await page('/sitemap.xml');
assert.ok(
  sitemap.includes('/en/solutions') && sitemap.includes('/zh/solutions'),
);
const image = await fetch(
  new URL('/images/brand-v2/juice-range-editorial.png', base),
);
assert.equal(image.status, 200);
assert.ok(image.headers.get('content-type').startsWith('image/'));
console.log('PASS sitemap and juice-range image. No enquiry sent.');
