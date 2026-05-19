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
  title: 'Buyer Workspace Access',
  description: 'Sign in to review inquiries, quotations, and export order coordination in one buyer workspace.'
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
          <span className="section-kicker">Buyer access</span>
          <h1 className="section-title">Access your buyer workspace for inquiries, quotations, and export follow-up.</h1>
          <p className="section-description">
            Sign in to keep inquiry history, supplier replies, quotation progress, and order coordination in one buyer-facing record.
          </p>
        </div>

        {resolvedSearchParams.error ? (
          <div className="warning-banner auth-banner">
            <strong>Login failed</strong>
            <p className="catalog-intro">Please confirm the buyer email, password, and account role assigned to this workspace.</p>
          </div>
        ) : null}

        <form action={loginAction} className="form-grid auth-form-grid">
          <div className="field field--full">
            <label htmlFor="email">Business email</label>
            <input id="email" name="email" placeholder="buyer@importcompany.com" required type="email" />
          </div>
          <div className="field field--full">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" placeholder="Enter your password" required type="password" />
          </div>
          <div className="submit-row field--full">
            <button className="button" type="submit">
              Open buyer workspace
            </button>
            <Link className="button button--ghost" href="/rfq">
              Continue as guest buyer
            </Link>
          </div>
        </form>

        <div className="auth-note">
          <strong>Presentation access</strong>
          <p>Buyer workspace access is enabled for approved reviewers in the current presentation environment.</p>
        </div>
      </section>
    </main>
  );
}