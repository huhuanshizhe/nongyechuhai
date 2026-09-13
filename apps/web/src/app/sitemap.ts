import type { MetadataRoute } from 'next';
import { directions } from '../lib/highland';

// ── Config ──
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.farmetra.com';
const locales = ['en', 'zh'] as const;

/** Map internal locale codes to BCP-47 hreflang codes */
function hreflang(locale: string): string {
  return locale === 'zh' ? 'zh-CN' : locale;
}

/** Build alternates.languages map for a given path */
function buildAlternates(path: string): {
  languages: Record<string, string>;
} {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[hreflang(locale)] = `${siteUrl}/${locale}${path}`;
  }
  // x-default points to English for unmatched language requests
  languages['x-default'] = `${siteUrl}/en${path}`;
  return { languages };
}

// ── Sitemap Generator ──
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static public-facing pages — ordered by priority
  const staticPages: Array<{
    path: string;
    priority: number;
    changeFrequency:
      | 'always'
      | 'hourly'
      | 'daily'
      | 'weekly'
      | 'monthly'
      | 'yearly'
      | 'never';
  }> = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' }, // Home
    { path: '/collections', priority: 0.9, changeFrequency: 'weekly' },
    ...directions.map((item) => ({
      path: `/collections/${item.slug}`,
      priority: 0.85,
      changeFrequency: 'monthly' as const,
    })),
    { path: '/services', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/buying-guide', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/partners', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/sourcing', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/privacy', priority: 0.4, changeFrequency: 'monthly' },
    { path: '/traceability', priority: 0.8, changeFrequency: 'weekly' }, // Credentials
    { path: '/about', priority: 0.7, changeFrequency: 'monthly' }, // About
  ];

  const entries: MetadataRoute.Sitemap = [];

  // ── Static pages (every locale × every page) ──
  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${siteUrl}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: buildAlternates(page.path),
      });
    }
  }

  return entries;
}
