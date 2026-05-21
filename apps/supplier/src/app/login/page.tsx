import type { Metadata } from 'next';
import { loginAction } from './actions';

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export const metadata: Metadata = {
  title: 'Supplier Login'
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <main className="auth-screen supplier-auth-screen">
      <section className="auth-card supplier-auth-card">
        <span className="eyebrow">Supplier Access</span>
        <h1>登录供应商中心</h1>
        <p className="muted">通过已审核的供应商账号管理商品、询盘和订单跟进。</p>
        {resolvedSearchParams.error ? (
          <div className="auth-error">账号、密码或角色不匹配。</div>
        ) : null}
        <form action={loginAction} className="auth-form">
          <label>
            <span>邮箱</span>
            <input name="email" placeholder="supplier@company.com" required type="email" />
          </label>
          <label>
            <span>密码</span>
            <input name="password" placeholder="••••••••" required type="password" />
          </label>
          <button className="primary-button" type="submit">
            进入供应商中心
          </button>
        </form>
      </section>
    </main>
  );
}