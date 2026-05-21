import { setRequestLocale } from 'next-intl/server';
import { Link } from '../../../i18n/routing';
import { auth } from '../../../auth';
import type { ReactNode } from 'react';

type AdminLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AdminLayout({ children, params }: AdminLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await auth();

  const isAdmin = session?.user?.email?.includes('admin') || session?.user?.email?.includes('@farmetra.com');

  if (!session?.user || !isAdmin) {
    return (
      <main className="page-shell">
        <section className="section-block" data-rise="true">
          <div className="not-found-card">
            <span className="section-kicker">Access denied</span>
            <h3>Admin access required.</h3>
            <p>Please sign in with an admin account.</p>
            <div className="button-row">
              <Link className="button" href="/login">Sign in</Link>
              <Link className="button button--ghost" href="/">Back to home</Link>
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
          <span className="section-kicker">Admin panel</span>
          <h2>Management</h2>
        </div>
        <nav className="admin-nav">
          <Link className="admin-nav__item admin-nav__item--active" href="/admin/inquiries">Inquiry review</Link>
          <Link className="admin-nav__item" href="/admin/suppliers">Supplier management</Link>
          <Link className="admin-nav__item" href="/admin/products">Product review</Link>
        </nav>
        <div className="admin-sidebar__footer">
          <Link className="button button--ghost" href="/">Back to site</Link>
        </div>
      </aside>
      <div className="admin-content">
        {children}
      </div>
    </main>
  );
}