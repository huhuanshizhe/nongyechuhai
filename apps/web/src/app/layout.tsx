import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { PROJECT_NAME } from '@nongyechuhai/config';
import { auth } from '../auth';
import { BrandSignature } from '../components/BrandSignature';
import { signOutAction } from './actions';
import { JsonLd } from '../components/JsonLd';
import { buildOrganizationJsonLd, buildWebsiteJsonLd } from '../lib/structured-data';
import { getStorefrontShellData } from '../lib/storefront';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:4000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${PROJECT_NAME} | China Agricultural Export Showcase`,
    template: `%s | ${PROJECT_NAME}`
  },
  description:
    'Direct farm sourcing and end-to-end export delivery for premium Chinese agricultural products, from farms to global markets with export, customs, and cold chain support.',
  openGraph: {
    title: `${PROJECT_NAME} | China Agricultural Export Showcase`,
    description:
      'Direct sourcing of premium Chinese agricultural products, from farms to global markets with export, customs, and cold chain support.',
    url: siteUrl,
    siteName: PROJECT_NAME,
    type: 'website'
  }
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [shellData, session] = await Promise.all([getStorefrontShellData(), auth()]);
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'export@nongyechuhai.com';

  return (
    <html lang="en">
      <body>
        <JsonLd data={[buildWebsiteJsonLd(), buildOrganizationJsonLd(contactEmail)]} />
        <div className="site-shell">
          <header className="site-header">
            <div className="shell site-header__inner">
              <div className="brand-mark">
                <Link href="/" className="brand-mark__link">
                  <BrandSignature />
                </Link>
              </div>
              <nav className="site-nav" aria-label="Primary">
                <Link href="/">Home</Link>
                <Link href="/products">Export Portfolio</Link>
                <Link href="/about">About</Link>
                <Link href="/rfq">Inquiry Desk</Link>
                <Link href="/#trade-process">Trade Process</Link>
              </nav>
              <div className="header-actions">
                {session?.user ? (
                  <>
                    <Link className="button button--ghost" href="/account">
                      Buyer Workspace
                    </Link>
                    <Link className="button button--soft" href="/rfq">
                      Send Inquiry
                    </Link>
                    <form action={signOutAction}>
                      <button className="button button--earth" type="submit">
                        Sign out
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <Link className="button button--ghost" href="/products">
                      Browse Portfolio
                    </Link>
                    <Link className="button button--soft" href="/login">
                      Buyer login
                    </Link>
                    <Link className="button" href="/rfq">
                      Send Inquiry
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="shell trust-strip">
              <div className="trust-strip__item">
                <strong>{shellData.approvedSupplierCount}</strong>
                <span>approved supplier programs</span>
              </div>
              <div className="trust-strip__item">
                <strong>{shellData.publishedProductCount}</strong>
                <span>published showcase SKUs</span>
              </div>
              <div className="trust-strip__item">
                <strong>{shellData.activeCategoryCount}</strong>
                <span>active export categories</span>
              </div>
              <div className="trust-strip__item">
                <strong>48h</strong>
                <span>target first response</span>
              </div>
            </div>
          </header>
          {children}
          <footer className="site-footer">
            <div className="shell footer-grid">
              <div>
                <p className="section-kicker">Export presentation</p>
                <h2 className="footer-title">A structured storefront for formal product presentation, buyer qualification, and cross-border supply dialogue.</h2>
                <p className="footer-copy">
                  The current showcase centers on aquatic products, Yunnan fungi, Chinese tea, specialty vegetables, and halal prepared foods prepared for government and buyer demonstrations.
                </p>
              </div>
              <div className="footer-meta">
                <div>
                  <span className="footer-meta__label">Contact</span>
                  <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
                </div>
                <div>
                  <span className="footer-meta__label">Best fit</span>
                  <p>Importers, retail sourcing teams, foodservice distributors, and institutional buyers.</p>
                </div>
                <div>
                  <span className="footer-meta__label">Content</span>
                  <p>
                    <Link href="/about">About the export approach</Link>
                  </p>
                </div>
                <div>
                  <span className="footer-meta__label">Current platform focus</span>
                  <p>Origin visibility, specification clarity, and coordinated buyer inquiry follow-up.</p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
