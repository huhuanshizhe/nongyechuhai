import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '../../../i18n/routing';
import { auth } from '../../../auth';
import { submitInquiryAction } from './actions';
import { getRfqPageData, type StorefrontProductCard } from '../../../lib/storefront';

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

  const processSteps = isZh ? [
    '选择最接近的产品线或从更广泛的品类需求开始。',
    '一次性提交目的地市场、数量、包装形式、认证及商业备注。',
    '平台将买家简报路由到相关供应商项目及管理员审核团队。',
    '合格询盘可进入报价跟进及订单协调阶段。'
  ] : [
    'Select the closest showcase line or start from a broader category request.',
    'Share destination market, quantity, pack format, certification, and commercial notes once.',
    'The platform routes the buyer brief to the relevant supplier program and admin review team.',
    'Qualified requests can proceed into quotation follow-up and order coordination.'
  ];

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
        <article className="rfq-story">
          <div className="section-head">
            <span className="section-kicker">{isZh ? '询盘中心' : 'Inquiry desk'}</span>
            <h1 className="section-title">{isZh
              ? '面向专业农产品买家及出口讨论的询盘表单。'
              : 'An inquiry form shaped for professional agriculture buyers and export discussions.'}
            </h1>
            <p className="section-description">
              {isZh
                ? '一次性提交产品、市场、数量、包装及文档需求。同一买家简报可支持供应商跟进、内部审核及报价讨论。'
                : 'Capture product, market, volume, pack, and documentation needs once. The same buyer brief can then support supplier follow-up, internal review, and quotation discussion.'}
            </p>
          </div>
          <div className="rfq-summary">
            <strong>{isZh ? '接下来会发生什么' : 'What happens next'}</strong>
            <ul className="process-list">
              {processSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </div>
          <div className="rfq-summary">
            <strong>{isZh ? '建议准备的信息' : 'Recommended information to prepare'}</strong>
            <ul className="promise-list">
              <li>{isZh ? '目标进口市场及首选国际贸易术语。' : 'Target import market and preferred incoterm.'}</li>
              <li>{isZh ? '包装期望、自有品牌需求及文档约束。' : 'Packaging expectation, private label needs, and documentation constraints.'}</li>
              <li>{isZh ? '初次试单量与后续集装箱计划。' : 'Initial trial quantity versus repeat container plan.'}</li>
            </ul>
          </div>
          <div className="rfq-summary">
            <strong>{isZh ? '已选产品' : 'Selected product'}</strong>
            <p>
              {data.selectedProduct
                ? `${data.selectedProduct.name} · ${data.selectedProduct.tradeModeLabel}`
                : (isZh ? '未预选产品。您仍可从一般出口需求开始。' : 'No product preselected. You can still start from a general export request.')}
            </p>
          </div>
          {session?.user ? (
            <div className="rfq-summary">
              <strong>{isZh ? '已登录买家' : 'Signed-in buyer'}</strong>
              <p>{session.user.name || session.user.email} · {isZh ? '您的询盘也将出现在买家工作台供后续跟进。' : 'your inquiry will also appear in Buyer Workspace for later follow-up.'}</p>
            </div>
          ) : null}
        </article>

        <section className="rfq-form-panel">
          <div className="section-head">
            <span className="section-kicker">{isZh ? '结构化询盘' : 'Structured inquiry'}</span>
            <h2>{isZh ? '提交买家简报' : 'Submit the buyer brief'}</h2>
          </div>
          <form action={submitInquiryAction} className="form-grid">
            <input type="hidden" name="locale" value={locale} />
            <div className="field field--full">
              <label htmlFor="productSlug">{isZh ? '目标产品' : 'Target product'}</label>
              <select defaultValue={data.selectedProduct?.slug ?? ''} id="productSlug" name="productSlug">
                <option value="">{isZh ? '一般出口需求' : 'General export request'}</option>
                {data.products.map((product: StorefrontProductCard) => (
                  <option key={product.slug} value={product.slug}>
                    {product.name} · {product.tradeModeLabel}
                  </option>
                ))}
              </select>
              <small>{isZh ? '选择最接近的当前产品线，或留空提交更广泛的出口需求。' : 'Choose the closest current showcase line, or leave blank for a broader export request.'}</small>
            </div>

            <div className="field">
              <label htmlFor="customerName">{isZh ? '联系人姓名' : 'Contact name'}</label>
              <input
                defaultValue={session?.user?.name ?? ''}
                id="customerName"
                name="customerName"
                placeholder={isZh ? '张明' : 'Amelia Harper'}
                required
                type="text"
              />
            </div>

            <div className="field">
              <label htmlFor="customerCompany">{isZh ? '公司名称' : 'Company'}</label>
              <input id="customerCompany" name="customerCompany" placeholder={isZh ? '海港贸易公司' : 'Harbor Foods Trading'} type="text" />
            </div>

            <div className="field">
              <label htmlFor="customerEmail">{isZh ? '商务邮箱' : 'Business email'}</label>
              <input
                defaultValue={session?.user?.email ?? ''}
                id="customerEmail"
                name="customerEmail"
                placeholder="buyer@company.com"
                required
                type="email"
              />
            </div>

            <div className="field">
              <label htmlFor="customerPhone">{isZh ? '电话/WhatsApp' : 'Phone / WhatsApp'}</label>
              <input id="customerPhone" name="customerPhone" placeholder="+65 ..." type="text" />
            </div>

            <div className="field">
              <label htmlFor="customerCountry">{isZh ? '目的地市场' : 'Destination market'}</label>
              <input id="customerCountry" name="customerCountry" placeholder={isZh ? '新加坡' : 'Singapore'} required type="text" />
            </div>

            <div className="field">
              <label htmlFor="quantityRequested">{isZh ? '目标数量' : 'Target quantity'}</label>
              <input id="quantityRequested" min="1" name="quantityRequested" placeholder="2000" type="number" />
            </div>

            <div className="field">
              <label htmlFor="targetPrice">{isZh ? '目标单价' : 'Target unit price'}</label>
              <input id="targetPrice" min="0" name="targetPrice" placeholder="135.00" step="0.01" type="number" />
            </div>

            <div className="field">
              <label htmlFor="currency">{isZh ? '货币' : 'Currency'}</label>
              <select defaultValue="USD" id="currency" name="currency">
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="CNY">CNY</option>
                <option value="SGD">SGD</option>
                <option value="AED">AED</option>
              </select>
            </div>

            <div className="field field--full">
              <label htmlFor="requirements">{isZh ? '需求说明' : 'Requirements'}</label>
              <textarea id="requirements" name="requirements" placeholder={isZh
                ? '描述规格、包装、目的地市场、预期交期及任何文档约束。'
                : 'Describe specifications, packaging, destination market, expected lead time, and any documentation constraints.'} required />
            </div>

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