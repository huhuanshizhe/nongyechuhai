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

  return (
    <main className="page-shell">
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Products', path: '/products' },
            { name: product.name, path: `/products/${product.slug}` }
          ]),
          buildProductJsonLd(product),
          buildFaqJsonLd(product.faqItems)
        ]}
      />
      <section className="detail-hero" data-rise="true">
        <div className="detail-gallery">
          <div className="detail-gallery__hero">
            <img alt={product.primaryImageAlt} src={product.primaryImageUrl} />
          </div>
          <div className="thumbnail-grid">
            {product.gallery.map((image) => (
              <article className="thumbnail-card" key={image.url}>
                <div className="product-card__media">
                  <img alt={image.alt} src={image.url} />
                </div>
                <span className="thumbnail-card__caption">{image.alt}</span>
              </article>
            ))}
          </div>
        </div>

        <aside className="detail-panel">
          <span className={`mode-badge ${product.tradeModeTone === 'purchase' ? 'mode-badge--purchase' : 'mode-badge--inquiry'}`}>
            {product.tradeModeLabel}
          </span>
          <div className="stack">
            <h1 className="detail-title">{product.name}</h1>
            <p className="detail-description">{product.summary}</p>
          </div>
          <div className="detail-meta">
            <span className="catalog-chip">{product.categoryName}</span>
            <span className="catalog-chip">{product.supplierName}</span>
            <span className="catalog-chip">{product.supplierLocation}</span>
            {product.model ? <span className="catalog-chip">Model {product.model}</span> : null}
          </div>
          <p className="detail-price">{product.priceLabel}</p>
          <p className="detail-aux">{product.tradeModeDescription}</p>
          <div className="detail-action-row">
            <Link className="button" href={`/rfq?product=${product.slug}`}>
              Send RFQ for this product
            </Link>
            <Link className="button button--ghost" href="/products">
              Back to catalog
            </Link>
          </div>
          <div className="detail-highlights">
            <article className="detail-mini-card">
              <h3>Commercial path</h3>
              <p>{product.tradeModeDescription}</p>
            </article>
            <article className="detail-mini-card">
              <h3>Supplier context</h3>
              <p>{product.supplierName} operates from {product.supplierLocation} and is already visible in the supplier workflow.</p>
            </article>
          </div>
        </aside>
      </section>

      <section className="detail-section-grid" data-rise="true">
        <article className="section-block">
          <div className="section-head">
            <span className="section-kicker">Commercial overview</span>
            <h2 className="section-title">What a buyer needs to know before opening negotiation.</h2>
          </div>
          <div className="rich-copy detail-rich-copy" dangerouslySetInnerHTML={{ __html: product.richDescriptionHtml }} />
        </article>
        <aside className="section-block">
          <div className="section-head">
            <span className="section-kicker">Spec highlights</span>
            <h2 className="section-title">Quick qualification panel</h2>
          </div>
          <div className="detail-spec-grid">
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
              <ul className="detail-variant-list">
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

      <section className="section-block" data-rise="true">
        <div className="breadcrumb-row">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/products">Products</Link>
          <span>/</span>
          <span>{product.name}</span>
        </div>
        <div className="section-head">
          <span className="section-kicker">Buyer FAQ</span>
          <h2 className="section-title">Questions a procurement team typically raises at this stage.</h2>
        </div>
        <ul className="detail-faq">
          {product.faqItems.map((faq) => (
            <li className="detail-spec-card" key={faq.question}>
              <strong>{faq.question}</strong>
              <span>{faq.answer}</span>
            </li>
          ))}
        </ul>
      </section>

      {relatedProducts.length > 0 ? (
        <section className="section-block" data-rise="true">
          <div className="section-head">
            <span className="section-kicker">Related sourcing lane</span>
            <h2 className="section-title">More products in the same procurement family.</h2>
          </div>
          <div className="product-grid">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.slug} product={relatedProduct} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
