import { redirect } from 'next/navigation';
import { auth } from '../../../auth';
import {
  getSupplierProductsPageData,
  getSupplierWorkspace
} from '../../../lib/supplier-data';

export const dynamic = 'force-dynamic';

export default async function SupplierProductsPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!session?.user || !userId) {
    redirect('/login');
  }

  const workspace = await getSupplierWorkspace(userId);

  if (!workspace) {
    redirect('/login');
  }

  const data = await getSupplierProductsPageData(workspace.id);

  return (
    <section className="page-stack">
      <div className="page-hero">
        <span className="eyebrow">Products</span>
        <h1 className="hero-title">供应商看的是自己的商品产能，而不是后台全量噪音。</h1>
        <p className="muted">当前工作台已经按当前登录供应商自动过滤，只显示与你组织相关的商品线。</p>
      </div>

      <div className="summary-grid">
        <article className="highlight-card">
          <span>已发布</span>
          <strong>{data.summary.publishedCount}</strong>
        </article>
        <article className="highlight-card">
          <span>待处理</span>
          <strong>{data.summary.pendingCount}</strong>
        </article>
        <article className="highlight-card">
          <span>总商品数</span>
          <strong>{data.summary.totalCount}</strong>
        </article>
      </div>

      <section className="section-panel">
        <div className="data-list">
          {data.products.map((item) => (
            <article className="data-row" key={`${item.name}-${item.updatedAt}`}>
              <div className="data-row__main">
                <strong>{item.name}</strong>
                <p>{item.categoryName}</p>
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
