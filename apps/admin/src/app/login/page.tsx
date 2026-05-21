import type { Metadata } from 'next';
import { loginAction } from './actions';

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export const metadata: Metadata = {
  title: 'Admin Login'
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <main className="auth-screen">
      <section className="auth-card">
        <span className="eyebrow">Admin Access</span>
        <h1>登录农业出海后台</h1>
        <p className="muted">仅限后台运营账号访问供应商、商品、询盘和内容工作台。</p>
        {resolvedSearchParams.error ? (
          <div className="auth-error">账号、密码或角色不匹配。</div>
        ) : null}
        <form action={loginAction} className="auth-form">
          <label>
            <span>邮箱</span>
            <input name="email" placeholder="admin@company.com" required type="email" />
          </label>
          <label>
            <span>密码</span>
            <input name="password" placeholder="••••••••" required type="password" />
          </label>
          <button className="primary-button" type="submit">
            进入后台
          </button>
        </form>
      </section>
    </main>
  );
}