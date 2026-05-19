import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { PROJECT_NAME } from '@nongyechuhai/config';
import { auth } from '../auth';
import { signOutAction } from './actions';
import { JsonLd } from '../components/JsonLd';
import { buildOrganizationJsonLd, buildWebsiteJsonLd } from '../lib/structured-data';
import { getStorefrontShellData } from '../lib/storefront';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:4000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${PROJECT_NAME} | Trusted Export Sourcing for Professional Agriculture Buyers`,
    template: `%s | ${PROJECT_NAME}`
  },
  description:
    'A buyer-first agriculture sourcing platform built for international procurement teams that need verified suppliers, clear trade modes, and fast RFQ execution.',
  openGraph: {
    title: `${PROJECT_NAME} | Trusted Export Sourcing for Professional Agriculture Buyers`,
    description:
      'Source export-ready agriculture products through a buyer-grade platform designed for RFQ, qualification, and supply confidence.',
    url: siteUrl,
    siteName: PROJECT_NAME,
    type: 'website'
  }
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [shellData, session] = await Promise.all([getStorefrontShellData(), auth()]);
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'rfq@nongyechuhai.local';

  return (
    <html lang="en">
      <body>
        <JsonLd data={[buildWebsiteJsonLd(), buildOrganizationJsonLd(contactEmail)]} />
        <div className="site-shell">
          <header className="site-header">
            <div className="shell site-header__inner">
              <div className="brand-mark">
                <Link href="/" className="brand-mark__link">
                  <span className="brand-mark__name">Nongyechuhai</span>
                  <span className="brand-mark__tag">International sourcing for serious agriculture buyers</span>
                </Link>
              </div>
              <nav className="site-nav" aria-label="Primary">
                <Link href="/">Home</Link>
                <Link href="/products">Products</Link>
                <Link href="/about">About</Link>
                <Link href="/rfq">RFQ Desk</Link>
                <Link href="/#procurement-system">Procurement System</Link>
              </nav>
              <div className="header-actions">
                {session?.user ? (
                  <>
                    <Link className="button button--ghost" href="/account">
                      Buyer account
                    </Link>
                    <Link className="button button--soft" href="/rfq">
                      Send RFQ
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
                      Browse catalog
                    </Link>
                    <Link className="button button--soft" href="/login">
                      Buyer login
                    </Link>
                    <Link className="button" href="/rfq">
                      Send RFQ
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="shell trust-strip">
              <div className="trust-strip__item">
                <strong>{shellData.approvedSupplierCount}</strong>
                <span>approved suppliers</span>
              </div>
              <div className="trust-strip__item">
                <strong>{shellData.publishedProductCount}</strong>
                <span>published product lines</span>
              </div>
              <div className="trust-strip__item">
                <strong>{shellData.activeCategoryCount}</strong>
                <span>active export categories</span>
              </div>
              <div className="trust-strip__item">
                <strong>24h</strong>
                <span>target RFQ response window</span>
              </div>
            </div>
          </header>
          {children}
          <footer className="site-footer">
            <div className="shell footer-grid">
              <div>
                <p className="section-kicker">Buyer operations</p>
                <h2 className="footer-title">Built for procurement teams that buy with process, not guesswork.</h2>
                <p className="footer-copy">
                  Verify supplier readiness, compare trade modes, and move from discovery to RFQ on one shared data model.
                </p>
              </div>
              <div className="footer-meta">
                <div>
                  <span className="footer-meta__label">Contact</span>
                  <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
                </div>
                <div>
                  <span className="footer-meta__label">Best fit</span>
                  <p>Importers, ingredient distributors, private label buyers, regional sourcing teams.</p>
                </div>
                <div>
                  <span className="footer-meta__label">Content</span>
                  <p>
                    <Link href="/about">About the sourcing platform</Link>
                  </p>
                </div>
                <div>
                  <span className="footer-meta__label">Current platform focus</span>
                  <p>RFQ-first sourcing, supplier qualification visibility, and payment-ready order scaffolding.</p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
