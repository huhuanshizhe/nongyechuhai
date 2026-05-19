import { redirect } from 'next/navigation';
import { auth } from '../../../auth';
import {
  getSupplierInquiriesPageData,
  getSupplierWorkspace
} from '../../../lib/supplier-data';

export const dynamic = 'force-dynamic';

export default async function SupplierInquiriesPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!session?.user || !userId) {
    redirect('/login');
  }

  const workspace = await getSupplierWorkspace(userId);

  if (!workspace) {
    redirect('/login');
  }

  const inquiries = await getSupplierInquiriesPageData(workspace.id);

  return (
    <section className="page-stack">
      <div className="page-hero">
        <span className="eyebrow">Inquiries</span>
        <h1 className="hero-title">供应商只看与自己业务相关的买家需求和报价进度。</h1>
        <p className="muted">RFQ 表单现在已经会直接沉淀到这里，供应商能立刻确认国家、数量、目标价和报价数。</p>
      </div>

      <section className="section-panel">
        <div className="data-list">
          {inquiries.map((item) => (
            <article className="data-row" key={item.inquiryNumber}>
              <div className="data-row__main">
                <strong>{item.customerName}</strong>
                <p>{item.customerCompany} · {item.customerCountry}</p>
                <span>{item.productName} · {item.quantityRequested} units · {item.targetPrice}</span>
              </div>
              <div className="data-row__aside">
                <span className={`status-chip status-chip--${item.statusTone}`}>{item.status}</span>
                <span>{item.inquiryNumber}</span>
                <span>{item.quoteCount} quotes · {item.createdAt}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
