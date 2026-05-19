import { getAdminSuppliersPageData } from '../../../lib/admin-data';

export const dynamic = 'force-dynamic';

export default async function SuppliersPage() {
  const suppliers = await getAdminSuppliersPageData();

  return (
    <section className="page-stack">
      <div className="page-hero">
        <span className="eyebrow">Suppliers</span>
        <h1 className="hero-title">供应商审核与经营质量一屏可见。</h1>
        <p className="muted">这里集中看准入状态、验证情况、联系方式以及每个供应商当前实际承担的商品、询盘和订单量。</p>
      </div>
      <section className="section-panel">
        <div className="data-list">
          {suppliers.map((item) => (
            <article className="data-row" key={`${item.name}-${item.contactEmail}`}>
              <div className="data-row__main">
                <strong>{item.name}</strong>
                <p>{item.location}</p>
                <span>{item.contactName} · {item.contactEmail} · {item.contactPhone}</span>
                <span>{item.website}</span>
              </div>
              <div className="data-row__aside">
                <span className={`status-chip status-chip--${item.statusTone}`}>{item.status}</span>
                <span>{item.verifiedLabel}</span>
                <span>{item.productCount} products · {item.inquiryCount} inquiries · {item.orderCount} orders</span>
                <span>approved {item.approvedAt}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
