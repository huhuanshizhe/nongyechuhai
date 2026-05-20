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
    default: `${PROJECT_NAME} | Global Agricultural Sales Platform`,
    template: `%s | ${PROJECT_NAME}`
  },
  description:
    'A global agricultural sales platform connecting vetted Chinese supply programs with importers, distributors, retail sourcing teams, and trade offices.',
  openGraph: {
    title: `${PROJECT_NAME} | Global Agricultural Sales Platform`,
    description:
      'Vetted Chinese agricultural supply programs presented for global buyers with sourcing, qualification, export coordination, and delivery support.',
    url: siteUrl,
    siteName: PROJECT_NAME,
    type: 'website'
  }
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [shellData, session] = await Promise.all([getStorefrontShellData(), auth()]);
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'export@farmetra.com';

  return (
    <html lang="en">
      <body>
        <JsonLd data={[buildWebsiteJsonLd(), buildOrganizationJsonLd(contactEmail)]} />
        <div className="site-shell">
          <header className="site-header">
            <div className="shell site-header__band">
              <div className="brand-mark">
                <Link href="/" className="brand-mark__link">
                  <BrandSignature />
                </Link>
              </div>
              <div className="site-header__summary">
                <span className="site-header__eyebrow">Global agricultural sales platform</span>
                <p>Direct sourcing, export coordination, customs handling, and cold-chain support for global agricultural buyers.</p>
              </div>
              <div className="header-actions">
                {session?.user ? (
                  <>
                    <Link className="header-link" href="/account">
                      Buyer Workspace
                    </Link>
                    <Link className="button" href="/rfq">
                      Send Inquiry
                    </Link>
                    <form action={signOutAction}>
                      <button className="header-link header-link--button" type="submit">
                        Sign out
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <Link className="header-link" href="/login">
                      Buyer Login
                    </Link>
                    <Link className="button" href="/rfq">
                      Send Inquiry
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="shell site-header__navrow">
              <nav className="site-nav" aria-label="Primary">
                <Link href="/">Home</Link>
                <Link href="/products">Export Portfolio</Link>
                <Link href="/about">About</Link>
                <Link href="/rfq">Inquiry Desk</Link>
                <Link href="/#trade-process">Trade Process</Link>
              </nav>
              <div className="site-header__signals" aria-label="Platform signals">
                <span>{shellData.approvedSupplierCount} supplier programs</span>
                <span>{shellData.activeCategoryCount} categories</span>
                <span>{shellData.publishedProductCount} online lines</span>
                <span>48h first response</span>
              </div>
            </div>
          </header>
          {children}
          <footer className="site-footer">
            <div className="shell footer-grid">
              <div>
                <p className="section-kicker">Global sales platform</p>
                <h2 className="footer-title">A buyer-facing agricultural platform for sourcing, qualification, and cross-border sales coordination.</h2>
                <p className="footer-copy">
                  farmetra presents vetted agricultural supply programs with category logic, supplier readiness, and export-delivery coordination for serious global buyers.
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
                  <p>Supplier qualification, commercial clarity, and disciplined inquiry-to-delivery follow-up.</p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
