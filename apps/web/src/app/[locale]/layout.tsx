import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { BrandSignature } from '../../components/BrandSignature';
import { BrandNavigation } from '../../components/BrandNavigation';
import { Link, routing } from '../../i18n/routing';
import { highlandSocialImage } from '../../lib/highland';
import '../globals.css';
import '../highland.css';
import '../brand.css';
type Props = { children: ReactNode; params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const zh = locale === 'zh';
  const title = zh
    ? 'Farmetra | 源自高原的风味'
    : 'Farmetra | Good food. Remarkable origins.';
  const description = zh
    ? '源自青藏高原的特色食品与天然食材。探索枸杞、沙棘、青稞与藜麦，为您的品牌发现更多风味。'
    : 'Distinctive foods and ingredients from the Qinghai–Tibet Plateau. Explore goji berries, sea buckthorn, barley and quinoa for your next food range.';
  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || 'https://www.farmetra.com',
    ),
    title: { default: title, template: '%s | Farmetra' },
    description,
    icons: { icon: '/icon.svg' },
    openGraph: {
      title,
      description,
      siteName: 'Farmetra',
      type: 'website',
      locale: zh ? 'zh_CN' : 'en_US',
      images: [highlandSocialImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [highlandSocialImage.url],
    },
  };
}
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  const zh = locale === 'zh';
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'export@farmetra.com';
  return (
    <html lang={zh ? 'zh-CN' : 'en'}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <a className="ft-skip" href="#main-content">
            {zh ? '跳转至正文' : 'Skip to content'}
          </a>
          <BrandNavigation locale={locale} />
          <div id="main-content">{children}</div>
          <footer className="ft-footer">
            <div className="ft-container ft-footer__top">
              <div className="ft-footer__brand">
                <Link href="/" className="ft-logo">
                  <BrandSignature locale={locale} />
                </Link>
                <p>
                  {zh
                    ? '高原的馈赠，世界的风味。'
                    : 'Good food. Remarkable origins.'}
                </p>
                <a href={`mailto:${email}`}>{email}</a>
              </div>
              <div>
                <h2>{zh ? '发现高原' : 'Discover'}</h2>
                <Link href="/collections">
                  {zh ? '特色产品' : 'Our products'}
                </Link>
                <Link href="/about">{zh ? '产地故事' : 'Our origins'}</Link>
                <Link href="/traceability">
                  {zh ? '品质与细节' : 'Quality matters'}
                </Link>
                <Link href="/buying-guide">
                  {zh ? '采购指南' : 'Buying guide'}
                </Link>
              </div>
              <div>
                <h2>{zh ? '携手同行' : 'Connect'}</h2>
                <Link href="/services">
                  {zh ? '服务与支持' : 'How we help'}
                </Link>
                <Link href="/partners">{zh ? '合作伙伴' : 'Our partners'}</Link>
                <Link href="/sourcing">{zh ? '联系团队' : 'Contact us'}</Link>
              </div>
              <div className="ft-footer__statement">
                <p>
                  {zh
                    ? '从青藏高原出发，\n为世界餐桌增添新的风味。'
                    : 'From the Qinghai–Tibet Plateau,\nto a world of possibility.'}
                </p>
              </div>
            </div>
            <div className="ft-container ft-footer__bottom">
              <span>
                © {new Date().getFullYear()} Farmetra.{' '}
                {zh ? '保留所有权利。' : 'All rights reserved.'}
              </span>
              <Link href="/privacy">{zh ? '隐私说明' : 'Privacy notice'}</Link>
            </div>
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
