import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="page-shell">
      <section className="not-found-card" data-rise="true">
        <span className="section-kicker">Page not found</span>
        <h1>The sourcing page you requested is not available.</h1>
        <p>
          The catalog may have changed or the product is no longer published. Return to the buyer-facing catalog and continue from an active sourcing lane.
        </p>
        <div className="button-row">
          <Link className="button" href="/products">
            Back to catalog
          </Link>
          <Link className="button button--ghost" href="/rfq">
            Open RFQ desk
          </Link>
        </div>
      </section>
    </main>
  );
}