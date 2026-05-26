import Link from 'next/link';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import { auth } from '../../../../auth';
import { getAdminInquiryDetailData } from '../../../../lib/admin-data';

export const dynamic = 'force-dynamic';

const readinessLabels: Record<string, string> = {
  discovering: '正在收集需求',
  qualified: '可进入报价沟通',
  ready_to_submit: '可直接转正式询盘'
};

const missingFieldLabels: Record<string, string> = {
  customerName: '联系人姓名',
  customerCompany: '公司名称',
  customerEmail: '商务邮箱',
  customerPhone: '电话或 WhatsApp',
  customerCountry: '目的地市场',
  quantityRequested: '目标数量',
  targetPrice: '目标价格',
  currency: '币种',
  requirements: '采购要求'
};

type InquiryDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function InquiryDetailPage({ params }: InquiryDetailPageProps) {
  const { id } = await params;
  const session = await auth();
  const sessionUser = session?.user as { role?: string } | undefined;

  if (!sessionUser || sessionUser.role !== 'ADMIN') {
    redirect('/login');
  }

  const inquiry = await getAdminInquiryDetailData(id);

  if (!inquiry) {
    notFound();
  }

  return (
    <section className="page-stack">
      <div className="page-hero">
        <Link href="/inquiries">返回询盘列表</Link>
        <span className="eyebrow">Inquiry detail</span>
        <h1 className="hero-title">{inquiry.inquiryNumber}</h1>
        <p className="muted">
          {inquiry.customerName} · {inquiry.productName} · {inquiry.supplierName}
        </p>
      </div>

      <div className="summary-grid">
        <article className="highlight-card">
          <span>状态</span>
          <strong>{inquiry.status}</strong>
        </article>
        <article className="highlight-card">
          <span>创建时间</span>
          <strong>{inquiry.createdAt}</strong>
        </article>
      </div>

      <div className="split-grid">
        <section className="section-panel">
          <div className="panel-header">
            <span className="eyebrow">Buyer</span>
            <h2>买家信息</h2>
          </div>
          <div className="data-list">
            <article className="data-row">
              <div className="data-row__main">
                <strong>{inquiry.customerName}</strong>
                <p>{inquiry.customerCompany}</p>
                <span>{inquiry.customerEmail}</span>
                <span>{inquiry.customerPhone}</span>
              </div>
              <div className="data-row__aside">
                <span className={`status-chip status-chip--${inquiry.statusTone}`}>{inquiry.status}</span>
                <span>{inquiry.customerCountry}</span>
                <span>updated {inquiry.updatedAt}</span>
              </div>
            </article>
          </div>
        </section>

        <section className="section-panel">
          <div className="panel-header">
            <span className="eyebrow">Assistant</span>
            <h2>询盘助手摘要</h2>
          </div>
          {inquiry.assistant ? (
            <div className="data-list">
              <article className="data-row">
                <div className="data-row__main">
                  <strong>{inquiry.assistant.summary || '已有助手摘要，但尚未生成可读摘要。'}</strong>
                  <p>
                    {inquiry.assistant.readiness
                      ? readinessLabels[inquiry.assistant.readiness] || inquiry.assistant.readiness
                      : '未记录当前阶段'}
                  </p>
                  <span>last updated {inquiry.assistant.updatedAt}</span>
                </div>
                <div className="data-row__aside">
                  <span>{inquiry.assistant.transcript.length} messages captured</span>
                  <span>{inquiry.quoteCount} quotes linked</span>
                </div>
              </article>
              {inquiry.assistant.missingFields.length > 0 ? (
                <article className="data-row">
                  <div className="data-row__main">
                    <strong>待补充信息</strong>
                    <p>
                      {inquiry.assistant.missingFields
                        .map((field) => missingFieldLabels[field] || field)
                        .join('、')}
                    </p>
                  </div>
                </article>
              ) : null}
            </div>
          ) : (
            <p className="muted">这条询盘尚未生成助手摘要。</p>
          )}
        </section>
      </div>

      <div className="split-grid">
        <section className="section-panel">
          <div className="panel-header">
            <span className="eyebrow">Request</span>
            <h2>需求详情</h2>
          </div>
          <div className="data-list">
            <article className="data-row">
              <div className="data-row__main">
                <strong>{inquiry.productName}</strong>
                <p>{inquiry.productCategory}</p>
                <span>{inquiry.quantityRequested}</span>
                <span>{inquiry.targetPrice}</span>
              </div>
              <div className="data-row__aside">
                <span>{inquiry.sourcePageUrl}</span>
                <span>{inquiry.supplierName}</span>
              </div>
            </article>
            <article className="data-row">
              <div className="data-row__main">
                <strong>原始需求</strong>
                <p>{inquiry.requirements}</p>
              </div>
            </article>
          </div>
        </section>

        <section className="section-panel">
          <div className="panel-header">
            <span className="eyebrow">Quotes</span>
            <h2>报价记录</h2>
          </div>
          {inquiry.quotes.length > 0 ? (
            <div className="data-list">
              {inquiry.quotes.map((quote) => (
                <article className="data-row" key={quote.quoteNumber}>
                  <div className="data-row__main">
                    <strong>{quote.quoteNumber}</strong>
                    <p>{quote.amount}</p>
                    <span>MOQ {quote.moq} · lead time {quote.leadTime}</span>
                    {quote.notes ? <span>{quote.notes}</span> : null}
                  </div>
                  <div className="data-row__aside">
                    <span className={`status-chip status-chip--${quote.statusTone}`}>{quote.status}</span>
                    <span>valid until {quote.validUntil}</span>
                    <span>sent {quote.sentAt}</span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="muted">当前还没有报价记录。</p>
          )}
        </section>
      </div>

      {inquiry.assistant?.transcript.length ? (
        <section className="section-panel">
          <div className="panel-header">
            <span className="eyebrow">Transcript</span>
            <h2>最近对话</h2>
          </div>
          <div className="data-list">
            {inquiry.assistant.transcript.map((message, index) => (
              <article className="data-row" key={`${message.role}-${index}`}>
                <div className="data-row__main">
                  <strong>{message.role === 'assistant' ? 'Assistant' : 'Buyer'}</strong>
                  <p>{message.content}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </section>
  );
}