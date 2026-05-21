import { setRequestLocale } from 'next-intl/server';
import { Link } from '../../../../../i18n/routing';
import { prisma } from '@nongyechuhai/db';
import { auth } from '../../../../../auth';
import { getSupplierProfile } from '../../actions';
import { notFound } from 'next/navigation';

type InquiryDetailProps = {
  params: Promise<{ locale: string; id: string }>;
};

async function getInquiryDetails(inquiryId: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const supplier = await getSupplierProfile();
  if (!supplier) return null;

  return prisma.inquiry.findFirst({
    where: { id: inquiryId, supplierId: supplier.id },
    include: {
      product: { select: { name: true, slug: true, coverImageUrl: true } },
      quotes: { orderBy: { createdAt: 'desc' } }
    }
  });
}

export default async function SupplierInquiryDetailPage({ params }: InquiryDetailProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const isZh = locale === 'zh';

  const inquiry = await getInquiryDetails(id);

  if (!inquiry) {
    notFound();
  }

  return (
    <section className="section-block">
      <div className="shell">
        <div className="detail-header">
          <span className="section-kicker">{isZh ? '询盘详情' : 'Inquiry details'}</span>
          <h1>{inquiry.inquiryNumber}</h1>
          <span className={`status-badge status-badge--${inquiry.status.toLowerCase().replace('_', '-')}`}>
            {isZh ? inquiryStatusZh(inquiry.status) : inquiry.status}
          </span>
        </div>

        <div className="detail-grid">
          <div className="detail-section">
            <h2>{isZh ? '客户信息' : 'Customer information'}</h2>
            <div className="info-list">
              <div className="info-item">
                <span className="info-label">{isZh ? '姓名' : 'Name'}</span>
                <span className="info-value">{inquiry.customerName}</span>
              </div>
              <div className="info-item">
                <span className="info-label">{isZh ? '邮箱' : 'Email'}</span>
                <a href={`mailto:${inquiry.customerEmail}`} className="link">{inquiry.customerEmail}</a>
              </div>
              {inquiry.customerPhone && (
                <div className="info-item">
                  <span className="info-label">{isZh ? '电话' : 'Phone'}</span>
                  <span className="info-value">{inquiry.customerPhone}</span>
                </div>
              )}
              {inquiry.customerCompany && (
                <div className="info-item">
                  <span className="info-label">{isZh ? '公司' : 'Company'}</span>
                  <span className="info-value">{inquiry.customerCompany}</span>
                </div>
              )}
              {inquiry.customerCountry && (
                <div className="info-item">
                  <span className="info-label">{isZh ? '国家' : 'Country'}</span>
                  <span className="info-value">{inquiry.customerCountry}</span>
                </div>
              )}
            </div>
          </div>

          <div className="detail-section">
            <h2>{isZh ? '询盘详情' : 'Inquiry details'}</h2>
            <div className="info-list">
              {inquiry.product && (
                <div className="info-item">
                  <span className="info-label">{isZh ? '产品' : 'Product'}</span>
                  <Link className="link" href={`/products/${inquiry.product.slug}`}>
                    {inquiry.product.name}
                  </Link>
                </div>
              )}
              {inquiry.quantityRequested && (
                <div className="info-item">
                  <span className="info-label">{isZh ? '数量' : 'Quantity'}</span>
                  <span className="info-value">{inquiry.quantityRequested}</span>
                </div>
              )}
              {inquiry.targetPrice && (
                <div className="info-item">
                  <span className="info-label">{isZh ? '目标价格' : 'Target price'}</span>
                  <span className="info-value">{inquiry.currency ?? 'USD'} {inquiry.targetPrice.toString()}</span>
                </div>
              )}
              <div className="info-item">
                <span className="info-label">{isZh ? '提交时间' : 'Submitted at'}</span>
                <span className="info-value">{new Date(inquiry.createdAt).toLocaleString(isZh ? 'zh-CN' : 'en-US')}</span>
              </div>
            </div>
          </div>
        </div>

        {inquiry.requirements && (
          <div className="detail-section detail-section--full">
            <h2>{isZh ? '需求说明' : 'Requirements'}</h2>
            <div className="requirements-box">
              <p>{inquiry.requirements}</p>
            </div>
          </div>
        )}

        {inquiry.quotes.length > 0 && (
          <div className="detail-section detail-section--full">
            <h2>{isZh ? '报价记录' : 'Quote history'}</h2>
            <div className="quote-list">
              {inquiry.quotes.map(quote => (
                <div key={quote.id} className="quote-card">
                  <div className="quote-card__header">
                    <span className="quote-card__number">{quote.quoteNumber}</span>
                    <span className={`status-badge status-badge--${quote.status.toLowerCase()}`}>
                      {isZh ? quoteStatusZh(quote.status) : quote.status}
                    </span>
                  </div>
                  <div className="quote-card__body">
                    {quote.totalAmount && (
                      <span className="quote-card__amount">{quote.currency} {quote.totalAmount.toString()}</span>
                    )}
                    {quote.minOrderQty && (
                      <span className="quote-card__meta">{isZh ? `最小订量: ${quote.minOrderQty}` : `MOQ: ${quote.minOrderQty}`}</span>
                    )}
                    {quote.leadTimeDays && (
                      <span className="quote-card__meta">{isZh ? `交期: ${quote.leadTimeDays}天` : `Lead time: ${quote.leadTimeDays} days`}</span>
                    )}
                    {quote.notes && <p className="quote-card__notes">{quote.notes}</p>}
                  </div>
                  <div className="quote-card__footer">
                    <span className="quote-card__date">{new Date(quote.createdAt).toLocaleDateString(isZh ? 'zh-CN' : 'en-US')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="action-row">
          <Link className="button" href="/supplier/inquiries">{isZh ? '返回列表' : 'Back to list'}</Link>
          {inquiry.status === 'NEW' && (
            <Link className="button button--primary" href={`/supplier/quotes/new?inquiry=${inquiry.id}`}>
              {isZh ? '创建报价' : 'Create quote'}
            </Link>
          )}
          <a className="button button--ghost" href={`mailto:${inquiry.customerEmail}?subject=${encodeURIComponent(`Re: ${inquiry.inquiryNumber}`)}`}>
            {isZh ? '发送邮件' : 'Send email'}
          </a>
        </div>
      </div>
    </section>
  );
}

function inquiryStatusZh(status: string): string {
  const map: Record<string, string> = {
    NEW: '新询盘',
    IN_REVIEW: '审核中',
    QUOTED: '已报价',
    NEGOTIATING: '协商中',
    CLOSED_WON: '已成交',
    CLOSED_LOST: '已流失',
    EXPIRED: '已过期'
  };
  return map[status] ?? status;
}

function quoteStatusZh(status: string): string {
  const map: Record<string, string> = {
    DRAFT: '草稿',
    SENT: '已发送',
    ACCEPTED: '已接受',
    REJECTED: '已拒绝',
    EXPIRED: '已过期'
  };
  return map[status] ?? status;
}