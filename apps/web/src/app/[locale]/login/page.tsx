import { setRequestLocale } from 'next-intl/server';
import { Link } from '../../../i18n/routing';
import { auth } from '../../../auth';
import { signInAction } from './actions';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buyer Login',
  description: 'Access your sourcing workspace and inquiry history.'
};

export default async function LoginPage({ params, searchParams }: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const resolvedSearchParams = await searchParams;
  const session = await auth();
  const isZh = locale === 'zh';

  // If already logged in, redirect to account
  if (session?.user) {
    return (
      <main className="page-shell">
        <section className="section-block" data-rise="true">
          <div className="section-head">
            <span className="section-kicker">{isZh ? '已登录' : 'Already signed in'}</span>
            <h1 className="section-title">{isZh ? '欢迎回来' : 'Welcome back'}</h1>
            <p>{session.user.email}</p>
          </div>
          <div className="button-row">
            <Link className="button" href="/account">
              {isZh ? '进入买家工作台' : 'Go to Buyer Workspace'}
            </Link>
            <Link className="button button--ghost" href="/products">
              {isZh ? '浏览产品目录' : 'Browse Portfolio'}
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const errorMessage = resolvedSearchParams.error === 'CredentialsSignin'
    ? (isZh ? '登录信息无效，请重试。' : 'Invalid credentials. Please try again.')
    : null;

  return (
    <main className="page-shell">
      <section className="auth-layout" data-rise="true">
        <div className="auth-story">
          <div className="section-head">
            <span className="section-kicker">{isZh ? '买家登录' : 'Buyer login'}</span>
            <h1 className="section-title">{isZh ? '访问采购工作台及询盘记录' : 'Access your sourcing workspace and inquiry history'}</h1>
            <p className="section-description">
              {isZh
                ? '注册买家可在工作台追踪询盘进度及供应商跟进状态。'
                : 'Registered buyers can track inquiry progress and supplier follow-up status in the workspace.'}
            </p>
          </div>
        </div>

        <section className="auth-form-panel">
          <div className="section-head">
            <h2>{isZh ? '登录账户' : 'Sign in'}</h2>
          </div>

          {errorMessage ? (
            <div className="warning-banner">
              <p>{errorMessage}</p>
            </div>
          ) : null}

          <form action={signInAction} className="form-grid">
            <div className="field field--full">
              <label htmlFor="email">{isZh ? '电子邮箱' : 'Email address'}</label>
              <input
                id="email"
                name="email"
                placeholder="buyer@company.com"
                required
                type="email"
              />
            </div>

            <div className="field field--full">
              <label htmlFor="password">{isZh ? '密码' : 'Password'}</label>
              <input
                id="password"
                name="password"
                required
                type="password"
              />
            </div>

            <div className="submit-row field--full">
              <button className="button" type="submit">
                {isZh ? '登录' : 'Sign in'}
              </button>
              <Link className="button button--ghost" href="/rfq">
                {isZh ? '无需登录直接询盘' : 'Inquiry without login'}
              </Link>
            </div>
          </form>
        </section>
      </section>
    </main>
  );
}