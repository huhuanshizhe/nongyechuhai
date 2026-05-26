import Link from 'next/link';
import { getAdminDashboardData } from '../../../lib/admin-data';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const data = await getAdminDashboardData();

  return (
    <section className="page-stack">
      <div className="page-hero">
        <span className="eyebrow">Dashboard</span>
        <h1 className="hero-title">运营总览</h1>
        <p className="muted">供应商审核、商品治理、询盘流转与内容发布 — 核心运营数据一目了然。</p>
      </div>

      <div className="metrics-grid">
        {data.metrics.map((item) => (
          <article className="metric-panel" key={item.label}>
            <p className="metric-value">{item.value}</p>
            <strong>{item.label}</strong>
            <p className="metric-detail">{item.detail}</p>
          </article>
        ))}
      </div>

      <div className="summary-grid">
        {data.pulse.map((item) => (
          <article className="highlight-card" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </article>
        ))}
      </div>

      <div className="split-grid">
        <section className="section-panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">询盘概览</span>
              <h2>最新买家询盘</h2>
            </div>
          </div>
          <div className="data-list">
            {data.recentInquiries.map((item) => (
              <article className="data-row" key={item.inquiryNumber}>
                <div className="data-row__main">
                  <strong>{item.customerName}</strong>
                  <p>{item.productName}</p>
                  {item.assistantSummary ? <span>{item.assistantSummary}</span> : null}
                  <span>{item.customerCountry} · {item.supplierName}</span>
                </div>
                <div className="data-row__aside">
                  <span className={`status-chip status-chip--${item.statusTone}`}>{item.status}</span>
                  <Link href={`/inquiries/${item.inquiryNumber}`}>{item.inquiryNumber}</Link>
                  <span>{item.quoteCount} quotes · {item.createdAt}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section-panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">供应商概览</span>
              <h2>供应商审核与产出</h2>
            </div>
          </div>
          <div className="data-list">
            {data.suppliers.map((item) => (
              <article className="data-row" key={item.name}>
                <div className="data-row__main">
                  <strong>{item.name}</strong>
                  <p>{item.location}</p>
                  <span>{item.contactName} · {item.contactEmail}</span>
                </div>
                <div className="data-row__aside">
                  <span className={`status-chip status-chip--${item.statusTone}`}>{item.status}</span>
                  <span>{item.verifiedLabel}</span>
                  <span>{item.productCount} products · {item.inquiryCount} inquiries</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="split-grid">
        <section className="section-panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">商品概览</span>
              <h2>待治理商品</h2>
            </div>
          </div>
          <div className="data-list">
            {data.products.map((item) => (
              <article className="data-row" key={item.name}>
                <div className="data-row__main">
                  <strong>{item.name}</strong>
                  <p>{item.categoryName} · {item.supplierName}</p>
                  <span>{item.tradeMode} · {item.priceLabel}</span>
                </div>
                <div className="data-row__aside">
                  <span className={`status-chip status-chip--${item.statusTone}`}>{item.status}</span>
                  <span>{item.updatedAt}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section-panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">内容概览</span>
              <h2>内容资产状态</h2>
            </div>
          </div>
          <div className="data-list">
            {data.content.map((item) => (
              <article className="data-row" key={item.slug}>
                <div className="data-row__main">
                  <strong>{item.title}</strong>
                  <p>/{item.slug}</p>
                  <span>{item.faqCount} FAQ · updated {item.updatedAt}</span>
                </div>
                <div className="data-row__aside">
                  <span className={`status-chip status-chip--${item.statusTone}`}>{item.status}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
