import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '../../auth';
import { loginAction } from './actions';

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export const metadata: Metadata = {
  title: 'Buyer Login',
  description: 'Sign in to review RFQs, orders, and ongoing sourcing activity.'
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const [resolvedSearchParams, session] = await Promise.all([searchParams, auth()]);

  if (session?.user) {
    redirect('/account');
  }

  return (
    <main className="page-shell auth-layout">
      <section className="auth-panel" data-rise="true">
        <div className="section-head">
          <span className="section-kicker">Buyer login</span>
          <h1 className="section-title">Return to your RFQs, quotes, and active orders.</h1>
          <p className="section-description">
            Buyer login keeps inquiry history, quote progress, and seeded order visibility tied to one procurement-facing account.
          </p>
        </div>

        {resolvedSearchParams.error ? (
          <div className="warning-banner auth-banner">
            <strong>Login failed</strong>
            <p className="catalog-intro">Please confirm the buyer email, password, and account role.</p>
          </div>
        ) : null}

        <form action={loginAction} className="form-grid auth-form-grid">
          <div className="field field--full">
            <label htmlFor="email">Business email</label>
            <input id="email" name="email" placeholder="buyer@nongyechuhai.local" required type="email" />
          </div>
          <div className="field field--full">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" placeholder="Admin123!" required type="password" />
          </div>
          <div className="submit-row field--full">
            <button className="button" type="submit">
              Open buyer account
            </button>
            <Link className="button button--ghost" href="/rfq">
              Continue without login
            </Link>
          </div>
        </form>

        <div className="auth-note">
          <strong>Local demo account</strong>
          <p>Use buyer@nongyechuhai.local with password Admin123! to verify the seeded buyer workflow.</p>
        </div>
      </section>
    </main>
  );
}