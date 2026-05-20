import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '../../../components/JsonLd';
import { ProductCard } from '../../../components/ProductCard';
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildProductJsonLd
} from '../../../lib/structured-data';
import { getProductDetail } from '../../../lib/storefront';

type ProductDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const revalidate = 300;

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getProductDetail(slug);

  if (!detail) {
    return {
      title: 'Product not found'
    };
  }

  return {
    title: detail.product.seoTitle || detail.product.name,
    description: detail.product.seoDescription || detail.product.summary
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const detail = await getProductDetail(slug);

  if (!detail) {
    notFound();
  }

  const { product, relatedProducts } = detail;
  const primaryActionLabel = product.tradeModeTone === 'purchase' ? 'Open order discussion' : 'Request quotation';

  return (
    <main className="page-shell page-shell--detail">
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Export Portfolio', path: '/products' },
            { name: product.name, path: `/products/${product.slug}` }
          ]),
          buildProductJsonLd(product),
          buildFaqJsonLd(product.faqItems)
        ]}
      />

      <section className="detail-stage" data-rise="true">
        <div className="detail-stage__media">
          <div className="breadcrumb-row">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/products">Portfolio</Link>
            <span>/</span>
            <span>{product.name}</span>
          </div>

          <div className="detail-stage__hero">
            <img alt={product.primaryImageAlt} src={product.primaryImageUrl} />
          </div>

          {product.gallery.length > 0 ? (
            <div className="detail-stage__gallery">
              {product.gallery.map((image, index) => (
                <article className="detail-stage__thumb" key={image.url}>
                  <div className="detail-stage__thumb-media">
                    <span className="detail-stage__thumb-index">{String(index + 1).padStart(2, '0')}</span>
                    <img alt={image.alt} src={image.url} />
                  </div>
                  <span className="detail-stage__thumb-caption">{image.alt}</span>
                </article>
              ))}
            </div>
          ) : null}
        </div>

        <aside className="detail-stage__summary">
          <span className={`mode-badge ${product.tradeModeTone === 'purchase' ? 'mode-badge--purchase' : 'mode-badge--inquiry'}`}>
            {product.tradeModeLabel}
          </span>

          <div className="stack">
            <h1 className="detail-title">{product.name}</h1>
            <p className="detail-description">{product.summary}</p>
          </div>

          <div className="detail-stage__chips">
            <span className="catalog-chip">{product.categoryName}</span>
            <span className="catalog-chip">{product.supplierName}</span>
            <span className="catalog-chip">{product.supplierLocation}</span>
            {product.supplierVerified ? <span className="catalog-chip">Verified supplier program</span> : null}
            {product.model ? <span className="catalog-chip">Model {product.model}</span> : null}
          </div>

          <div className="detail-stage__pricebox">
            <div>
              <span className="detail-stage__price-label">Commercial route</span>
              <p className="detail-price">{product.priceLabel}</p>
            </div>
            <p className="detail-aux">{product.tradeModeDescription}</p>
            <div className="detail-action-row">
              <Link className="button" href={`/rfq?product=${product.slug}`}>
                {primaryActionLabel}
              </Link>
              <Link className="button button--ghost" href="/products">
                Back to portfolio
              </Link>
            </div>
          </div>

          <div className="detail-stage__briefs">
            <article className="detail-stage__brief">
              <h2>Supplier snapshot</h2>
              <p>
                {product.supplierDescription ||
                  `${product.supplierName} is presented from ${product.supplierLocation} with this line prepared for export qualification and buyer review.`}
              </p>
            </article>
            <article className="detail-stage__brief">
              <h2>Execution note</h2>
              <p>{product.tradeModeDescription}</p>
            </article>
            <article className="detail-stage__brief">
              <h2>Specification depth</h2>
              <p>{product.specHighlights.length} specification highlights and {product.variants.length} published variant line{product.variants.length === 1 ? '' : 's'} are visible for this product.</p>
            </article>
          </div>
        </aside>
      </section>

      <section className="detail-story-grid" data-rise="true">
        <article className="section-block detail-story-panel">
          <div className="section-head">
            <span className="section-kicker">Product briefing</span>
            <h2 className="section-title">Key product and trade notes before opening commercial discussion.</h2>
          </div>
          <div className="rich-copy detail-rich-copy" dangerouslySetInnerHTML={{ __html: product.richDescriptionHtml }} />
        </article>

        <aside className="section-block detail-qualification-panel">
          <div className="section-head">
            <span className="section-kicker">Qualification panel</span>
            <h2 className="section-title">A fast review view for buyers, delegations, and sourcing teams.</h2>
          </div>

          <div className="detail-spec-grid detail-spec-grid--formal">
            {product.specHighlights.map((spec) => (
              <article className="detail-spec-card" key={spec.label}>
                <strong>{spec.label}</strong>
                <span>{spec.value}</span>
              </article>
            ))}
          </div>

          {product.variants.length > 0 ? (
            <div className="stack">
              <span className="section-kicker">Available variants</span>
              <ul className="detail-variant-list detail-variant-list--formal">
                {product.variants.map((variant) => (
                  <li className="detail-spec-card" key={variant.sku}>
                    <strong>{variant.title}</strong>
                    <span>{variant.priceLabel}</span>
                    <span>{variant.stockLabel}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </section>

      {product.faqItems.length > 0 ? (
        <section className="section-block detail-faq-panel" data-rise="true">
          <div className="section-head">
            <span className="section-kicker">Buyer FAQ</span>
            <h2 className="section-title">Questions import teams often raise at this stage.</h2>
          </div>

          <div className="faq-ledger">
            {product.faqItems.map((faq, index) => (
              <article className="faq-ledger__item" key={faq.question}>
                <span className="faq-ledger__index">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <strong>{faq.question}</strong>
                  <p>{faq.answer}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {relatedProducts.length > 0 ? (
        <section className="section-block" data-rise="true">
          <div className="section-head">
            <span className="section-kicker">Related portfolio lines</span>
            <h2 className="section-title">More products shown within the same export family.</h2>
          </div>

          <div className="product-grid product-grid--catalog">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.slug} product={relatedProduct} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
