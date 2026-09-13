import assert from 'node:assert/strict';
const base = process.argv[2];
if (!base) throw new Error('Supply the overseas site URL.');
for (const locale of ['en', 'zh']) {
  for (const path of ['', '/about']) {
    const response = await fetch(new URL(`/${locale}${path}`, base));
    assert.equal(response.status, 200);
    const html = await response.text();
    for (const term of [
      'rainbow-trout-editorial.png',
      '2025',
      'www.qinghai.gov.cn',
      'www.qhio.gov.cn',
      `/${locale}/sourcing?topic=rainbow-trout`,
    ])
      assert.ok(html.includes(term), `${locale}${path}: ${term}`);
    assert.ok(html.includes(locale === 'zh' ? '45.23万亩' : '≈30,153 ha'));
    assert.ok(html.includes(locale === 'zh' ? '20万亩' : '≈13,333 ha'));
    assert.ok(html.includes(locale === 'zh' ? '3.8亿元以上' : 'RMB 380m+'));
    assert.ok(
      html.includes(
        locale === 'zh'
          ? '不等同于全部取得有机认证'
          : 'not an exclusively organic-certified area',
      ),
    );
    assert.ok(
      !html.includes('href="/contact'),
      'No invalid unlocalized contact route',
    );
    console.log('PASS regional evidence', locale + path);
  }
  const quality = await (
    await fetch(new URL(`/${locale}/traceability`, base))
  ).text();
  assert.ok(
    quality.includes(
      locale === 'zh' ? '有机，有据可查。' : 'Organic, where certified.',
    ),
  );
  console.log('PASS quality wording', locale);
}
const image = await fetch(
  new URL('/images/brand-v2/rainbow-trout-editorial.png', base),
);
assert.equal(image.status, 200);
assert.ok(image.headers.get('content-type').startsWith('image/'));
console.log('PASS trout image. Read-only checks; no enquiry sent.');
