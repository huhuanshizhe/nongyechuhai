import { getAdminInquiriesPageData } from '../../../lib/admin-data';

export const dynamic = 'force-dynamic';

export default async function InquiriesPage() {
  const inquiries = await getAdminInquiriesPageData();

  return (
    <section className="page-stack">
      <div className="page-hero">
        <span className="eyebrow">Inquiries</span>
        <h1 className="hero-title">询盘管理</h1>
        <p className="muted">当前列表已经接上真实询盘数据，可以直接验证 RFQ 如何进入运营和供应商团队。</p>
      </div>
      <section className="section-panel">
        <div className="data-list">
          {inquiries.map((item) => (
            <article className="data-row" key={item.inquiryNumber}>
              <div className="data-row__main">
                <strong>{item.customerName}</strong>
                <p>{item.customerCompany} · {item.customerCountry}</p>
                <span>{item.productName} · {item.supplierName}</span>
                {item.assistantSummary ? <p>{item.assistantSummary}</p> : null}
              </div>
              <div className="data-row__aside">
                <span className={`status-chip status-chip--${item.statusTone}`}>{item.status}</span>
                <span>{item.inquiryNumber}</span>
                <span>{item.quantityRequested} units · {item.targetPrice}</span>
                <span>{item.quoteCount} quotes · {item.createdAt}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
