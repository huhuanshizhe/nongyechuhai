import { setRequestLocale } from 'next-intl/server';
import { Link } from '../../../../i18n/routing';
import { getProductDetail } from '../../../../lib/storefront';
import { auth } from '../../../../auth';
import type { Metadata } from 'next';

type ProductDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const product = await getProductDetail(slug);
  const isZh = locale === 'zh';

  return {
    title: product?.product.seoTitle || product?.product.name || (isZh ? '产品详情' : 'Product Details'),
    description: product?.product.seoDescription || product?.product.summary || (isZh ? '查看带有出口信息的产品详情。' : 'View product details with export information.')
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const isZh = locale === 'zh';
  const session = await auth();

  const productDetail = await getProductDetail(slug);

  if (!productDetail) {
    return (
      <main className="page-shell">
        <section className="section-block" data-rise="true">
          <div className="not-found-card">
            <span className="section-kicker">{isZh ? 'Product not found' : 'Product not found'}</span>
            <h3>{isZh ? 'This product does not exist or has been removed.' : 'This product does not exist or has been removed.'}</h3>
            <p>{isZh ? 'Please browse other products in the portfolio.' : 'Please browse other products in the portfolio.'}</p>
            <div className="button-row">
              <Link className="button" href="/products">
                {isZh ? 'Back to portfolio' : 'Back to portfolio'}
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const { product, relatedProducts } = productDetail;

  return (
    <main className="page-shell page-shell--product">
      <section className="product-detail" data-rise="true">
        <div className="product-detail__nav">
          <Link className="button button--ghost" href="/products">
            {isZh ? 'Back to portfolio' : 'Back to portfolio'}
          </Link>
          {session?.user && (
            <Link className="button button--ghost" href="/account">
              {isZh ? 'My workspace' : 'My workspace'}
            </Link>
          )}
        </div>

        <article className="product-detail__main">
          <div className="product-detail__gallery">
            <div className="product-detail__hero-media">
              <img alt={product.primaryImageAlt} src={product.primaryImageUrl} />
            </div>
            {product.gallery.length > 1 ? (
              <div className="product-detail__gallery-strip">
                {product.gallery.slice(1, 4).map((image) => (
                  <div key={image.url} className="product-detail__gallery-thumb">
                    <img alt={image.alt} src={image.url} />
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="product-detail__content">
            <div className="product-detail__eyebrow">
              <span className="product-detail__category">{product.categoryName}</span>
              <span className="product-detail__mode">{product.tradeModeLabel}</span>
            </div>

            <div className="product-detail__headline">
              <h1>{product.name}</h1>
              <p className="product-detail__summary">{product.summary}</p>
            </div>

            <div className="product-detail__supplier">
              <span className="pill">{isZh ? 'Supplier information' : 'Supplier information'}</span>
              <h3>{product.supplierName}</h3>
              <p>{product.supplierLocation}</p>
              {product.supplierVerified && (
                <span className="catalog-chip">{isZh ? 'Verified supplier' : 'Verified supplier'}</span>
              )}
            </div>

            <div className="product-detail__price">
              <span className="product-detail__price-label">{product.priceLabel}</span>
              {product.model && <span className="product-detail__model">{product.model}</span>}
            </div>

            {product.variants && product.variants.length > 0 && (
              <div className="product-detail__variants">
                <span className="pill">{isZh ? 'Available variants' : 'Available variants'}</span>
                <div className="variant-list">
                  {product.variants.slice(0, 3).map((variant) => (
                    <div key={variant.sku} className="variant-item">
                      <strong>{variant.title}</strong>
                      <span>{variant.priceLabel}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="product-detail__actions button-row">
              <Link className="button" href={`/rfq?product=${slug}`}>
                {isZh ? 'Request quote' : 'Request quote'}
              </Link>
              {session?.user && (
                <Link className="button button--ghost" href={`/rfq?product=${slug}`}>
                  {isZh ? 'Add to existing inquiry' : 'Add to existing inquiry'}
                </Link>
              )}
            </div>
          </div>
        </article>

        <section className="product-detail__specs">
          <div className="section-head">
            <h2>{isZh ? 'Product specifications' : 'Product specifications'}</h2>
          </div>
          <div className="spec-grid">
            {product.specHighlights.map((spec) => (
              <div key={spec.label} className="spec-item">
                <strong>{spec.label}</strong>
                <em>{spec.value}</em>
              </div>
            ))}
          </div>
          <div className="product-detail__description">
            <h3>{isZh ? 'Detailed description' : 'Detailed description'}</h3>
            <div dangerouslySetInnerHTML={{ __html: product.richDescriptionHtml }} />
          </div>
        </section>

        {product.faqItems && product.faqItems.length > 0 && (
          <section className="product-detail__faq">
            <div className="section-head">
              <h2>{isZh ? 'Frequently asked questions' : 'Frequently asked questions'}</h2>
            </div>
            <div className="faq-list">
              {product.faqItems.map((faq) => (
                <article className="faq-item" key={faq.question}>
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {relatedProducts.length > 0 ? (
          <section className="product-detail__related">
            <div className="section-head">
              <span className="section-kicker">{isZh ? 'Related products' : 'Related products'}</span>
              <h2>{isZh ? 'Other products in this category' : 'Other products in this category'}</h2>
            </div>
            <div className="product-grid">
              {relatedProducts.slice(0, 3).map((relatedProduct) => (
                <article className="product-card" key={relatedProduct.slug}>
                  <div className="product-card__media">
                    <img alt={relatedProduct.primaryImageAlt} src={relatedProduct.primaryImageUrl} />
                  </div>
                  <div className="product-card__body">
                    <span className="product-card__category">{relatedProduct.categoryName}</span>
                    <h3>{relatedProduct.name}</h3>
                    <Link className="product-card__link" href={`/products/${relatedProduct.slug}`}>
                      {isZh ? 'View details' : 'View details'}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section className="closing-banner" data-rise="true">
          <div>
            <span className="section-kicker">{isZh ? 'Next move' : 'Next move'}</span>
            <h2 className="section-title">{isZh ? 'Ready to request a quote?' : 'Ready to request a quote for this product?'}</h2>
          </div>
          <div className="button-row">
            <Link className="button" href={`/rfq?product=${slug}`}>
              {isZh ? 'Start inquiry' : 'Start inquiry'}
            </Link>
            <Link className="button button--ghost" href="/products">
              {isZh ? 'Continue browsing' : 'Continue browsing'}
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}