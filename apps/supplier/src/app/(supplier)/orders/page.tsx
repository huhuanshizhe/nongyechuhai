import { redirect } from 'next/navigation';
import { auth } from '../../../auth';
import {
  getSupplierOrdersPageData,
  getSupplierWorkspace
} from '../../../lib/supplier-data';

export const dynamic = 'force-dynamic';

export default async function SupplierOrdersPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!session?.user || !userId) {
    redirect('/login');
  }

  const workspace = await getSupplierWorkspace(userId);

  if (!workspace) {
    redirect('/login');
  }

  const data = await getSupplierOrdersPageData(workspace.id);

  return (
    <section className="page-stack">
      <div className="page-hero">
        <span className="eyebrow">Orders</span>
        <h1 className="hero-title">订单跟进</h1>
        <p className="muted">跟踪所有订单的处理状态和支付进度。</p>
      </div>

      <div className="summary-grid">
        <article className="highlight-card">
          <span>订单总数</span>
          <strong>{data.summary.totalCount}</strong>
        </article>
        <article className="highlight-card">
          <span>处理中订单</span>
          <strong>{data.summary.openOrderCount}</strong>
        </article>
      </div>

      <section className="section-panel">
        <div className="data-list">
          {data.orders.map((item) => (
            <article className="data-row" key={item.orderNumber}>
              <div className="data-row__main">
                <strong>{item.orderNumber}</strong>
                <p>{item.customerName} · {item.customerEmail}</p>
                <span>{item.itemCount} items · {item.totalAmount}</span>
              </div>
              <div className="data-row__aside">
                <span className={`status-chip status-chip--${item.statusTone}`}>{item.status}</span>
                <span className={`status-chip status-chip--${item.paymentTone}`}>{item.paymentStatus}</span>
                <span>{item.createdAt}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
