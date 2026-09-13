/** Read-only HTTP checks. No browser automation, form posts, emails or database mutations. */
import assert from 'node:assert/strict';
const base = process.argv[2];
if (!base) throw new Error('Provide the exact running preview URL.');
const paths = [
  '',
  '/collections',
  '/collections/goji',
  '/collections/sea-buckthorn',
  '/collections/highland-barley',
  '/collections/quinoa',
  '/services',
  '/partners',
  '/sourcing',
  '/traceability',
  '/about',
  '/privacy',
];
let passed = 0;
let failed = 0;
for (const locale of ['zh', 'en']) {
  for (let i = 0; i < paths.length; i += 3) {
    await Promise.all(
      paths.slice(i, i + 3).map(async (path) => {
        try {
          const url = new URL('/' + locale + path, base);
          const response = await fetch(url, {
            signal: AbortSignal.timeout(55000),
          });
          const html = await response.text();
          assert.equal(response.status, 200, 'HTTP status');
          assert.ok(
            !html.includes('NEXT_HTTP_ERROR_FALLBACK;500'),
            'server error',
          );
          assert.ok(html.includes('Farmetra'), 'brand');
          assert.ok(html.includes('farmetra-social.png'), 'social image');
          assert.ok(html.includes('<h1'), 'main heading');
          assert.ok(html.includes('rel="canonical"'), 'canonical URL');
          assert.ok(
            html.includes('hrefLang="zh-CN"') ||
              html.includes('hreflang="zh-CN"'),
            'language alternates',
          );
          if (path === '')
            assert.ok(
              html.includes(locale === 'zh' ? '高原好物' : 'From the plateau.'),
              'new homepage',
            );
          if (path === '/sourcing')
            assert.ok(
              html.includes(
                locale === 'zh'
                  ? '不会自动提交到后台或发送邮件'
                  : 'does not automatically submit',
              ),
              'truthful intake notice',
            );
          if (path === '/about')
            assert.ok(
              html.includes(
                locale === 'zh' ? '不参与投资' : 'without capital investment',
              ),
              'operator model',
            );
          if (path === '/collections')
            assert.ok(html.includes('type="search"'), 'search field');
          passed++;
          process.stdout.write('PASS /' + locale + path + '\n');
        } catch (error) {
          failed++;
          process.stdout.write(
            'FAIL /' + locale + path + ' ' + error.message + '\n',
          );
        }
      }),
    );
  }
}
for (const path of [
  '/zh/collections/not-a-collection',
  '/en/collections/not-a-collection',
]) {
  try {
    const response = await fetch(new URL(path, base), {
      signal: AbortSignal.timeout(55000),
    });
    assert.equal(response.status, 404);
    passed++;
    process.stdout.write('PASS 404 ' + path + '\n');
  } catch (error) {
    failed++;
    process.stdout.write('FAIL ' + path + ' ' + error.message + '\n');
  }
}
for (const path of [
  '/images/highland/plateau-hero.png',
  '/images/highland/farmetra-social.png',
]) {
  try {
    const response = await fetch(new URL(path, base), {
      signal: AbortSignal.timeout(15000),
    });
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /image/);
    passed++;
    process.stdout.write('PASS asset ' + path + '\n');
  } catch (error) {
    failed++;
    process.stdout.write('FAIL ' + path + ' ' + error.message + '\n');
  }
}
try {
  const response = await fetch(new URL('/zh/sourcing?direction=goji', base));
  const html = await response.text();
  assert.match(
    html,
    /<option[^>]*(?:value="goji"[^>]*selected|selected[^>]*value="goji")/,
  );
  passed++;
  process.stdout.write('PASS sourcing direction prefill\n');
} catch (error) {
  failed++;
  process.stdout.write('FAIL prefill ' + error.message + '\n');
}
process.stdout.write('\n' + passed + ' passed; ' + failed + ' failed.\n');
if (failed) process.exitCode = 1;
