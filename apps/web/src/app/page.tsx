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
  const exportSignals = [
    {
      label: 'Portfolio scope',
      value: `${shellData.activeCategoryCount} export families`,
      description: 'Structured around real category review rather than broad marketplace sprawl.'
    },
    {
      label: 'Supplier coverage',
      value: `${shellData.approvedSupplierCount} approved programs`,
      description: 'Presented with origin context, route clarity, and buyer-facing commercial framing.'
    },
    {
      label: 'Products online',
      value: `${shellData.publishedProductCount} current showcase lines`,
      description: 'Each profile is published with specification signals and a visible next step.'
    },
    {
      label: 'Inquiry handling',
      value: '48h response target',
      description: 'The desk is designed to preserve product, packaging, and market context from the first brief.'
    }
  ];

  return (
    <main className="page-shell page-shell--home">
      <section className="stage-panel" data-rise="true">
        <div className="stage-copy">
          <span className="section-kicker">China agricultural export showcase</span>
          <div className="stage-stack">
            <h1 className="hero-title">Direct Sourcing of Premium Chinese Agricultural Products</h1>
            <p>
              From Farms to Global Markets with Export, Customs, and Cold Chain Support
            </p>
          </div>
          <p className="stage-lead">
            Nongye Chuhai should read like a serious export presentation, not like a generic sourcing directory. The front page now positions origin, commercial route, and delivery capability as one coherent trade narrative.
          </p>
          <div className="stage-actions button-row">
            <Link className="button" href="/products">
              View export portfolio
            </Link>
            <Link className="button button--ghost" href="/rfq">
              Open inquiry desk
            </Link>
          </div>
          <div className="stage-route">
            <article>
              <span className="process-index">01</span>
              <h2>Category and origin first</h2>
              <p>Buyers begin with the right agricultural family and regional supply story before discussing a single SKU.</p>
            </article>
            <article>
              <span className="process-index">02</span>
              <h2>Commercial format next</h2>
              <p>The site makes it clear whether a line should start through inquiry, sampling, or direct order review.</p>
            </article>
            <article>
              <span className="process-index">03</span>
              <h2>Execution stays visible</h2>
              <p>Export documentation, cold chain, and buyer follow-up are presented as part of the offer, not as hidden back-office work.</p>
            </article>
          </div>
        </div>
        <aside className="stage-aside">
          <div className="stage-brief">
            <span className="pill">Delegation brief</span>
            <h2>Built for trade offices, sourcing teams, importers, and institutional buyers who need clarity fast.</h2>
            <p>
              The presentation emphasizes category coverage, supplier readiness, and commercial next steps in a format that can hold up in government demonstrations and serious buyer meetings.
            </p>
            <div className="stage-brief__meta">
              <strong>Current focus</strong>
              <span>Aquatic products, Yunnan fungi, Chinese tea, specialty vegetables, and halal prepared foods.</span>
            </div>
          </div>
          <div className="stage-board">
            <span className="pill">Showcase families</span>
            <div className="stage-board__rows">
              {homeData.featuredCategories.map((category) => (
                <article className="stage-board__row" key={category.slug}>
                  <div>
                    <strong>{category.name}</strong>
                    <p>{category.description}</p>
                  </div>
                  <Link href={`/products?category=${category.slug}`}>Review family</Link>
                </article>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section className="signal-band" data-rise="true">
        {exportSignals.map((item) => (
          <article className="signal-band__item" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <p>{item.description}</p>
          </article>
        ))}
      </section>

      <section className="section-block section-block--editorial" data-rise="true">
        <div className="section-head">
          <span className="section-kicker">Presentation logic</span>
          <h2 className="section-title">The design should help a buyer understand the program in one pass, not make them decode interface decoration.</h2>
          <p className="section-description">
            International agriculture discussions move faster when category structure, origin, pack format, and commercial route are obvious. The platform is organized around those decisions and removes the noise that usually makes sourcing sites look provisional.
          </p>
        </div>
        <div className="editorial-columns">
          {sourcingPrinciples.map((item) => (
            <article className="editorial-columns__item" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block section-block--portfolio" data-rise="true">
        <div className="portfolio-head">
          <span className="section-kicker">Featured products</span>
          <div>
            <h2 className="section-title">Key showcase lines currently presented to buyers and delegations.</h2>
            <p className="section-description">
            Each card surfaces the product family, supplier origin, and commercial route before the buyer opens the full export profile.
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
        <div className="statement-rail">
          <article>
            <span className="pill">Category architecture</span>
            <h3>{shellData.activeCategoryCount} export families</h3>
            <p>The portfolio is grouped the way institutional buyers and delegations actually review export categories.</p>
          </article>
          <article>
            <span className="pill">Supplier coverage</span>
            <h3>{shellData.approvedSupplierCount} approved programs</h3>
            <p>Supplier representation spans multiple origins, product families, and commercial formats without looking scattered.</p>
          </article>
          <article>
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
          <h2 className="section-title">Navigate formal product families, not miscellaneous listing clusters.</h2>
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
