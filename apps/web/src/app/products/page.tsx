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
  title: 'Product Catalog',
  description: 'Browse buyer-ready agriculture products by category, trade mode, and supplier readiness.'
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
          <span className="section-kicker">Catalog</span>
          <h1 className="section-title">A catalog that helps professional buyers compare commercial routes, not just product names.</h1>
          <p className="catalog-intro">
            Use category and trade-mode filters to narrow the supply lane before opening product detail. Every listing is aligned to either RFQ-led or direct-purchase commercial behavior.
          </p>
        </div>
        <div className="filter-pills">
          <Link className={`filter-pill ${!data.activeMode ? 'filter-pill--active' : ''}`} href={buildCatalogHref(data.activeCategory?.slug)}>
            All trade modes ({data.modeCounts.all})
          </Link>
          <Link className={`filter-pill ${data.activeMode === 'inquiry' ? 'filter-pill--active' : ''}`} href={buildCatalogHref(data.activeCategory?.slug, 'inquiry')}>
            Inquiry only ({data.modeCounts.inquiry})
          </Link>
          <Link className={`filter-pill ${data.activeMode === 'direct' ? 'filter-pill--active' : ''}`} href={buildCatalogHref(data.activeCategory?.slug, 'direct')}>
            Direct purchase ready ({data.modeCounts.direct})
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
            <span className="section-kicker">Buyer note</span>
            <strong>
              {data.activeCategory
                ? `${data.activeCategory.name} sourcing lane`
                : 'Catalog overview'}
            </strong>
            <p>
              {data.activeCategory?.description ||
                'Start broad, then narrow into the product family that matches your target specification, pack format, and trade mode.'}
            </p>
          </div>
          <div className="sidebar-panel">
            <span className="section-kicker">What this view optimizes</span>
            <ul className="clean">
              <li>Clear supplier and category context before the buyer opens detail.</li>
              <li>Explicit distinction between negotiation-led and payment-ready lines.</li>
              <li>Fast routing from catalog review into structured RFQ.</li>
            </ul>
          </div>
        </aside>

        <div className="catalog-results">
          <div className="page-head">
            <span className="section-kicker">{data.products.length} result{data.products.length === 1 ? '' : 's'}</span>
            <h2 className="section-title">
              {data.activeCategory ? `${data.activeCategory.name} catalog` : 'Published sourcing catalog'}
            </h2>
            <p className="catalog-intro">
              {data.activeMode === 'direct'
                ? 'These lines are already structured for direct purchase follow-through and future payment adapter flow.'
                : data.activeMode === 'inquiry'
                  ? 'These lines keep negotiation in the RFQ path, which is typically the right fit for specification-heavy sourcing.'
                  : 'Choose the trade mode that best matches the certainty of your pricing, packaging, and lead-time expectations.'}
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
              <p>Try widening the category or switching back to all trade modes.</p>
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
