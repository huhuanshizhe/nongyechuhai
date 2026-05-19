import Link from 'next/link';
import { ProductCard } from '../components/ProductCard';
import { getHomepageData, getStorefrontShellData } from '../lib/storefront';

const sourcingPrinciples = [
  {
    title: 'Verified supplier posture',
    description: 'Shortlist supply partners that already passed approval, identity, and operational review before buyers start conversations.'
  },
  {
    title: 'Trade-mode clarity',
    description: 'Every listing makes the commercial route explicit: inquiry-first or payment-ready. No mixed buying logic.'
  },
  {
    title: 'Procurement-grade UX',
    description: 'The platform is designed for teams that compare origin, packing, specification, and response speed before pricing.'
  }
];

const workflow = [
  {
    step: '01',
    title: 'Scan the right product families',
    description: 'Move through category-level sourcing narratives before diving into individual SKUs.'
  },
  {
    step: '02',
    title: 'Compare trade modes and specification fit',
    description: 'Understand which lines are RFQ-led and which are already structured for direct commercial follow-through.'
  },
  {
    step: '03',
    title: 'Submit a structured RFQ',
    description: 'Send buyer-side operational details once, with quantity, market, and packaging context already captured.'
  },
  {
    step: '04',
    title: 'Transition into quote and order flow',
    description: 'The same data model continues into quote, mock payment, and order visibility for the supplier and admin teams.'
  }
];

export const revalidate = 300;

export default async function HomePage() {
  const [homeData, shellData] = await Promise.all([getHomepageData(), getStorefrontShellData()]);

  return (
    <main className="page-shell">
      <section className="hero-panel" data-rise="true">
        <div className="hero-copy">
          <span className="section-kicker">Professional agriculture sourcing</span>
          <div className="stack">
            <h1 className="hero-title">A trade-ready agriculture marketplace built for serious international buyers.</h1>
            <p>
              Source export-ready products through a buyer-first interface that emphasizes supplier credibility, trade-mode clarity, and fast RFQ execution instead of catalog noise.
            </p>
          </div>
          <div className="button-row">
            <Link className="button" href="/products">
              Explore product catalog
            </Link>
            <Link className="button button--ghost" href="/rfq">
              Launch an RFQ
            </Link>
          </div>
          <div className="hero-metrics">
            <article className="metric-card">
              <span className="metric-card__value">{shellData.publishedProductCount}</span>
              <span className="metric-card__label">published product lines ready for buyer review</span>
            </article>
            <article className="metric-card">
              <span className="metric-card__value">{shellData.approvedSupplierCount}</span>
              <span className="metric-card__label">approved suppliers visible in the buyer workflow</span>
            </article>
            <article className="metric-card">
              <span className="metric-card__value">24h</span>
              <span className="metric-card__label">RFQ response target for qualified demand</span>
            </article>
          </div>
        </div>
        <aside className="hero-aside">
          <div className="hero-aside__panel">
            <span className="pill">Buyer fit</span>
            <h2>Designed for importers, ingredient distributors, and private label procurement teams.</h2>
            <ul className="clean">
              <li>Specification-led catalog browsing instead of generic merchandising.</li>
              <li>Clear visibility into inquiry-only versus direct-purchase commercial paths.</li>
              <li>RFQ handoff structured to feed supplier and admin workflows without rework.</li>
            </ul>
          </div>
          <div className="hero-aside__panel">
            <span className="pill">Coverage snapshot</span>
            <div className="stack">
              {homeData.featuredCategories.map((category) => (
                <article key={category.slug}>
                  <strong>{category.name}</strong>
                  <p>{category.description}</p>
                </article>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section className="section-block" data-rise="true">
        <div className="section-head">
          <span className="section-kicker">Why buyers trust the flow</span>
          <h2 className="section-title">The UX is tuned for procurement confidence, not consumer impulse.</h2>
          <p className="section-description">
            International agriculture sourcing needs clear qualification signals, commercial context, and fast escalation into RFQ. The experience below is organized around those decisions.
          </p>
        </div>
        <div className="signal-grid">
          {sourcingPrinciples.map((item) => (
            <article className="section-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block" data-rise="true">
        <div className="section-head">
          <span className="section-kicker">Featured products</span>
          <h2 className="section-title">Start from high-signal product lines that already fit the buyer workflow.</h2>
          <p className="section-description">
            Each product card surfaces trade mode, supplier context, and commercial readiness before the buyer clicks deeper.
          </p>
        </div>
        <div className="product-grid">
          {homeData.featuredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="editorial-panel" data-rise="true">
        <div className="editorial-panel__copy">
          <span className="section-kicker">Editorial signal</span>
          <h2 className="section-title">{homeData.editorial.title}</h2>
          <p>{homeData.editorial.excerpt}</p>
          <div className="button-row">
              <Link className="button button--soft" href="/about">
                Review platform approach
            </Link>
            <Link className="button button--ghost" href="/rfq">
              Request a sourcing discussion
            </Link>
          </div>
        </div>
        <div className="insight-grid">
          <article className="insight-card">
            <span className="pill">Catalog structure</span>
            <h3>{shellData.activeCategoryCount} export families</h3>
            <p>Categories are organized to help buyers qualify the right family before comparing individual products.</p>
          </article>
          <article className="insight-card">
            <span className="pill">Response model</span>
            <h3>RFQ-first routing</h3>
            <p>Inquiry submissions are already shaped for the supplier center and backoffice review flow.</p>
          </article>
          <article className="insight-card">
            <span className="pill">Commercial progression</span>
            <h3>Quote to order continuity</h3>
            <p>The same platform data model continues into quote, order, and payment adapter states.</p>
          </article>
        </div>
      </section>

      <section className="section-block" id="procurement-system" data-rise="true">
        <div className="section-head">
          <span className="section-kicker">Procurement system</span>
          <h2 className="section-title">The buying journey is designed to reduce requalification and dead-end conversations.</h2>
        </div>
        <div className="workflow-grid">
          {workflow.map((item) => (
            <article className="workflow-card" key={item.step}>
              <span className="process-index">{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block" data-rise="true">
        <div className="section-head">
          <span className="section-kicker">Category focus</span>
          <h2 className="section-title">Move from category narrative to commercial action without losing context.</h2>
        </div>
        <div className="category-grid">
          {homeData.featuredCategories.map((category) => (
            <article className="category-card" key={category.slug}>
              <span className="catalog-chip">{category.familyLabel}</span>
              <h3>{category.name}</h3>
              <p>{category.description}</p>
              <Link className="product-card__link" href={`/products?category=${category.slug}`}>
                Open this sourcing lane
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block" data-rise="true">
        <div className="section-head">
          <span className="section-kicker">Next move</span>
          <h2 className="section-title">Already know what you need? Send a structured RFQ and skip generic inquiry loops.</h2>
        </div>
        <div className="button-row">
          <Link className="button" href="/rfq">
            Start RFQ desk
          </Link>
          <Link className="button button--earth" href="/products">
            Inspect catalog first
          </Link>
        </div>
      </section>
    </main>
  );
}
