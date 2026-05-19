import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="page-shell">
      <section className="not-found-card" data-rise="true">
        <span className="section-kicker">Not available</span>
        <h1>The page or product you requested is no longer available in the current export presentation.</h1>
        <p>
          The portfolio may have been updated, or the product may no longer be published. Return to the export portfolio and continue from an active category or inquiry route.
        </p>
        <div className="button-row">
          <Link className="button" href="/products">
            Back to portfolio
          </Link>
          <Link className="button button--ghost" href="/rfq">
            Open inquiry desk
          </Link>
        </div>
      </section>
    </main>
  );
}