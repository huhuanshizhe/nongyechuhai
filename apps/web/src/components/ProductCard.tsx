import Link from 'next/link';
import clsx from 'clsx';
import type { StorefrontProductCard } from '../lib/storefront';

type ProductCardProps = {
  product: StorefrontProductCard;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="product-card">
      <div className="product-card__media">
        <img alt={product.primaryImageAlt} src={product.primaryImageUrl} />
      </div>
      <div className="product-card__body">
        <div className="product-card__eyebrow">
          <span className={clsx('mode-badge', product.tradeModeTone === 'purchase' ? 'mode-badge--purchase' : 'mode-badge--inquiry')}>
            {product.tradeModeLabel}
          </span>
          <span className="catalog-chip">{product.categoryName}</span>
        </div>
        <div className="product-card__headline">
          <h3>{product.name}</h3>
          <p>{product.summary}</p>
        </div>
        <div className="product-card__meta">
          <span>{product.supplierName}</span>
          <span>{product.supplierLocation}</span>
          {product.model ? <span>Model {product.model}</span> : null}
        </div>
        <div className="product-card__meta">
          {product.specHighlights.slice(0, 2).map((item) => (
            <span className="catalog-chip" key={item.label}>
              {item.label}: {item.value}
            </span>
          ))}
        </div>
        <div className="product-card__footer">
          <span className="product-card__price">{product.priceLabel}</span>
          <Link className="product-card__link" href={`/products/${product.slug}`}>
            View export profile
          </Link>
        </div>
      </div>
    </article>
  );
}