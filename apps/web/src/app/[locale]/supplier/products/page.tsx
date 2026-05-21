import { setRequestLocale } from 'next-intl/server';
import { Link } from '../../../../i18n/routing';
import { getSupplierProducts } from '../actions';
import type { ProductStatus } from '@prisma/client';

type SupplierProductsProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ status?: string }>;
};

export default async function SupplierProductsPage({ params, searchParams }: SupplierProductsProps) {
  const { locale } = await params;
  const { status } = await searchParams;
  setRequestLocale(locale);
  const isZh = locale === 'zh';

  const products = await getSupplierProducts(status as ProductStatus | undefined);

  const statusFilters: ProductStatus[] = ['DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'PUBLISHED', 'OFFLINE'];

  const statusCounts = await Promise.all(
    statusFilters.map(async (s) => ({
      status: s,
      count: products.filter(p => p.status === s).length
    }))
  );

  return (
    <section className="section-block">
      <div className="shell">
        <span className="section-kicker">{isZh ? '产品管理' : 'Product management'}</span>
        <h1>{isZh ? '我的产品' : 'My products'}</h1>

        <div className="filter-bar">
          <div className="filter-tabs">
            {statusCounts.map(({ status: s, count }) => (
              <Link
                key={s}
                href={`/supplier/products?status=${s}`}
                className={`filter-tab ${status === s ? 'filter-tab--active' : ''}`}
              >
                {isZh ? statusZh(s) : s}
                <span className="filter-tab__count">{count}</span>
              </Link>
            ))}
            <Link
              href="/supplier/products"
              className={`filter-tab ${!status ? 'filter-tab--active' : ''}`}
            >
              {isZh ? '全部' : 'All'}
              <span className="filter-tab__count">{products.length}</span>
            </Link>
          </div>
          <Link className="button" href="/supplier/products/new">{isZh ? '添加产品' : 'Add product'}</Link>
        </div>

        {products.length > 0 ? (
          <div className="product-table">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{isZh ? '产品名称' : 'Product name'}</th>
                  <th>{isZh ? '品类' : 'Category'}</th>
                  <th>{isZh ? '价格区间' : 'Price range'}</th>
                  <th>{isZh ? '状态' : 'Status'}</th>
                  <th>{isZh ? '操作' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>
                      <div className="product-cell">
                        {product.images?.[0]?.url && (
                          <img src={product.images[0].url} alt={product.name} className="product-cell__image" />
                        )}
                        <span className="product-cell__name">{product.name}</span>
                      </div>
                    </td>
                    <td>{product.category?.name ?? (isZh ? '未分类' : 'Uncategorized')}</td>
                    <td>
                      {product.priceMin && product.priceMax
                        ? `${product.currency} ${product.priceMin} - ${product.priceMax}`
                        : product.priceMin
                          ? `${product.currency} ${product.priceMin}+`
                          : isZh ? '未设置' : 'Not set'}
                    </td>
                    <td>
                      <span className={`status-badge status-badge--${product.status.toLowerCase()}`}>
                        {isZh ? statusZh(product.status) : product.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Link className="button button--small" href={`/supplier/products/${product.id}`}>
                          {isZh ? '编辑' : 'Edit'}
                        </Link>
                        {product.status === 'DRAFT' && (
                          <Link className="button button--small button--primary" href={`/supplier/products/${product.id}?submit=true`}>
                            {isZh ? '提交审核' : 'Submit'}
                          </Link>
                        )}
                        {product.status === 'PUBLISHED' && (
                          <Link className="button button--small button--ghost" href={`/products/${product.slug}`}>
                            {isZh ? '查看' : 'View'}
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <p>{isZh ? '暂无产品，点击上方按钮添加新产品。' : 'No products yet. Click the button above to add a new product.'}</p>
          </div>
        )}
      </div>
    </section>
  );
}

function statusZh(status: ProductStatus): string {
  const map: Record<ProductStatus, string> = {
    DRAFT: '草稿',
    PENDING_REVIEW: '待审核',
    APPROVED: '已通过',
    REJECTED: '已拒绝',
    PUBLISHED: '已发布',
    OFFLINE: '已下架'
  };
  return map[status] ?? status;
}