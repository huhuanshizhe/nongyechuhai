import Link from 'next/link';
import { ProductCard } from '../components/ProductCard';
import { getHomepageData, getStorefrontShellData } from '../lib/storefront';

const platformStandards = [
  {
    title: 'Vetted program structure',
    description: 'Each supply line is framed with category logic, supplier context, and commercial route before a quotation discussion begins.'
  },
  {
    title: 'Buyer-facing qualification',
    description: 'Importers and sourcing teams can review packaging, compliance direction, and execution fit without digging through generic marketplace clutter.'
  },
  {
    title: 'Cross-border execution discipline',
    description: 'The platform presents sourcing, documentation, cold-chain planning, and follow-up as one commercial workflow rather than disconnected steps.'
  }
];

const tradeCapabilities = [
  {
    title: 'What you can confirm here',
    description: 'Product family, supplier origin, pack format, and whether the line is inquiry-led or already published for direct review.'
  },
  {
    title: 'What support is already visible',
    description: 'Export coordination, customs handling, and cold-chain requirements are surfaced before you request pricing or samples.'
  },
  {
    title: 'What to send in your brief',
    description: 'Target market, quantity, packaging, certifications, and timeline so the supplier reply can be commercially usable.'
  }
];

const marketLanes = [
  {
    title: 'Importers and distributors',
    description: 'Buyers comparing origin, route, and execution readiness before opening a quotation discussion.'
  },
  {
    title: 'Retail sourcing teams',
    description: 'Teams reviewing packaged lines, labeling fit, shelf formats, and supplier follow-up capability.'
  },
  {
    title: 'Foodservice and institutional buyers',
    description: 'Procurement teams that need clear route labels, product context, and delivery support before samples move.'
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
  const credibilitySignals = [
    {
      label: 'Vetted programs',
      value: `${shellData.approvedSupplierCount}`,
      description: 'Supplier programs already positioned for buyer-facing review.'
    },
    {
      label: 'Product families',
      value: `${shellData.activeCategoryCount}`,
      description: 'Formal agricultural categories, not miscellaneous listing clusters.'
    },
    {
      label: 'Buyer-ready lines',
      value: `${shellData.publishedProductCount}`,
      description: 'Published products with visible route, specifications, and next-step logic.'
    },
    {
      label: 'Response target',
      value: '48h response target',
      description: 'Inquiry handling is structured to preserve market, pack, and delivery context from the first brief.'
    }
  ];

  return (
    <main className="page-shell page-shell--home">
      <section className="hero-stage" data-rise="true">
        <div className="hero-stage__main">
          <div className="hero-stage__eyebrow">
            <span className="section-kicker">Global agricultural sales platform</span>
            <span className="hero-stage__tag">China supply programs • buyer qualification • export delivery</span>
          </div>
          <div className="hero-stage__headline">
            <h1 className="hero-title">Direct Sourcing of Premium Chinese Agricultural Products</h1>
            <p className="hero-stage__lead">
              From Farms to Global Markets with Export, Customs, and Cold Chain Support
            </p>
            <p className="hero-stage__body">
              Review buyer-ready product lines, supplier programs, and export routes before opening a quotation or sample discussion.
            </p>
          </div>
          <div className="hero-stage__actions button-row">
            <Link className="button" href="/products">
              Explore export portfolio
            </Link>
            <Link className="button button--ghost" href="/rfq">
              Start buyer inquiry
            </Link>
          </div>
          <div className="hero-stage__proof">
            {credibilitySignals.map((item) => (
              <article className="hero-stage__proof-item" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>

        <aside className="hero-stage__aside">
          <article className="hero-stage__panel hero-stage__panel--primary">
            <span className="pill">Buyer quick brief</span>
            <h2>What a buyer should be able to confirm before sending an inquiry.</h2>
            <p>
              This section is meant to answer the first practical questions: what can be sourced, how it can move, and what information you should send to get a usable commercial reply.
            </p>
            <div className="hero-stage__ledger">
              {tradeCapabilities.map((item) => (
                <article key={item.title}>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </article>
          <article className="hero-stage__panel">
            <span className="pill">Best fit buyers</span>
            <div className="hero-stage__markets">
              {marketLanes.map((lane) => (
                <article className="hero-stage__market" key={lane.title}>
                  <strong>{lane.title}</strong>
                  <p>{lane.description}</p>
                </article>
              ))}
            </div>
          </article>
        </aside>
      </section>

      <section className="credibility-strip" data-rise="true">
        {platformStandards.map((item) => (
          <article className="credibility-strip__item" key={item.title}>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
          </article>
        ))}
      </section>

      <section className="section-block section-block--portfolio" data-rise="true">
        <div className="portfolio-head">
          <span className="section-kicker">Featured programs</span>
          <div>
            <h2 className="section-title">Current supply lines presented for importers, distributors, and institutional buyers.</h2>
            <p className="section-description">
              Each card signals product family, supplier origin, and the right commercial route before a buyer opens the full export profile.
            </p>
          </div>
          <Link className="button button--ghost" href="/products">
            Browse all categories
          </Link>
        </div>
        <div className="product-grid">
          {homeData.featuredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="editorial-panel editorial-panel--statement" data-rise="true">
        <div className="editorial-panel__copy">
          <span className="section-kicker">Operating model</span>
          <h2 className="section-title">How farmetra turns agricultural sourcing into a structured cross-border sales workflow.</h2>
          <p>
            Product discovery, supplier qualification, export documentation, cold-chain planning, and buyer follow-up are presented as one operating system. That lets global buyers judge commercial readiness before they open a sampling or pricing discussion.
          </p>
          <div className="button-row">
            <Link className="button button--soft" href="/about">
              Review platform approach
            </Link>
            <Link className="button button--ghost" href="/rfq">
              Open buyer discussion
            </Link>
          </div>
        </div>
        <div className="statement-rail">
            <article>
            <span className="pill">Platform coverage</span>
            <h3>{shellData.activeCategoryCount} formal product families</h3>
            <p>The portfolio is grouped the way importers, delegations, and retail sourcing teams actually review agricultural supply.</p>
            </article>
            <article>
            <span className="pill">Supplier readiness</span>
            <h3>{shellData.approvedSupplierCount} vetted programs</h3>
            <p>Supplier representation is curated to signal commercial discipline, not to inflate the catalog with undifferentiated listings.</p>
            </article>
            <article>
            <span className="pill">Buyer workflow</span>
            <h3>One inquiry desk</h3>
            <p>Market, quantity, certification, packaging, and delivery requirements remain attached to the same conversation from first brief to follow-up.</p>
            </article>
          </div>
      </section>

      <section className="section-block" id="trade-process" data-rise="true">
        <div className="section-head">
          <span className="section-kicker">Trade process</span>
          <h2 className="section-title">The buyer journey is designed to keep qualification, pricing, and execution moving without restarting the conversation.</h2>
        </div>
        <div className="process-rail">
          {workflow.map((item) => (
            <article className="process-rail__item" key={item.step}>
              <span className="process-index">{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block section-block--categories" data-rise="true">
        <div className="section-head">
          <span className="section-kicker">Category focus</span>
          <h2 className="section-title">Navigate disciplined product families, not miscellaneous listing clusters.</h2>
        </div>
        <div className="category-board">
          {homeData.featuredCategories.map((category, index) => (
            <article className="category-board__row" key={category.slug}>
              <span className="category-board__index">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <span className="catalog-chip">{category.familyLabel}</span>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </div>
              <Link className="product-card__link" href={`/products?category=${category.slug}`}>
                Browse this family
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="closing-banner" data-rise="true">
        <div>
          <span className="section-kicker">Next move</span>
          <h2 className="section-title">Need a quotation, sample plan, or market-entry discussion? Start with the buyer desk.</h2>
        </div>
        <div className="button-row">
          <Link className="button" href="/rfq">
            Start buyer inquiry
          </Link>
          <Link className="button button--earth" href="/products">
            Review portfolio first
          </Link>
        </div>
      </section>
    </main>
  );
}
