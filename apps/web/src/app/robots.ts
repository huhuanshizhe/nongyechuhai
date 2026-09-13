import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.farmetra.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/account/',
          '/supplier/',
          '/admin/',
          '/api/',
          '/en/account',
          '/zh/account',
          '/en/login',
          '/zh/login',
          '/en/register',
          '/zh/register',
          '/en/products',
          '/zh/products',
          '/en/rfq',
          '/zh/rfq',
          '/en/legacy-credentials',
          '/zh/legacy-credentials',
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
