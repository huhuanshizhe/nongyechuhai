import { setRequestLocale } from 'next-intl/server';
import { Link } from '../../../../i18n/routing';
import { getSupplierInquiries } from '../actions';

type SupplierInquiriesProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ status?: string }>;
};

export default async function SupplierInquiriesPage({ params, searchParams }: SupplierInquiriesProps) {
  const { locale } = await params;
  const { status } = await searchParams;
  setRequestLocale(locale);
  const isZh = locale === 'zh';

  const inquiries = await getSupplierInquiries();

  const statusFilters = ['NEW', 'IN_REVIEW', 'QUOTED', 'NEGOTIATING', 'CLOSED_WON', 'CLOSED_LOST', 'EXPIRED'] as const;

  const statusCounts = statusFilters.map(s => ({
    status: s,
    count: inquiries.filter(i => i.status === s).length
  }));

  const filteredInquiries = status ? inquiries.filter(i => i.status === status) : inquiries;

  return (
    <section className="section-block">
      <div className="shell">
        <span className="section-kicker">{isZh ? '询盘管理' : 'Inquiry management'}</span>
        <h1>{isZh ? '询盘列表' : 'Inquiry list'}</h1>

        <div className="filter-bar">
          <div className="filter-tabs">
            {statusCounts.map(({ status: s, count }) => (
              <Link
                key={s}
                href={`/supplier/inquiries?status=${s}`}
                className={`filter-tab ${status === s ? 'filter-tab--active' : ''}`}
              >
                {isZh ? inquiryStatusZh(s) : s}
                <span className="filter-tab__count">{count}</span>
              </Link>
            ))}
            <Link
              href="/supplier/inquiries"
              className={`filter-tab ${!status ? 'filter-tab--active' : ''}`}
            >
              {isZh ? '全部' : 'All'}
              <span className="filter-tab__count">{inquiries.length}</span>
            </Link>
          </div>
        </div>

        {filteredInquiries.length > 0 ? (
          <div className="inquiry-table">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{isZh ? '询盘编号' : 'Inquiry number'}</th>
                  <th>{isZh ? '客户' : 'Customer'}</th>
                  <th>{isZh ? '产品' : 'Product'}</th>
                  <th>{isZh ? '数量' : 'Quantity'}</th>
                  <th>{isZh ? '状态' : 'Status'}</th>
                  <th>{isZh ? '时间' : 'Date'}</th>
                  <th>{isZh ? '操作' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {filteredInquiries.map(inquiry => (
                  <tr key={inquiry.id}>
                    <td>
                      <Link href={`/supplier/inquiries/${inquiry.id}`} className="link">
                        {inquiry.inquiryNumber}
                      </Link>
                    </td>
                    <td>
                      <div className="customer-cell">
                        <span className="customer-cell__name">{inquiry.customerName}</span>
                        <span className="customer-cell__email">{inquiry.customerEmail}</span>
                        {inquiry.customerCompany && (
                          <span className="customer-cell__company">{inquiry.customerCompany}</span>
                        )}
                      </div>
                    </td>
                    <td>{(inquiry as { product?: { name: string } }).product?.name ?? (isZh ? '通用询盘' : 'General inquiry')}</td>
                    <td>{inquiry.quantityRequested ?? (isZh ? '未指定' : 'Not specified')}</td>
                    <td>
                      <span className={`status-badge status-badge--${inquiry.status.toLowerCase().replace('_', '-')}`}>
                        {isZh ? inquiryStatusZh(inquiry.status) : inquiry.status}
                      </span>
                    </td>
                    <td>{new Date(inquiry.createdAt).toLocaleDateString(isZh ? 'zh-CN' : 'en-US')}</td>
                    <td>
                      <Link className="button button--small" href={`/supplier/inquiries/${inquiry.id}`}>
                        {isZh ? '查看' : 'View'}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <p>{isZh ? '暂无询盘。' : 'No inquiries found.'}</p>
          </div>
        )}
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