import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { PROJECT_NAME } from '@nongyechuhai/config';
import { auth } from '../../auth';
import { BrandSignature } from '../../components/BrandSignature';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { signOutAction } from '../actions';
import { JsonLd } from '../../components/JsonLd';
import { buildOrganizationJsonLd, buildWebsiteJsonLd } from '../../lib/structured-data';
import { getStorefrontShellData } from '../../lib/storefront';
import { Link, routing } from '../../i18n/routing';
import '../globals.css';

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:4000';

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === 'zh';

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: isZh ? `${PROJECT_NAME} | 全球农业销售平台` : `${PROJECT_NAME} | Global Agricultural Sales Platform`,
      template: `%s | ${PROJECT_NAME}`
    },
    description: isZh
      ? '连接中国优质农产品供应与全球进口商、分销商、零售采购团队及贸易机构的跨境贸易平台。'
      : 'A global agricultural sales platform connecting vetted Chinese supply programs with importers, distributors, retail sourcing teams, and trade offices.',
    openGraph: {
      title: isZh ? `${PROJECT_NAME} | 全球农业销售平台` : `${PROJECT_NAME} | Global Agricultural Sales Platform`,
      description: isZh
        ? '连接中国优质农产品供应与全球进口商的跨境贸易平台。'
        : 'Vetted Chinese agricultural supply programs presented for global buyers with sourcing, qualification, export coordination, and delivery support.',
      url: siteUrl,
      siteName: PROJECT_NAME,
      type: 'website'
    }
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [messages, shellData, session] = await Promise.all([
    getMessages(),
    getStorefrontShellData(),
    auth()
  ]);

  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'export@farmetra.com';

  const t = {
    nav: {
      home: locale === 'zh' ? '首页' : 'Home',
      products: locale === 'zh' ? '出口产品' : 'Export Portfolio',
      about: locale === 'zh' ? '关于我们' : 'About',
      rfq: locale === 'zh' ? '询盘中心' : 'Inquiry Desk',
      tradeProcess: locale === 'zh' ? '贸易流程' : 'Trade Process',
      login: locale === 'zh' ? '买家登录' : 'Buyer Login',
      account: locale === 'zh' ? '买家工作台' : 'Buyer Workspace',
      signOut: locale === 'zh' ? '退出登录' : 'Sign out',
      sendInquiry: locale === 'zh' ? '发起询盘' : 'Send Inquiry'
    },
    header: {
      eyebrow: locale === 'zh' ? '直采农场，全链路出口交付' : 'Direct Farm Sourcing with End-to-End Export Delivery',
      summary: locale === 'zh'
        ? '面向买家的出口产品展示，包含供应商资质、物流路线、清关处理及冷链协调等跨境贸易服务。'
        : 'Buyer-facing export portfolio with supplier programs, route visibility, customs handling, and cold-chain coordination for international agricultural trade.',
      signals: {
        suppliers: locale === 'zh' ? '个供应商项目' : 'supplier programs',
        categories: locale === 'zh' ? '个品类' : 'categories',
        products: locale === 'zh' ? '个在线产品' : 'online lines',
        response: locale === 'zh' ? '48小时响应' : '48h first response'
      }
    },
    footer: {
      platform: locale === 'zh' ? '全球销售平台' : 'Global sales platform',
      description: locale === 'zh'
        ? '面向买家的农产品采购、资质认证及跨境销售协调平台。'
        : 'A buyer-facing agricultural platform for sourcing, qualification, and cross-border sales coordination.',
      contact: locale === 'zh' ? '联系方式' : 'Contact',
      bestFit: locale === 'zh' ? '适用对象' : 'Best fit',
      bestFitDescription: locale === 'zh'
        ? '进口商、零售采购团队、餐饮分销商及机构买家。'
        : 'Importers, retail sourcing teams, foodservice distributors, and institutional buyers.',
      content: locale === 'zh' ? '内容' : 'Content',
      aboutLink: locale === 'zh' ? '了解出口服务' : 'About the export approach',
      focus: locale === 'zh' ? '平台定位' : 'Current platform focus',
      focusDescription: locale === 'zh'
        ? '供应商认证、商业透明及询盘至交付全程跟进。'
        : 'Supplier qualification, commercial clarity, and disciplined inquiry-to-delivery follow-up.'
    }
  };

  return (
    <html lang={locale === 'zh' ? 'zh-CN' : 'en'}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <JsonLd data={[buildWebsiteJsonLd(), buildOrganizationJsonLd(contactEmail)]} />
          <div className="site-shell">
            <header className="site-header">
              <div className="shell site-header__band">
                <div className="brand-mark">
                  <Link href="/" className="brand-mark__link">
                    <BrandSignature />
                  </Link>
                </div>
                <nav className="site-nav" aria-label="Primary">
                  <Link className="site-nav__link" href="/">{t.nav.home}</Link>
                  <Link className="site-nav__link" href="/products">{t.nav.products}</Link>
                  <Link className="site-nav__link" href="/about">{t.nav.about}</Link>
                  <Link className="site-nav__link" href="/rfq">{t.nav.rfq}</Link>
                  <Link className="site-nav__link" href="/#trade-process">{t.nav.tradeProcess}</Link>
                </nav>
                <div className="header-actions">
                  <LanguageSwitcher />
                  {session?.user ? (
                    <>
                      <Link className="header-link header-link--workspace" href="/account">
                        {t.nav.account}
                      </Link>
                      <Link className="button" href="/rfq">
                        {t.nav.sendInquiry}
                      </Link>
                      <form action={signOutAction}>
                        <button className="header-link header-link--button" type="submit">
                          {t.nav.signOut}
                        </button>
                      </form>
                    </>
                  ) : (
                    <>
                      <Link className="header-link" href="/login">
                        {t.nav.login}
                      </Link>
                      <Link className="button" href="/rfq">
                        {t.nav.sendInquiry}
                      </Link>
                    </>
                  )}
                </div>
              </div>
              <div className="shell site-header__meta">
                <div className="site-header__summary">
                  <span className="site-header__eyebrow">{t.header.eyebrow}</span>
                  <p>{t.header.summary}</p>
                </div>
                <div className="site-header__signals" aria-label="Platform signals">
                  <span>{shellData.approvedSupplierCount} {t.header.signals.suppliers}</span>
                  <span>{shellData.activeCategoryCount} {t.header.signals.categories}</span>
                  <span>{shellData.publishedProductCount} {t.header.signals.products}</span>
                  <span>{t.header.signals.response}</span>
                </div>
              </div>
            </header>
            {children}
            <footer className="site-footer">
              <div className="shell footer-grid">
                <div>
                  <p className="section-kicker">{t.footer.platform}</p>
                  <h2 className="footer-title">{t.footer.description}</h2>
                  <p className="footer-copy">
                    {locale === 'zh'
                      ? 'farmetra展示优质农产品供应项目，包含品类逻辑、供应商资质及出口交付协调，面向专业全球买家。'
                      : 'farmetra presents vetted agricultural supply programs with category logic, supplier readiness, and export-delivery coordination for serious global buyers.'}
                  </p>
                </div>
                <div className="footer-meta">
                  <div>
                    <span className="footer-meta__label">{t.footer.contact}</span>
                    <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
                  </div>
                  <div>
                    <span className="footer-meta__label">{t.footer.bestFit}</span>
                    <p>{t.footer.bestFitDescription}</p>
                  </div>
                  <div>
                    <span className="footer-meta__label">{t.footer.content}</span>
                    <p>
                      <Link href="/about">{t.footer.aboutLink}</Link>
                    </p>
                  </div>
                  <div>
                    <span className="footer-meta__label">{t.footer.focus}</span>
                    <p>{t.footer.focusDescription}</p>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}