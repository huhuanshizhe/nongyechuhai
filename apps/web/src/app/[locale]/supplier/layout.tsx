import { setRequestLocale } from 'next-intl/server';
import { Link } from '../../../i18n/routing';
import { auth } from '../../../auth';
import { getSupplierProfile } from './actions';
import type { ReactNode } from 'react';

type SupplierLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function SupplierLayout({ children, params }: SupplierLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await auth();
  const supplier = await getSupplierProfile();

  const isZh = locale === 'zh';

  if (!session?.user) {
    return (
      <main className="page-shell">
        <section className="section-block" data-rise="true">
          <div className="not-found-card">
            <span className="section-kicker">{isZh ? '访问受限' : 'Access denied'}</span>
            <h3>{isZh ? '需要供应商账户' : 'Supplier account required'}</h3>
            <p>{isZh ? '请登录供应商账户以访问后台。' : 'Please sign in with a supplier account.'}</p>
            <div className="button-row">
              <Link className="button" href="/login">{isZh ? '登录' : 'Sign in'}</Link>
              <Link className="button button--ghost" href="/">{isZh ? '返回首页' : 'Back to home'}</Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!supplier) {
    return (
      <main className="page-shell">
        <section className="section-block" data-rise="true">
          <div className="not-found-card">
            <span className="section-kicker">{isZh ? '访问受限' : 'Access denied'}</span>
            <h3>{isZh ? '无供应商权限' : 'No supplier access'}</h3>
            <p>{isZh ? '您的账户未关联供应商组织。' : 'Your account is not associated with a supplier organization.'}</p>
            <div className="button-row">
              <Link className="button button--ghost" href="/">{isZh ? '返回首页' : 'Back to home'}</Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (supplier.status !== 'APPROVED') {
    const statusText = {
      PENDING: isZh ? '审核中' : 'Pending review',
      REJECTED: isZh ? '已拒绝' : 'Rejected',
      SUSPENDED: isZh ? '已暂停' : 'Suspended'
    };

    return (
      <main className="page-shell">
        <section className="section-block" data-rise="true">
          <div className="not-found-card">
            <span className="section-kicker">{isZh ? '账户状态' : 'Account status'}</span>
            <h3>{isZh ? '供应商账户未激活' : 'Supplier account inactive'}</h3>
            <p>{isZh ? `当前状态: ${statusText[supplier.status]}` : `Current status: ${statusText[supplier.status]}`}</p>
            {supplier.rejectionReason && (
              <p className="text-muted">{supplier.rejectionReason}</p>
            )}
            <div className="button-row">
              <Link className="button button--ghost" href="/">{isZh ? '返回首页' : 'Back to home'}</Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell page-shell--admin">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__header">
          <span className="section-kicker">{isZh ? '供应商后台' : 'Supplier portal'}</span>
          <h2>{supplier.organization?.name ?? (isZh ? '供应商工作台' : 'Supplier Dashboard')}</h2>
        </div>
        <nav className="admin-nav">
          <Link className="admin-nav__item" href="/supplier">{isZh ? '仪表盘' : 'Dashboard'}</Link>
          <Link className="admin-nav__item" href="/supplier/profile">{isZh ? '供应商资料' : 'Profile'}</Link>
          <Link className="admin-nav__item" href="/supplier/products">{isZh ? '产品管理' : 'Products'}</Link>
          <Link className="admin-nav__item" href="/supplier/inquiries">{isZh ? '询盘管理' : 'Inquiries'}</Link>
        </nav>
        <div className="admin-sidebar__footer">
          <Link className="button button--ghost" href="/">{isZh ? '返回网站' : 'Back to site'}</Link>
        </div>
      </aside>
      <div className="admin-content">
        {children}
      </div>
    </main>
  );
}