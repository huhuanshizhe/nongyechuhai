import type { ReactNode } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { supplierNavItems } from '@nongyechuhai/ui';
import { auth } from '../../auth';
import { signOutAction } from './actions';
import { getSupplierWorkspace } from '../../lib/supplier-data';

export default async function SupplierLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  const sessionUser = session?.user as
    | {
        id?: string;
        role?: string;
        name?: string | null;
        email?: string | null;
      }
    | undefined;

  if (!sessionUser || sessionUser.role !== 'SUPPLIER' || !sessionUser.id) {
    redirect('/login');
  }

  const workspace = await getSupplierWorkspace(sessionUser.id);

  if (!workspace) {
    redirect('/login');
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <span className="eyebrow">Supplier</span>
        <h1>供应商中心</h1>
        <p className="muted">围绕商品可见性、询盘跟进和订单推进三个核心任务协同工作。</p>
        <div className="session-card">
          <strong>{workspace.organizationName}</strong>
          <span>{sessionUser.name || sessionUser.email}</span>
          <span>{workspace.location}</span>
          <span>{workspace.verificationLabel}</span>
        </div>
        <ul>
          {supplierNavItems.map((item) => (
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
