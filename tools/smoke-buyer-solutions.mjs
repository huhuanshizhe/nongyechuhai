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
    16,
    'Product and development formats',
  );
  const juiceImages = [
    'goji-puree',
    'red-goji-nfc',
    'black-goji-nfc',
    'sea-buckthorn-juice',
    'chestnut-rose-juice',
    'juice-sachets',
  ].map((id) => `${id}-editorial-v2.jpg`);
  for (const image of juiceImages)
    assert.ok(html.includes(image), `Distinct juice illustration: ${image}`);
  assert.ok(
    html.includes('rainbow-trout-editorial.png'),
    'Trout catalogue image',
  );
  assert.ok(html.includes('topic=rainbow-trout'), 'Dedicated trout enquiry');
  for (const asset of [
    'supplier-red-goji-berries.jpg',
    'supplier-black-goji-jar.jpg',
    'supplier-fresh-locked-goji-jar.jpg',
    'supplier-goji-blossom-honey.jpg',
    'supplier-red-goji-box.jpg',
    'supplier-goji-sprout-tea-jar.jpg',
    'supplier-goji-leaf-tea-box.jpg',
  ]) {
    assert.ok(html.includes(asset), `Supplier product image: ${asset}`);
  }
  assert.ok(html.includes('id="supplier-range"'), 'Supplier product gallery');
  assert.ok(
    html.includes('Dried, fresh-locked berries') ||
      html.includes('锁鲜干燥果实'),
    'Preservation wording matches dried product',
  );
  assert.ok(
    html.includes(
      locale === 'zh' ? '高原冷水虹鳟' : 'Highland cold-water rainbow trout',
    ),
    'Trout catalogue entry',
  );
  const fish = await page(
    `/${locale}/collections?stage=primary&buyer=foodservice`,
  );
  assert.ok(
    fish.includes(
      locale === 'zh' ? '高原冷水虹鳟' : 'Highland cold-water rainbow trout',
    ),
    'Trout buyer and format filters',
  );
  const fishEnquiry = await page(`/${locale}/sourcing?topic=rainbow-trout`);
  assert.ok(
    /<option[^>]*value="rainbow-trout"[^>]*selected/.test(fishEnquiry),
    'Trout enquiry topic prefill',
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
const distinctJuiceBodies = new Set();
for (const id of [
  'goji-puree',
  'red-goji-nfc',
  'black-goji-nfc',
  'sea-buckthorn-juice',
  'chestnut-rose-juice',
  'juice-sachets',
]) {
  const response = await fetch(
    new URL(`/images/brand-v2/${id}-editorial-v2.jpg`, base),
    { signal: AbortSignal.timeout(40000) },
  );
  assert.equal(response.status, 200, id);
  assert.ok(response.headers.get('content-type').startsWith('image/'), id);
  distinctJuiceBodies.add(
    Buffer.from(await response.arrayBuffer()).toString('base64'),
  );
}
assert.equal(
  distinctJuiceBodies.size,
  6,
  'Six genuinely distinct juice illustrations',
);
console.log('PASS six unique juice assets.');
