import { setRequestLocale } from 'next-intl/server';
import { Link } from '../../../../../i18n/routing';
import { getAdminInquiryDetails, updateInquiryStatus } from '../actions';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin - Inquiry Details',
  description: 'Review inquiry details and manage status.'
};

const statusOptions = ['NEW', 'IN_REVIEW', 'QUOTED', 'ACCEPTED', 'REJECTED', 'CLOSED'];
const readinessLabels: Record<string, string> = {
  discovering: 'Collecting details',
  qualified: 'Ready for quote follow-up',
  ready_to_submit: 'Ready for submission'
};
const missingFieldLabels: Record<string, string> = {
  customerName: 'Contact name',
  customerCompany: 'Company',
  customerEmail: 'Business email',
  customerPhone: 'Phone or WhatsApp',
  customerCountry: 'Destination market',
  quantityRequested: 'Target quantity',
  targetPrice: 'Target price',
  currency: 'Currency',
  requirements: 'Requirements'
};

export default async function AdminInquiryDetailPage({ params }: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  
  const inquiry = await getAdminInquiryDetails(id);
  
  if (!inquiry) {
    return (
      <section className="admin-section">
        <div className="not-found-card">
          <span className="section-kicker">Inquiry not found</span>
          <h3>This inquiry does not exist.</h3>
          <Link className="button" href="/admin/inquiries">Back to list</Link>
        </div>
      </section>
    );
  }
  
  return (
    <section className="admin-section" data-rise="true">
      <div className="admin-section__head">
        <Link className="button button--ghost" href="/admin/inquiries">Back to list</Link>
      </div>
      
      <article className="inquiry-review">
        <div className="inquiry-review__header">
          <h1>{inquiry.inquiryNumber}</h1>
          <span className={`pill pill--${inquiry.status.toLowerCase()}`}>{inquiry.status}</span>
        </div>
        
        <div className="inquiry-review__grid">
          <div className="inquiry-review__section">
            <h2>Customer Information</h2>
            <div className="info-list">
              <p><strong>Name:</strong> {inquiry.customerName}</p>
              <p><strong>Email:</strong> {inquiry.customerEmail}</p>
              {inquiry.customerPhone && <p><strong>Phone:</strong> {inquiry.customerPhone}</p>}
              {inquiry.customerCompany && <p><strong>Company:</strong> {inquiry.customerCompany}</p>}
              {inquiry.customerCountry && <p><strong>Destination:</strong> {inquiry.customerCountry}</p>}
            </div>
          </div>
          
          <div className="inquiry-review__section">
            <h2>Product Information</h2>
            {inquiry.product ? (
              <div className="info-list">
                <p><strong>Product:</strong> {inquiry.product.name}</p>
                <p><strong>Category:</strong> {inquiry.product.category?.name}</p>
                <Link className="button button--small" href={`/products/${inquiry.product.slug}`}>View product</Link>
              </div>
            ) : (
              <p>General export request</p>
            )}
          </div>
          
          <div className="inquiry-review__section">
            <h2>Request Details</h2>
            <div className="info-list">
              {inquiry.quantityRequested && <p><strong>Quantity:</strong> {inquiry.quantityRequested}</p>}
              {inquiry.targetPrice && <p><strong>Target price:</strong> {inquiry.currency || 'USD'} {inquiry.targetPrice.toString()}</p>}
            </div>
            {inquiry.requirements && (
              <div>
                <strong>Requirements:</strong>
                <p>{inquiry.requirements}</p>
              </div>
            )}
          </div>
          
          <div className="inquiry-review__section">
            <h2>Supplier</h2>
            <p><strong>Supplier:</strong> {inquiry.supplier.organization.name}</p>
          </div>
        </div>

        {inquiry.inquiryAgentSnapshot ? (
          <div className="inquiry-review__section">
            <h2>Inquiry Assistant Brief</h2>
            {inquiry.inquiryAgentSnapshot.briefingSummary ? (
              <div>
                <strong>Summary:</strong>
                <p>{inquiry.inquiryAgentSnapshot.briefingSummary}</p>
              </div>
            ) : null}

            <div className="info-list">
              {inquiry.inquiryAgentSnapshot.readiness ? (
                <p>
                  <strong>Progress:</strong> {readinessLabels[inquiry.inquiryAgentSnapshot.readiness] ?? inquiry.inquiryAgentSnapshot.readiness}
                </p>
              ) : null}
              {inquiry.inquiryAgentSnapshot.updatedAt ? (
                <p>
                  <strong>Last assistant update:</strong> {new Date(inquiry.inquiryAgentSnapshot.updatedAt).toLocaleString()}
                </p>
              ) : null}
            </div>

            {inquiry.inquiryAgentSnapshot.missingFields.length > 0 ? (
              <div>
                <strong>Still needed from buyer:</strong>
                <ul>
                  {inquiry.inquiryAgentSnapshot.missingFields.map((field) => (
                    <li key={field}>{missingFieldLabels[field] ?? field}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {inquiry.inquiryAgentSnapshot.transcript.length > 0 ? (
              <div>
                <strong>Recent assistant conversation:</strong>
                <div className="info-list">
                  {inquiry.inquiryAgentSnapshot.transcript.slice(-6).map((message, index) => (
                    <p key={`${message.role}-${index}`}>
                      <strong>{message.role === 'assistant' ? 'Assistant' : 'Buyer'}:</strong> {message.content}
                    </p>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
        
        <div className="inquiry-review__quotes">
          <h2>Quotes ({inquiry.quotes.length})</h2>
          {inquiry.quotes.length > 0 ? (
            <div className="quote-list">
              {inquiry.quotes.map((quote) => (
                <div className="quote-card" key={quote.id}>
                  <p><strong>{quote.quoteNumber}</strong> - {quote.status}</p>
                  <p>Amount: {quote.currency} {quote.totalAmount?.toString() || 'Pending'}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No quotes yet.</p>
          )}
        </div>
        
        <div className="inquiry-review__actions">
          <h2>Update Status</h2>
          <form action={updateInquiryStatus}>
            <input type="hidden" name="inquiryNumber" value={inquiry.inquiryNumber} />
            <select name="status" defaultValue={inquiry.status}>
              {statusOptions.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <button className="button" type="submit">Update</button>
          </form>
        </div>
        
        <div className="inquiry-review__meta">
          <p>Created: {inquiry.createdAt.toLocaleString()}</p>
        </div>
      </article>
    </section>
  );
}