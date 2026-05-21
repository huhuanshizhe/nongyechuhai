import clsx from 'clsx';
import type { StorefrontProductCard } from '../lib/storefront';
import { Link } from '../i18n/routing';

type ProductCardProps = {
  product: StorefrontProductCard;
  locale?: string;
};

export function ProductCard({ product, locale }: ProductCardProps) {
  return (
    <article className="product-card">
      <div className="product-card__media">
        <img alt={product.primaryImageAlt} src={product.primaryImageUrl} />
      </div>
      <div className="product-card__body">
        <div className="product-card__eyebrow">
          <span className="product-card__category">{product.categoryName}</span>
          <span className={clsx('product-card__mode', product.tradeModeTone === 'purchase' ? 'product-card__mode--purchase' : 'product-card__mode--inquiry')}>
            {product.tradeModeLabel}
          </span>
        </div>
        <div className="product-card__headline">
          <h3>{product.name}</h3>
          <p>{product.summary}</p>
        </div>
        <div className="product-card__meta">
          <span>{product.supplierName}</span>
          <span>{product.supplierLocation}</span>
          {product.model ? <span>{product.model}</span> : null}
        </div>
        <div className="product-card__specs">
          {product.specHighlights.slice(0, 2).map((item) => (
            <span key={item.label}>
              <strong>{item.label}</strong>
              <em>{item.value}</em>
            </span>
          ))}
        </div>
        <div className="product-card__footer">
          <span className="product-card__price">{product.priceLabel}</span>
          <Link className="product-card__link" href={`/products/${product.slug}`}>
          {locale === 'zh' ? '查看出口档案' : 'View export profile'}
        </Link>
        </div>
      </div>
    </article>
  );
}