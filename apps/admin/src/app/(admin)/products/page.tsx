import { getAdminProductsPageData } from '../../../lib/admin-data';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const products = await getAdminProductsPageData();

  return (
    <section className="page-stack">
      <div className="page-hero">
        <span className="eyebrow">Products</span>
        <h1 className="hero-title">商品管理</h1>
        <p className="muted">后台从同一列表里同时看商品状态、供应商归属、分类位置、价格锚点和 SKU 复杂度。</p>
      </div>
      <section className="section-panel">
        <div className="data-list">
          {products.map((item) => (
            <article className="data-row" key={`${item.name}-${item.updatedAt}`}>
              <div className="data-row__main">
                <strong>{item.name}</strong>
                <p>{item.categoryName} · {item.supplierName}</p>
                <span>{item.tradeMode} · {item.variantCount} variants · {item.priceLabel}</span>
              </div>
              <div className="data-row__aside">
                <span className={`status-chip status-chip--${item.statusTone}`}>{item.status}</span>
                <span>updated {item.updatedAt}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
