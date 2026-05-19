import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '../../auth';
import { getBuyerAccountData } from '../../lib/storefront';

export const metadata: Metadata = {
  title: 'Buyer Workspace',
  description: 'Review inquiries, quotations, and export orders tied to your buyer workspace.'
};

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!session?.user || !userId) {
    redirect('/login');
  }

  const account = await getBuyerAccountData(userId);

  if (!account) {
    redirect('/login');
  }

  return (
    <main className="page-shell">
      <section className="section-block account-hero" data-rise="true">
        <div className="page-head">
          <span className="section-kicker">Buyer workspace</span>
          <h1 className="section-title">{account.buyerName}, your inquiries, quotations, and order activity now sit in one export-facing view.</h1>
          <p className="catalog-intro">
            Follow open inquiries, see when quotations are in motion, and keep order coordination visible without switching between fragmented message threads.
          </p>
        </div>
        <div className="account-mini-meta">
          <span className="catalog-chip">{account.buyerEmail}</span>
          <Link className="button button--ghost" href="/rfq">
            Create another inquiry
          </Link>
        </div>
      </section>

      <section className="account-grid" data-rise="true">
        <article className="account-card">
          <span className="section-kicker">Open inquiries</span>
          <strong>{account.metrics.openInquiryCount}</strong>
          <p>Requests that still need supplier response, buyer clarification, or internal follow-up.</p>
        </article>
        <article className="account-card">
          <span className="section-kicker">Quotation in progress</span>
          <strong>{account.metrics.quotedInquiryCount}</strong>
          <p>Requests that already moved beyond intake and into commercial review or negotiation.</p>
        </article>
        <article className="account-card">
          <span className="section-kicker">Active orders</span>
          <strong>{account.metrics.activeOrderCount}</strong>
          <p>Orders that are pending, confirmed, processing, or moving through shipment execution.</p>
        </article>
        <article className="account-card">
          <span className="section-kicker">Paid orders</span>
          <strong>{account.metrics.paidOrderCount}</strong>
          <p>Orders that reached payment completion within the current presentation environment.</p>
        </article>
      </section>

      <section className="content-layout" data-rise="true">
        <article className="section-block">
          <div className="section-head">
            <span className="section-kicker">Inquiry history</span>
            <h2 className="section-title">Your recent inquiries</h2>
          </div>
          {account.inquiries.length > 0 ? (
            <div className="account-list">
              {account.inquiries.map((item) => (
                <article className="account-item" key={item.inquiryNumber}>
                  <div>
                    <strong>{item.productName}</strong>
                    <p>{item.supplierName}</p>
                  </div>
                  <div className="account-item__meta">
                    <span className={`status-pill status-pill--${item.statusTone}`}>{item.status}</span>
                    <span>{item.inquiryNumber}</span>
                    <span>{item.quoteCount} quotation record{item.quoteCount === 1 ? '' : 's'} · {item.createdAt}</span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="account-empty">
              <p>No inquiries are linked to this buyer yet.</p>
              <Link className="button" href="/rfq">
                Start your first inquiry
              </Link>
            </div>
          )}
        </article>

        <article className="section-block">
          <div className="section-head">
            <span className="section-kicker">Order visibility</span>
            <h2 className="section-title">Your recent orders</h2>
          </div>
          {account.orders.length > 0 ? (
            <div className="account-list">
              {account.orders.map((item) => (
                <article className="account-item" key={item.orderNumber}>
                  <div>
                    <strong>{item.orderNumber}</strong>
                    <p>{item.supplierName}</p>
                    <span>{item.productLabel}</span>
                  </div>
                  <div className="account-item__meta">
                    <span className={`status-pill status-pill--${item.statusTone}`}>{item.status}</span>
                    <span className={`status-pill status-pill--${item.paymentTone}`}>{item.paymentStatus}</span>
                    <span>{item.totalAmount} · {item.createdAt}</span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="account-empty">
              <p>No orders are linked to this buyer yet.</p>
              <Link className="button button--ghost" href="/products">
                Browse portfolio
              </Link>
            </div>
          )}
        </article>
      </section>
    </main>
  );
}