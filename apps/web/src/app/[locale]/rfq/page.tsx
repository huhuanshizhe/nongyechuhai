import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '../../../i18n/routing';
import { auth } from '../../../auth';
import { submitInquiryAction } from './actions';
import { getRfqPageData, type StorefrontProductCard } from '../../../lib/storefront';
import { RfqFormExperience } from './rfq-form-experience';

type RfqPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    product?: string;
    submitted?: string;
    reference?: string;
    error?: string;
  }>;
};

export const metadata: Metadata = {
  title: 'Buyer Inquiry Desk',
  description: 'Send a structured buyer inquiry with product, market, and commercial context already captured.'
};

export const revalidate = 300;

function getErrorMessage(isZh: boolean, error?: string) {
  switch (error) {
    case 'missing-fields':
      return isZh ? '请完成必填的联系、市场及需求字段后提交。' : 'Please complete the required contact, market, and requirement fields before submitting.';
    case 'invalid-email':
      return isZh ? '请输入有效的商务邮箱地址。' : 'Please enter a valid business email address.';
    case 'no-supplier':
      return isZh ? '当前询盘路径暂无可用供应商。' : 'No active supplier is currently available for this inquiry path.';
    default:
      return null;
  }
}

export default async function RfqPage({ params, searchParams }: RfqPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isZh = locale === 'zh';

  const resolvedSearchParams = await searchParams;
  const [data, session] = await Promise.all([getRfqPageData(resolvedSearchParams.product), auth()]);
  const errorMessage = getErrorMessage(isZh, resolvedSearchParams.error);

  return (
    <main className="page-shell">
      {resolvedSearchParams.submitted === '1' ? (
        <section className="success-banner" data-rise="true">
          <span className="section-kicker">{isZh ? '询盘已提交' : 'Inquiry submitted'}</span>
          <strong>{resolvedSearchParams.reference || (isZh ? '询盘已创建' : 'Inquiry created')}</strong>
          <p className="catalog-intro">
            {isZh
              ? '您的需求已存储，等待供应商跟进、内部审核及报价处理。'
              : 'Your request is now stored for coordinated supplier follow-up, internal review, and next-step quotation handling.'}
          </p>
          <div className="button-row">
            <Link className="button" href="/products">
              {isZh ? '继续浏览产品目录' : 'Continue reviewing portfolio'}
            </Link>
            <Link className="button button--ghost" href="/rfq">
              {isZh ? '发送另一个询盘' : 'Send another inquiry'}
            </Link>
          </div>
        </section>
      ) : null}

      {errorMessage ? (
        <section className="warning-banner" data-rise="true">
          <span className="section-kicker">{isZh ? '提交需注意' : 'Submission needs attention'}</span>
          <strong>{isZh ? '审核表单详情' : 'Review the form details'}</strong>
          <p className="catalog-intro">{errorMessage}</p>
        </section>
      ) : null}

      <section className="rfq-layout" data-rise="true">
        <section className="rfq-form-panel">
          <form action={submitInquiryAction} className="form-grid">
            <RfqFormExperience
              locale={locale}
              selectedProduct={data.selectedProduct as StorefrontProductCard | null}
              defaultName={session?.user?.name ?? ''}
              defaultEmail={session?.user?.email ?? ''}
            />

            <div className="field field--full">
              <small>
                {isZh
                  ? '发送此询盘将创建买家端记录，用于供应商及管理员跟进协调。'
                  : 'By sending this inquiry, you create a buyer-side record for coordinated supplier and admin follow-up.'}
                {session?.user ? (isZh ? ' 该登录账户将关联到询盘记录。' : ' This signed-in account will also be linked to the inquiry history.') : ''}
              </small>
            </div>

            <div className="submit-row field--full">
              <button className="button" type="submit">
                {isZh ? '提交买家询盘' : 'Submit buyer inquiry'}
              </button>
              <Link className="button button--ghost" href="/products">
                {isZh ? '返回产品目录' : 'Back to portfolio'}
              </Link>
            </div>
          </form>
        </section>
      </section>
    </main>
  );
}