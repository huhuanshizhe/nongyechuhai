import type { ReactNode } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { adminNavItems } from '@nongyechuhai/ui';
import { auth } from '../../auth';
import { signOutAction } from './actions';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  const sessionUser = session?.user as
    | {
        role?: string;
        name?: string | null;
        email?: string | null;
      }
    | undefined;

  if (!sessionUser || sessionUser.role !== 'ADMIN') {
    redirect('/login');
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <span className="eyebrow">Admin</span>
        <h1>农业出海后台</h1>
        <p className="muted">围绕供应商审核、商品治理、询盘流转和内容发布四条主链运营。</p>
        <div className="session-card">
          <strong>{sessionUser.name || sessionUser.email}</strong>
          <span>{sessionUser.email}</span>
        </div>
        <ul>
          {adminNavItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
        <form action={signOutAction}>
          <button className="secondary-button" type="submit">
            退出登录
          </button>
        </form>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}
