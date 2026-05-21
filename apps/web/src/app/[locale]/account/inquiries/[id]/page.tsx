import { setRequestLocale } from 'next-intl/server';
import { Link } from '../../../../../i18n/routing';
import { auth } from '../../../../../auth';
import { getInquiryDetails } from '../../../rfq/actions';
import type { Metadata } from 'next';

type InquiryDetailPageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export const metadata: Metadata = {
  title: 'Inquiry Details',
  description: 'View your inquiry details and supplier responses.'
};

const statusLabels: Record<string, { en: string; zh: string; tone: string }> = {
  NEW: { en: 'New', zh: '新询盘', tone: 'pending' },
  IN_REVIEW: { en: 'In Review', zh: '审核中', tone: 'reviewing' },
  QUOTED: { en: 'Quoted', zh: '已报价', tone: 'quoted' },
  ACCEPTED: { en: 'Accepted', zh: '已接受', tone: 'accepted' },
  REJECTED: { en: 'Declined', zh: '已关闭', tone: 'rejected' },
  CLOSED: { en: 'Closed', zh: '已完成', tone: 'completed' }
};

export default async function InquiryDetailPage({ params }: InquiryDetailPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const isZh = locale === 'zh';
  const session = await auth();

  if (!session?.user) {
    return (
      <main className="page-shell">
        <section className="section-block" data-rise="true">
          <div className="not-found-card">
            <span className="section-kicker">{isZh ? 'Please sign in' : 'Sign in required'}</span>
            <h3>{isZh ? 'Please sign in to view inquiry details.' : 'Please sign in to view inquiry details.'}</h3>
            <Link className="button" href="/login">
              {isZh ? 'Sign in' : 'Sign in'}
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const inquiry = await getInquiryDetails(id);

  if (!inquiry) {
    return (
      <main className="page-shell">
        <section className="section-block" data-rise="true">
          <div className="not-found-card">
            <span className="section-kicker">{isZh ? 'Inquiry not found' : 'Inquiry not found'}</span>
            <h3>{isZh ? 'This inquiry does not exist.' : 'This inquiry does not exist or you do not have permission.'}</h3>
            <Link className="button" href="/account">
              {isZh ? 'Back to workspace' : 'Back to workspace'}
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const statusInfo = statusLabels[inquiry.status] || statusLabels.NEW;

  return (
    <main className="page-shell">
      <section className="section-block" data-rise="true">
        <div className="section-head">
          <Link className="button button--ghost" href="/account">
            {isZh ? 'Back to workspace' : 'Back to workspace'}
          </Link>
        </div>

        <article className="inquiry-detail">
          <div className="inquiry-detail__header">
            <div className="inquiry-detail__status-row">
              <span className={`pill pill--${statusInfo.tone}`}>
                {isZh ? statusInfo.zh : statusInfo.en}
              </span>
              <span className="inquiry-detail__number">{inquiry.inquiryNumber}</span>
            </div>
            <div className="inquiry-detail__meta">
              <span>{isZh ? `Created: ${inquiry.createdAt.toLocaleDateString('zh-CN')}` : `Submitted: ${inquiry.createdAt.toLocaleDateString('en-US')}`}</span>
            </div>
          </div>

          <div className="inquiry-detail__body">
            <div className="inquiry-detail__section">
              <h2>{isZh ? 'Inquiry Information' : 'Inquiry Information'}</h2>
              
              {inquiry.product ? (
                <div className="inquiry-detail__product">
                  <div className="inquiry-detail__product-image">
                    <img alt={inquiry.product.name} src={inquiry.product.coverImageUrl || '/placeholder.png'} />
                  </div>
                  <div className="inquiry-detail__product-info">
                    <span className="catalog-chip">{inquiry.product.category?.name}</span>
                    <h3>{inquiry.product.name}</h3>
                    <Link className="button button--ghost" href={`/products/${inquiry.product.slug}`}>
                      {isZh ? 'View product' : 'View product'}
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="inquiry-detail__general">
                  <span className="pill">{isZh ? 'General export request' : 'General export request'}</span>
                  <p>{isZh ? 'This inquiry is not linked to a specific product.' : 'This inquiry is not linked to a specific product.'}</p>
                </div>
              )}
            </div>

            <div className="inquiry-detail__section">
              <h2>{isZh ? 'Contact Information' : 'Contact Information'}</h2>
              <div className="info-grid">
                <div className="info-item">
                  <strong>{isZh ? 'Contact' : 'Contact'}</strong>
                  <span>{inquiry.customerName}</span>
                </div>
                <div className="info-item">
                  <strong>{isZh ? 'Email' : 'Email'}</strong>
                  <span>{inquiry.customerEmail}</span>
                </div>
                {inquiry.customerPhone && (
                  <div className="info-item">
                    <strong>{isZh ? 'Phone' : 'Phone'}</strong>
                    <span>{inquiry.customerPhone}</span>
                  </div>
                )}
                {inquiry.customerCompany && (
                  <div className="info-item">
                    <strong>{isZh ? 'Company' : 'Company'}</strong>
                    <span>{inquiry.customerCompany}</span>
                  </div>
                )}
                {inquiry.customerCountry && (
                  <div className="info-item">
                    <strong>{isZh ? 'Destination' : 'Destination'}</strong>
                    <span>{inquiry.customerCountry}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="inquiry-detail__section">
              <h2>{isZh ? 'Requirements' : 'Requirements'}</h2>
              <div className="info-grid">
                {inquiry.quantityRequested && (
                  <div className="info-item">
                    <strong>{isZh ? 'Target quantity' : 'Target quantity'}</strong>
                    <span>{inquiry.quantityRequested} units</span>
                  </div>
                )}
                {inquiry.targetPrice && (
                  <div className="info-item">
                    <strong>{isZh ? 'Target price' : 'Target price'}</strong>
                    <span>{inquiry.currency || 'USD'} {inquiry.targetPrice.toString()}</span>
                  </div>
                )}
              </div>
              {inquiry.requirements && (
                <div className="inquiry-detail__requirements">
                  <strong>{isZh ? 'Detailed requirements' : 'Detailed requirements'}</strong>
                  <p>{inquiry.requirements}</p>
                </div>
              )}
            </div>

            <div className="inquiry-detail__section">
              <h2>{isZh ? 'Supplier' : 'Supplier'}</h2>
              <div className="info-item">
                <strong>{isZh ? 'Assigned supplier' : 'Assigned supplier'}</strong>
                <span>{inquiry.supplier.organization.name}</span>
              </div>
            </div>

            {inquiry.quotes.length > 0 ? (
              <div className="inquiry-detail__section">
                <h2>{isZh ? 'Supplier Quotes' : 'Supplier Quotes'}</h2>
                <div className="quote-list">
                  {inquiry.quotes.map((quote) => (
                    <article className="quote-card" key={quote.id}>
                      <div className="quote-card__header">
                        <span className="pill pill--quoted">{isZh ? 'Quote sent' : 'Quote sent'}</span>
                        <span className="quote-card__number">{quote.quoteNumber}</span>
                      </div>
                      <div className="quote-card__body">
                        <div className="quote-card__amount">
                          <strong>{isZh ? 'Quote amount' : 'Quote amount'}</strong>
                          <span className="quote-card__price">
                            {quote.currency} {quote.totalAmount?.toString() || (isZh ? 'Pending' : 'Pending')}
                          </span>
                        </div>
                        {quote.minOrderQty && (
                          <div className="quote-card__detail">
                            <strong>{isZh ? 'Min. order' : 'Min. order'}</strong>
                            <span>{quote.minOrderQty} units</span>
                          </div>
                        )}
                        {quote.leadTimeDays && (
                          <div className="quote-card__detail">
                            <strong>{isZh ? 'Lead time' : 'Lead time'}</strong>
                            <span>{quote.leadTimeDays} {isZh ? 'days' : 'days'}</span>
                          </div>
                        )}
                        {quote.validUntil && (
                          <div className="quote-card__detail">
                            <strong>{isZh ? 'Valid until' : 'Valid until'}</strong>
                            <span>{quote.validUntil.toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US')}</span>
                          </div>
                        )}
                        {quote.notes && (
                          <div className="quote-card__notes">
                            <strong>{isZh ? 'Notes' : 'Notes'}</strong>
                            <p>{quote.notes}</p>
                          </div>
                        )}
                      </div>
                      <div className="quote-card__footer">
                        <span>{isZh ? `Sent: ${quote.sentAt?.toLocaleDateString('zh-CN') || 'Pending'}` : `Sent: ${quote.sentAt?.toLocaleDateString('en-US') || 'Pending'}`}</span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : (
              <div className="inquiry-detail__section">
                <h2>{isZh ? 'Supplier Quotes' : 'Supplier Quotes'}</h2>
                <div className="empty-state">
                  <span className="section-kicker">{isZh ? 'No quotes yet' : 'No quotes yet'}</span>
                  <p>{isZh ? 'The supplier has not sent a quote yet. We will respond within 48 hours.' : 'The supplier has not sent a quote yet. We will respond within 48 hours.'}</p>
                </div>
              </div>
            )}
          </div>

          <div className="inquiry-detail__actions button-row">
            <Link className="button" href="/rfq">
              {isZh ? 'New inquiry' : 'New inquiry'}
            </Link>
            <Link className="button button--ghost" href="/products">
              {isZh ? 'Browse products' : 'Browse products'}
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
}