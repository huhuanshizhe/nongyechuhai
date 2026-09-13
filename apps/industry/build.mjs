import { mkdir, writeFile, copyFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pages, render } from './src/site.mjs';
import sharp from 'sharp';
const root = dirname(fileURLToPath(import.meta.url));
const out = resolve(root, 'dist');
await mkdir(resolve(out, 'assets'), { recursive: true });
for (const name of ['style.css', 'origin.css', 'app.js'])
  await copyFile(resolve(root, 'src', name), resolve(out, name));
const images = [
  'supplier-red-goji-berries.jpg',
  'supplier-black-goji-jar.jpg',
  'supplier-fresh-locked-goji-jar.jpg',
  'supplier-goji-blossom-honey.jpg',
  'supplier-red-goji-box.jpg',
  'supplier-goji-sprout-tea-jar.jpg',
  'supplier-goji-leaf-tea-box.jpg',
  'supplier-goji-growing-field.jpg',
  'supplier-goji-field-rows.jpg',
  'supplier-goji-harvest-closeup.jpg',
  'goji-editorial.png',
  'rainbow-trout-editorial.png',
  'sea-buckthorn-editorial.png',
  'barley-editorial.png',
  'quinoa-editorial.png',
  'black-goji-editorial.png',
  'honey-editorial.png',
  'food-table-editorial.png',
  'hengtai-about.png',
  'hengtai-origin.jpg',
  'hengtai-red-goji.jpg',
];
for (const name of images)
  await sharp(resolve(root, '../web/public/images/brand-v2', name))
    .resize({ width: 1000, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(resolve(out, 'assets', name.replace(/\.(png|jpg)$/, '.webp')));
await sharp(resolve(root, '../web/public/images/highland/plateau-hero.png'))
  .resize({ width: 1800, withoutEnlargement: true })
  .webp({ quality: 85 })
  .toFile(resolve(out, 'assets/plateau-hero.webp'));
await copyFile(
  resolve(root, '../web/public/icon.svg'),
  resolve(out, 'icon.svg'),
);
for (const page of pages)
  await writeFile(
    resolve(
      out,
      page.path === '/' ? 'index.html' : page.path.slice(1) + '.html',
    ),
    render(page),
  );
await writeFile(
  resolve(out, '404.html'),
  render({
    path: '/404',
    title: '页面未找到',
    description: '返回平台首页继续了解产业合作。',
    body: '<section class="container section empty"><h1>这条路径暂未开放。</h1><p>您可以返回首页，继续了解企业出海与产业合作。</p><a class="button" href="/">返回首页</a></section>',
  }),
);
const site =
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? 'https://' + process.env.VERCEL_PROJECT_PRODUCTION_URL
    : '');
await writeFile(
  resolve(out, 'robots.txt'),
  'User-agent: *\nAllow: /\n' + (site ? `Sitemap: ${site}/sitemap.xml\n` : ''),
);
if (site)
  await writeFile(
    resolve(out, 'sitemap.xml'),
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
      pages.map((p) => `<url><loc>${site}${p.path}</loc></url>`).join('') +
      '</urlset>',
  );
console.log(`Built ${pages.length} industry pages and local image assets.`);
