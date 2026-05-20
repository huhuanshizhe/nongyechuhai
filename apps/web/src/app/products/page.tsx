import type { Metadata } from 'next';
import Link from 'next/link';
import { ProductCard } from '../../components/ProductCard';
import { getCatalogPageData } from '../../lib/storefront';

type ProductsPageProps = {
  searchParams: Promise<{
    category?: string;
    mode?: string;
  }>;
};

export const metadata: Metadata = {
  title: 'Export Portfolio',
  description: 'Browse the formal export portfolio by category, commercial route, and supplier origin.'
};

export const revalidate = 300;

function buildCatalogHref(category?: string, mode?: string) {
  const params = new URLSearchParams();

  if (category) {
    params.set('category', category);
  }

  if (mode) {
    params.set('mode', mode);
  }

  const query = params.toString();
  return query ? `/products?${query}` : '/products';
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const mode = resolvedSearchParams.mode === 'direct' || resolvedSearchParams.mode === 'inquiry'
    ? resolvedSearchParams.mode
    : undefined;
  const data = await getCatalogPageData({
    category: resolvedSearchParams.category,
    mode
  });
  const activeRouteSummary = data.activeMode === 'direct'
    ? 'The current view is focused on lines already presented with reference pricing and order-ready commercial packs.'
    : data.activeMode === 'inquiry'
      ? 'The current view is focused on lines that should begin through qualification, market alignment, and buyer briefing.'
      : 'The current view combines inquiry-led and direct-order programs so buyers can compare category fit before narrowing by route.';

  return (
    <main className="page-shell page-shell--catalog">
      <section className="portfolio-stage" data-rise="true">
        <div className="portfolio-stage__intro">
          <span className="section-kicker">Export portfolio</span>
          <h1 className="section-title">A formal export portfolio organized by category and commercial route.</h1>
          <p className="catalog-intro">
            Use category and route filters to move from family overview to product export profile. Each listing signals whether it should begin as an inquiry discussion or a direct order review.
          </p>
          <div className="portfolio-stage__metrics">
            <article className="portfolio-stage__metric">
              <span>All published lines</span>
              <strong>{data.modeCounts.all}</strong>
            </article>
            <article className="portfolio-stage__metric">
              <span>Inquiry programs</span>
              <strong>{data.modeCounts.inquiry}</strong>
            </article>
            <article className="portfolio-stage__metric">
              <span>Direct order programs</span>
              <strong>{data.modeCounts.direct}</strong>
            </article>
          </div>
        </div>
        <aside className="portfolio-stage__filters">
          <div className="portfolio-stage__panel">
            <span className="pill">Commercial route</span>
            <div className="filter-pills">
              <Link className={`filter-pill ${!data.activeMode ? 'filter-pill--active' : ''}`} href={buildCatalogHref(data.activeCategory?.slug)}>
                All routes ({data.modeCounts.all})
              </Link>
              <Link className={`filter-pill ${data.activeMode === 'inquiry' ? 'filter-pill--active' : ''}`} href={buildCatalogHref(data.activeCategory?.slug, 'inquiry')}>
                Inquiry programs ({data.modeCounts.inquiry})
              </Link>
              <Link className={`filter-pill ${data.activeMode === 'direct' ? 'filter-pill--active' : ''}`} href={buildCatalogHref(data.activeCategory?.slug, 'direct')}>
                Direct order programs ({data.modeCounts.direct})
              </Link>
            </div>
          </div>
          <div className="portfolio-stage__panel">
            <span className="pill">Current view</span>
            <h2>{data.activeCategory ? `${data.activeCategory.name} portfolio` : 'Published export portfolio'}</h2>
            <p>{activeRouteSummary}</p>
          </div>
        </aside>
      </section>

      <section className="portfolio-layout" data-rise="true">
        <aside className="portfolio-rail">
          <div className="portfolio-rail__panel">
            <span className="section-kicker">Category ledger</span>
            <div className="portfolio-category-list">
              <Link className={`portfolio-category-list__item ${!data.activeCategory ? 'portfolio-category-list__item--active' : ''}`} href={buildCatalogHref(undefined, data.activeMode ?? undefined)}>
                <span>00</span>
                <strong>All categories</strong>
              </Link>
              {data.categories.map((category, index) => (
                <Link
                  className={`portfolio-category-list__item ${data.activeCategory?.slug === category.slug ? 'portfolio-category-list__item--active' : ''}`}
                  href={buildCatalogHref(category.slug, data.activeMode ?? undefined)}
                  key={category.slug}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{category.name}</strong>
                </Link>
              ))}
            </div>
          </div>
          <div className="portfolio-rail__panel">
            <span className="section-kicker">Portfolio note</span>
            <strong>
              {data.activeCategory
                ? `${data.activeCategory.name} export lane`
                : 'Portfolio overview'}
            </strong>
            <p>
              {data.activeCategory?.description ||
                'Start broad, then narrow into the product family that matches your target market, pack format, and commercial route.'}
            </p>
          </div>
          {data.supplierPrograms.length > 0 ? (
            <div className="portfolio-rail__panel">
              <span className="section-kicker">Representative supplier programs</span>
              <strong>
                {data.activeCategory
                  ? `Vetted programs in ${data.activeCategory.name}`
                  : 'Vetted programs in the current portfolio view'}
              </strong>
              <div className="stack">
                {data.supplierPrograms.map((supplier) => (
                  <article className="stack" key={`${supplier.name}-${supplier.location}`}>
                    <div>
                      <strong>{supplier.name}</strong>
                    </div>
                    <div className="button-row">
                      <span className="catalog-chip">{supplier.location}</span>
                      <span className="catalog-chip">{supplier.lineCount} published line{supplier.lineCount === 1 ? '' : 's'}</span>
                      {supplier.isVerified ? <span className="catalog-chip">Verified program</span> : null}
                    </div>
                    <p>{supplier.description}</p>
                  </article>
                ))}
              </div>
            </div>
          ) : null}
          <div className="portfolio-rail__panel">
            <span className="section-kicker">What this view optimizes</span>
            <ul className="clean">
              <li>Clear origin and category context before the buyer opens detail.</li>
              <li>Explicit distinction between inquiry-led and direct-order lines.</li>
              <li>Fast routing from portfolio review into structured buyer inquiry.</li>
            </ul>
          </div>
        </aside>

        <div className="portfolio-results">
          <div className="portfolio-results__head">
            <div className="page-head">
              <span className="section-kicker">{data.products.length} result{data.products.length === 1 ? '' : 's'}</span>
              <h2 className="section-title">
                {data.activeCategory ? `${data.activeCategory.name} portfolio` : 'Published export portfolio'}
              </h2>
              <p className="catalog-intro">
              {data.activeMode === 'direct'
                ? 'These lines already include reference pricing and standard commercial packs for direct order review.'
                : data.activeMode === 'inquiry'
                  ? 'These lines are better opened through the inquiry desk so destination market, specification, and documentation can be aligned first.'
                  : 'Choose the route that best matches how far your buying brief is already defined.'}
              </p>
            </div>
            <Link className="button button--ghost" href="/rfq">
              Open inquiry desk
            </Link>
          </div>
          {data.products.length > 0 ? (
            <div className="product-grid product-grid--catalog">
              {data.products.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          ) : (
            <div className="not-found-card">
              <span className="section-kicker">No match yet</span>
              <h3>There are no published products for this filter combination.</h3>
              <p>Try widening the category or switching back to all commercial routes.</p>
              <div className="button-row">
                <Link className="button" href="/products">
                  Reset filters
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
