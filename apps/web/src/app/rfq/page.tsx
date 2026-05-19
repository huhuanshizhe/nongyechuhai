import type { Metadata } from 'next';
import Link from 'next/link';
import { auth } from '../../auth';
import { submitInquiryAction } from './actions';
import { getRfqPageData, type StorefrontProductCard } from '../../lib/storefront';

type RfqPageProps = {
  searchParams: Promise<{
    product?: string;
    submitted?: string;
    reference?: string;
    error?: string;
  }>;
};

const processSteps = [
  'You select the closest product line or start with a category-level inquiry.',
  'Your form already carries quantity, market, and commercial notes into the supplier workflow.',
  'Admin and supplier teams review the same RFQ record without re-entering buyer data.',
  'The inquiry can then progress into a quote and order record on the same platform.'
];

export const metadata: Metadata = {
  title: 'RFQ Desk',
  description: 'Send a structured RFQ with buyer-side operational context already captured.'
};

export const revalidate = 300;

function getErrorMessage(error?: string) {
  switch (error) {
    case 'missing-fields':
      return 'Please complete the required contact, market, and requirement fields before submitting.';
    case 'invalid-email':
      return 'Please enter a valid business email address.';
    case 'no-supplier':
      return 'No active supplier is currently available for this inquiry path.';
    default:
      return null;
  }
}

export default async function RfqPage({ searchParams }: RfqPageProps) {
  const resolvedSearchParams = await searchParams;
  const [data, session] = await Promise.all([getRfqPageData(resolvedSearchParams.product), auth()]);
  const errorMessage = getErrorMessage(resolvedSearchParams.error);

  return (
    <main className="page-shell">
      {resolvedSearchParams.submitted === '1' ? (
        <section className="success-banner" data-rise="true">
          <span className="section-kicker">RFQ submitted</span>
          <strong>{resolvedSearchParams.reference || 'Inquiry created'}</strong>
          <p className="catalog-intro">
            Your request is now stored in the shared workflow and ready for supplier/admin follow-up.
          </p>
          <div className="button-row">
            <Link className="button" href="/products">
              Continue browsing
            </Link>
            <Link className="button button--ghost" href="/rfq">
              Send another RFQ
            </Link>
          </div>
        </section>
      ) : null}

      {errorMessage ? (
        <section className="warning-banner" data-rise="true">
          <span className="section-kicker">Submission needs attention</span>
          <strong>Review the form details</strong>
          <p className="catalog-intro">{errorMessage}</p>
        </section>
      ) : null}

      <section className="rfq-layout" data-rise="true">
        <article className="rfq-story">
          <div className="section-head">
            <span className="section-kicker">RFQ desk</span>
            <h1 className="section-title">A sourcing request form shaped for professional agriculture buying teams.</h1>
            <p className="section-description">
              Capture the commercial context once: target product, destination market, quantity, and negotiation notes. The platform will use the same record across buyer, supplier, and admin operations.
            </p>
          </div>
          <div className="rfq-summary">
            <strong>What happens next</strong>
            <ul className="process-list">
              {processSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </div>
          <div className="rfq-summary">
            <strong>Recommended information to prepare</strong>
            <ul className="promise-list">
              <li>Target import market and preferred incoterm.</li>
              <li>Packaging expectation, private label needs, and documentation constraints.</li>
              <li>Initial trial quantity versus repeat container plan.</li>
            </ul>
          </div>
          <div className="rfq-summary">
            <strong>Selected product</strong>
            <p>
              {data.selectedProduct
                ? `${data.selectedProduct.name} · ${data.selectedProduct.tradeModeLabel}`
                : 'No product preselected. You can still start with a general sourcing request.'}
            </p>
          </div>
          {session?.user ? (
            <div className="rfq-summary">
              <strong>Signed-in buyer</strong>
              <p>{session.user.name || session.user.email} · your RFQ will also appear in Buyer Account.</p>
            </div>
          ) : null}
        </article>

        <section className="rfq-form-panel">
          <div className="section-head">
            <span className="section-kicker">Structured inquiry</span>
            <h2>Submit the buyer-side brief</h2>
          </div>
          <form action={submitInquiryAction} className="form-grid">
            <div className="field field--full">
              <label htmlFor="productSlug">Target product</label>
              <select defaultValue={data.selectedProduct?.slug ?? ''} id="productSlug" name="productSlug">
                <option value="">General sourcing request</option>
                {data.products.map((product: StorefrontProductCard) => (
                  <option key={product.slug} value={product.slug}>
                    {product.name} · {product.tradeModeLabel}
                  </option>
                ))}
              </select>
              <small>Choose the closest current product line, or leave blank for a broader sourcing request.</small>
            </div>

            <div className="field">
              <label htmlFor="customerName">Contact name</label>
              <input
                defaultValue={session?.user?.name ?? ''}
                id="customerName"
                name="customerName"
                placeholder="Amelia Harper"
                required
                type="text"
              />
            </div>

            <div className="field">
              <label htmlFor="customerCompany">Company</label>
              <input id="customerCompany" name="customerCompany" placeholder="Harbor Foods Trading" type="text" />
            </div>

            <div className="field">
              <label htmlFor="customerEmail">Business email</label>
              <input
                defaultValue={session?.user?.email ?? ''}
                id="customerEmail"
                name="customerEmail"
                placeholder="buyer@company.com"
                required
                type="email"
              />
            </div>

            <div className="field">
              <label htmlFor="customerPhone">Phone / WhatsApp</label>
              <input id="customerPhone" name="customerPhone" placeholder="+65 ..." type="text" />
            </div>

            <div className="field">
              <label htmlFor="customerCountry">Destination market</label>
              <input id="customerCountry" name="customerCountry" placeholder="Singapore" required type="text" />
            </div>

            <div className="field">
              <label htmlFor="quantityRequested">Target quantity</label>
              <input id="quantityRequested" min="1" name="quantityRequested" placeholder="2000" type="number" />
            </div>

            <div className="field">
              <label htmlFor="targetPrice">Target unit price</label>
              <input id="targetPrice" min="0" name="targetPrice" placeholder="135.00" step="0.01" type="number" />
            </div>

            <div className="field">
              <label htmlFor="currency">Currency</label>
              <select defaultValue="USD" id="currency" name="currency">
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="SGD">SGD</option>
                <option value="AED">AED</option>
              </select>
            </div>

            <div className="field field--full">
              <label htmlFor="requirements">Requirements</label>
              <textarea id="requirements" name="requirements" placeholder="Describe specifications, packaging, destination market, expected lead time, and any documentation constraints." required />
            </div>

            <div className="field field--full">
              <small>
                By sending this RFQ, you are creating a buyer-side sourcing record inside the shared supplier and admin workflow.
                {session?.user ? ' This signed-in account will also be linked to the inquiry history.' : ''}
              </small>
            </div>

            <div className="submit-row field--full">
              <button className="button" type="submit">
                Submit structured RFQ
              </button>
              <Link className="button button--ghost" href="/products">
                Return to catalog
              </Link>
            </div>
          </form>
        </section>
      </section>
    </main>
  );
}
