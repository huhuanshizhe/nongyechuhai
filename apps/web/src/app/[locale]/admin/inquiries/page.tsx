import { setRequestLocale } from 'next-intl/server';
import { Link } from '../../../../i18n/routing';
import { prisma } from '@nongyechuhai/db';
import type { Metadata } from 'next';
import type { InquiryStatus } from '@prisma/client';

export const metadata: Metadata = {
  title: 'Admin - Inquiry Review',
  description: 'Review and manage buyer inquiries.'
};

const statusFilters: InquiryStatus[] = ['NEW', 'IN_REVIEW', 'QUOTED', 'NEGOTIATING', 'CLOSED_WON', 'CLOSED_LOST', 'EXPIRED'];

export default async function AdminInquiriesPage({ params, searchParams }: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const resolvedSearchParams = await searchParams;
  
  const activeStatus = (resolvedSearchParams.status || 'NEW') as InquiryStatus;
  
  const inquiries = await prisma.inquiry.findMany({
    where: { status: activeStatus },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      inquiryNumber: true,
      status: true,
      createdAt: true,
      customerName: true,
      customerEmail: true,
      customerCompany: true,
      customerCountry: true,
      quantityRequested: true,
      currency: true,
      requirements: true,
      product: { select: { name: true, slug: true } },
      supplier: { select: { organization: { select: { name: true } } } },
      quotes: { select: { id: true } }
    },
    take: 50
  });

  const statusCounts = await Promise.all(
    statusFilters.map(async (status) => ({
      status,
      count: await prisma.inquiry.count({ where: { status } })
    }))
  );

  return (
    <section className="admin-section" data-rise="true">
      <div className="admin-section__head">
        <span className="section-kicker">Inquiry management</span>
        <h1>Review buyer inquiries</h1>
        <p>Process and respond to incoming buyer requests.</p>
      </div>

      <div className="admin-filters">
        {statusCounts.map(({ status, count }) => (
          <Link
            key={status}
            className={`filter-pill ${activeStatus === status ? 'filter-pill--active' : ''}`}
            href={`/admin/inquiries?status=${status}`}
          >
            {status} ({count})
          </Link>
        ))}
      </div>

      <div className="admin-table">
        <table className="data-table">
          <thead>
            <tr>
              <th>Number</th>
              <th>Status</th>
              <th>Product</th>
              <th>Customer</th>
              <th>Company</th>
              <th>Destination</th>
              <th>Qty</th>
              <th>Supplier</th>
              <th>Quotes</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inquiry) => (
              <tr key={inquiry.id}>
                <td><strong>{inquiry.inquiryNumber}</strong></td>
                <td><span className={`pill pill--${inquiry.status.toLowerCase()}`}>{inquiry.status}</span></td>
                <td>{inquiry.product?.name || 'General'}</td>
                <td>{inquiry.customerName}</td>
                <td>{inquiry.customerCompany || '-'}</td>
                <td>{inquiry.customerCountry || '-'}</td>
                <td>{inquiry.quantityRequested || '-'}</td>
                <td>{inquiry.supplier.organization.name}</td>
                <td>{inquiry.quotes.length}</td>
                <td>{inquiry.createdAt.toLocaleDateString()}</td>
                <td>
                  <Link className="button button--small" href={`/admin/inquiries/${inquiry.inquiryNumber}`}>
                    Review
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {inquiries.length === 0 && (
          <div className="empty-state">
            <p>No inquiries in this status.</p>
          </div>
        )}
      </div>
    </section>
  );
}