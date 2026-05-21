import { setRequestLocale } from 'next-intl/server';
import { Link } from '../../../i18n/routing';
import { getSupplierProfile, getSupplierProducts, getSupplierInquiries } from './actions';
import type { ProductStatus } from '@prisma/client';

type SupplierDashboardProps = {
  params: Promise<{ locale: string }>;
};

export default async function SupplierDashboard({ params }: SupplierDashboardProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isZh = locale === 'zh';

  const [supplier, products, inquiries] = await Promise.all([
    getSupplierProfile(),
    getSupplierProducts(),
    getSupplierInquiries()
  ]);

  if (!supplier) return null;

  const productCounts = {
    total: products.length,
    draft: products.filter(p => p.status === 'DRAFT').length,
    pending: products.filter(p => p.status === 'PENDING_REVIEW').length,
    published: products.filter(p => p.status === 'PUBLISHED').length
  };

  const inquiryCounts = {
    total: inquiries.length,
    new: inquiries.filter(i => i.status === 'NEW').length,
    inReview: inquiries.filter(i => i.status === 'IN_REVIEW').length,
    quoted: inquiries.filter(i => i.status === 'QUOTED').length
  };

  const recentProducts = products.slice(0, 5);
  const recentInquiries = inquiries.slice(0, 5);

  return (
    <section className="section-block">
      <div className="shell">
        <span className="section-kicker">{isZh ? '供应商仪表盘' : 'Supplier Dashboard'}</span>
        <h1>{isZh ? '工作台概览' : 'Overview'}</h1>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-card__value">{productCounts.total}</span>
            <span className="stat-card__label">{isZh ? '总产品数' : 'Total products'}</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{productCounts.published}</span>
            <span className="stat-card__label">{isZh ? '已发布' : 'Published'}</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{inquiryCounts.total}</span>
            <span className="stat-card__label">{isZh ? '总询盘数' : 'Total inquiries'}</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{inquiryCounts.new}</span>
            <span className="stat-card__label">{isZh ? '新询盘' : 'New inquiries'}</span>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-section">
            <div className="dashboard-section__header">
              <h2>{isZh ? '最近产品' : 'Recent products'}</h2>
              <Link className="button button--small" href="/supplier/products">{isZh ? '管理产品' : 'Manage'}</Link>
            </div>
            {recentProducts.length > 0 ? (
              <ul className="item-list">
                {recentProducts.map(product => (
                  <li key={product.id} className="item-list__item">
                    <div className="item-list__main">
                      <span className="item-list__title">{product.name}</span>
                      <span className="item-list__meta">{product.category?.name}</span>
                    </div>
                    <span className={`status-badge status-badge--${product.status.toLowerCase()}`}>
                      {isZh ? statusZh(product.status) : product.status}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">{isZh ? '暂无产品' : 'No products yet'}</p>
            )}
          </div>

          <div className="dashboard-section">
            <div className="dashboard-section__header">
              <h2>{isZh ? '最近询盘' : 'Recent inquiries'}</h2>
              <Link className="button button--small" href="/supplier/inquiries">{isZh ? '查看全部' : 'View all'}</Link>
            </div>
            {recentInquiries.length > 0 ? (
              <ul className="item-list">
                {recentInquiries.map(inquiry => (
                  <li key={inquiry.id} className="item-list__item">
                    <div className="item-list__main">
                      <span className="item-list__title">{inquiry.inquiryNumber}</span>
                      <span className="item-list__meta">{inquiry.customerName} - {(inquiry as { product?: { name: string } }).product?.name ?? (isZh ? '通用询盘' : 'General inquiry')}</span>
                    </div>
                    <span className={`status-badge status-badge--${inquiry.status.toLowerCase().replace('_', '-')}`}>
                      {isZh ? inquiryStatusZh(inquiry.status) : inquiry.status}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">{isZh ? '暂无询盘' : 'No inquiries yet'}</p>
            )}
          </div>
        </div>

        <div className="action-row">
          <Link className="button" href="/supplier/products/new">{isZh ? '添加新产品' : 'Add new product'}</Link>
          <Link className="button button--ghost" href="/supplier/profile">{isZh ? '编辑供应商资料' : 'Edit profile'}</Link>
        </div>
      </div>
    </section>
  );
}

function statusZh(status: ProductStatus): string {
  const map: Record<ProductStatus, string> = {
    DRAFT: '草稿',
    PENDING_REVIEW: '待审核',
    APPROVED: '已通过',
    REJECTED: '已拒绝',
    PUBLISHED: '已发布',
    OFFLINE: '已下架'
  };
  return map[status] ?? status;
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