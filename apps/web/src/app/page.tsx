import Link from 'next/link';
import { ProductCard } from '../components/ProductCard';
import { getHomepageData, getStorefrontShellData } from '../lib/storefront';

const sourcingPrinciples = [
  {
    title: 'Origin-led category structure',
    description: 'The portfolio is arranged around real export families such as aquatic products, fungi, tea, specialty vegetables, and halal prepared foods.'
  },
  {
    title: 'Commercial route clarity',
    description: 'Every listing shows whether it should begin through the inquiry desk or can move directly into order review with published reference pricing.'
  },
  {
    title: 'Presentation-grade product detail',
    description: 'Images, specification highlights, and supplier origin are curated for formal demonstration rather than generic marketplace volume.'
  }
];

const workflow = [
  {
    step: '01',
    title: 'Review the right category and origin',
    description: 'Start from the export family that matches the buyer brief before narrowing into a specific showcase line.'
  },
  {
    step: '02',
    title: 'Open the export profile',
    description: 'Use specification highlights, origin notes, and route labels to assess whether the line fits your current commercial stage.'
  },
  {
    step: '03',
    title: 'Submit the buyer brief',
    description: 'Send market, quantity, pack format, and certification needs through a single structured inquiry form.'
  },
  {
    step: '04',
    title: 'Coordinate quote and execution follow-up',
    description: 'Qualified requests can continue into quotation review, sample planning, and order coordination without restarting the conversation.'
  }
];

export const revalidate = 300;

export default async function HomePage() {
  const [homeData, shellData] = await Promise.all([getHomepageData(), getStorefrontShellData()]);

  return (
    <main className="page-shell">
      <section className="hero-panel" data-rise="true">
        <div className="hero-copy">
          <span className="section-kicker">China agricultural export showcase</span>
          <div className="stack">
            <h1 className="hero-title">Direct Sourcing of Premium Chinese Agricultural Products</h1>
            <p>
              From Farms to Global Markets with Export, Customs, and Cold Chain Support
            </p>
          </div>
          <div className="hero-standards">
            <article className="hero-standard">
              <strong>{shellData.activeCategoryCount} formal export families</strong>
              <span>Organized the way delegations, importers, and institutional buyers review category coverage.</span>
            </article>
            <article className="hero-standard">
              <strong>{shellData.approvedSupplierCount} approved supplier programs</strong>
              <span>Presented with origin context, category fit, and a clear commercial route.</span>
            </article>
            <article className="hero-standard">
              <strong>Buyer inquiry desk</strong>
              <span>Built to capture market, pack, quantity, and documentation needs in one brief.</span>
            </article>
          </div>
          <div className="button-row">
            <Link className="button" href="/products">
              View export portfolio
            </Link>
            <Link className="button button--ghost" href="/rfq">
              Open inquiry desk
            </Link>
          </div>
          <div className="hero-metrics">
            <article className="metric-card">
              <span className="metric-card__value">{shellData.publishedProductCount}</span>
              <span className="metric-card__label">showcase products currently online for formal review</span>
            </article>
            <article className="metric-card">
              <span className="metric-card__value">{shellData.approvedSupplierCount}</span>
              <span className="metric-card__label">approved suppliers represented in the presentation portfolio</span>
            </article>
            <article className="metric-card">
              <span className="metric-card__value">48h</span>
              <span className="metric-card__label">target first response for qualified buyer inquiries</span>
            </article>
          </div>
        </div>
        <aside className="hero-aside">
          <div className="hero-aside__panel">
            <span className="pill">Presentation brief</span>
            <h2>Designed to show product origin, commercial format, and supplier coverage without marketplace noise.</h2>
            <ul className="clean">
              <li>Category architecture aligned to real agricultural export families.</li>
              <li>Clear distinction between inquiry-led programs and direct-order showcase lines.</li>
              <li>Inquiry capture structured for supplier follow-up, sample planning, and quote discussion.</li>
            </ul>
          </div>
          <div className="hero-aside__panel">
            <span className="pill">Showcase families</span>
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
          <span className="section-kicker">Why this reads professionally</span>
          <h2 className="section-title">The showcase makes the right trade signals visible before a buyer reaches out.</h2>
          <p className="section-description">
            International agriculture discussions move faster when category structure, origin, pack format, and commercial route are already clear. The storefront is organized around those decisions.
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
          <h2 className="section-title">Key showcase lines currently presented to buyers and delegations.</h2>
          <p className="section-description">
            Each card surfaces the product family, supplier origin, and commercial route before the buyer opens the full export profile.
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
          <span className="section-kicker">Export approach</span>
          <h2 className="section-title">{homeData.editorial.title}</h2>
          <p>{homeData.editorial.excerpt}</p>
          <div className="button-row">
            <Link className="button button--soft" href="/about">
              Read the export approach
            </Link>
            <Link className="button button--ghost" href="/rfq">
              Request a buyer discussion
            </Link>
          </div>
        </div>
        <div className="insight-grid">
          <article className="insight-card">
            <span className="pill">Category architecture</span>
            <h3>{shellData.activeCategoryCount} export families</h3>
            <p>The portfolio is grouped the way institutional buyers and delegations review export categories.</p>
          </article>
          <article className="insight-card">
            <span className="pill">Supplier coverage</span>
            <h3>{shellData.approvedSupplierCount} approved programs</h3>
            <p>Supplier representation already spans multiple origin stories, product families, and commercial formats.</p>
          </article>
          <article className="insight-card">
            <span className="pill">Inquiry handling</span>
            <h3>Unified buyer brief</h3>
            <p>Buyers can move from portfolio review into a structured inquiry without losing product, market, or packaging context.</p>
          </article>
        </div>
      </section>

      <section className="section-block" id="trade-process" data-rise="true">
        <div className="section-head">
          <span className="section-kicker">Trade process</span>
          <h2 className="section-title">The buyer journey is designed to reduce requalification and keep the export discussion moving.</h2>
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
          <h2 className="section-title">Navigate formal product families, not miscellaneous listing clusters.</h2>
        </div>
        <div className="category-grid">
          {homeData.featuredCategories.map((category) => (
            <article className="category-card" key={category.slug}>
              <span className="catalog-chip">{category.familyLabel}</span>
              <h3>{category.name}</h3>
              <p>{category.description}</p>
              <Link className="product-card__link" href={`/products?category=${category.slug}`}>
                Browse this family
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block" data-rise="true">
        <div className="section-head">
          <span className="section-kicker">Next move</span>
          <h2 className="section-title">Need a quote, sample plan, or compliance discussion? Start with the inquiry desk.</h2>
        </div>
        <div className="button-row">
          <Link className="button" href="/rfq">
            Start inquiry desk
          </Link>
          <Link className="button button--earth" href="/products">
            Inspect portfolio first
          </Link>
        </div>
      </section>
    </main>
  );
}
