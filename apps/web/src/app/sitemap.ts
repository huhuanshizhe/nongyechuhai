import type { MetadataRoute } from 'next';
import { prisma } from '@nongyechuhai/db';

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
    changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  }> = [
    { path: '',              priority: 1.0, changeFrequency: 'weekly'  }, // Home
    { path: '/products',     priority: 0.9, changeFrequency: 'weekly'  }, // Export Portfolio
    { path: '/traceability', priority: 0.8, changeFrequency: 'weekly'  }, // Credentials
    { path: '/rfq',          priority: 0.8, changeFrequency: 'weekly'  }, // Inquiry Desk
    { path: '/about',        priority: 0.7, changeFrequency: 'monthly' }, // About
    { path: '/login',        priority: 0.5, changeFrequency: 'monthly' }, // Buyer Login
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

  // ── Dynamic: Product detail pages ──
  try {
    const products = await prisma.product.findMany({
      where: {
        status: 'PUBLISHED',
        deletedAt: null,
      },
      select: {
        slug: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    for (const product of products) {
      const path = `/products/${product.slug}`;
      for (const locale of locales) {
        entries.push({
          url: `${siteUrl}/${locale}${path}`,
          lastModified: product.updatedAt,
          changeFrequency: 'weekly' as const,
          priority: 0.85,
          alternates: buildAlternates(path),
        });
      }
    }
  } catch {
    // If DB is unavailable at request time (e.g. cold start), skip dynamic entries.
    // Google will re-crawl and pick them up on subsequent requests.
  }

  return entries;
}
