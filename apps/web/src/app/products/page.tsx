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

  return (
    <main className="page-shell">
      <section className="section-block" data-rise="true">
        <div className="page-head">
          <span className="section-kicker">Export portfolio</span>
          <h1 className="section-title">A formal export portfolio organized by category and commercial route.</h1>
          <p className="catalog-intro">
            Use category and route filters to move from family overview to product export profile. Each listing signals whether it should begin as an inquiry discussion or a direct order review.
          </p>
        </div>
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
      </section>

      <section className="catalog-shell" data-rise="true">
        <aside className="catalog-sidebar">
          <div className="sidebar-panel">
            <span className="section-kicker">Categories</span>
            <div className="filter-group">
              <Link className={`filter-pill ${!data.activeCategory ? 'filter-pill--active' : ''}`} href={buildCatalogHref(undefined, data.activeMode ?? undefined)}>
                All categories
              </Link>
              {data.categories.map((category) => (
                <Link
                  className={`filter-pill ${data.activeCategory?.slug === category.slug ? 'filter-pill--active' : ''}`}
                  href={buildCatalogHref(category.slug, data.activeMode ?? undefined)}
                  key={category.slug}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="sidebar-panel">
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
          <div className="sidebar-panel">
            <span className="section-kicker">What this view optimizes</span>
            <ul className="clean">
              <li>Clear origin and category context before the buyer opens detail.</li>
              <li>Explicit distinction between inquiry-led and direct-order lines.</li>
              <li>Fast routing from portfolio review into structured buyer inquiry.</li>
            </ul>
          </div>
        </aside>

        <div className="catalog-results">
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
          {data.products.length > 0 ? (
            <div className="product-grid">
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
