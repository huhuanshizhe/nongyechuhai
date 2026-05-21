import { setRequestLocale } from 'next-intl/server';
import { Link } from '../../../i18n/routing';
import { auth } from '../../../auth';
import { getBuyerInquiries } from '../../../lib/storefront';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buyer Workspace',
  description: 'Your sourcing workspace and inquiry history.'
};

export default async function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await auth();
  const isZh = locale === 'zh';

  // Redirect to login if not authenticated
  if (!session?.user) {
    return (
      <main className="page-shell">
        <section className="section-block" data-rise="true">
          <div className="section-head">
            <span className="section-kicker">{isZh ? '买家工作台' : 'Buyer workspace'}</span>
            <h1 className="section-title">{isZh ? '请先登录' : 'Please sign in'}</h1>
            <p className="section-description">
              {isZh
                ? '访问买家工作台需先登录账户。'
                : 'Access your sourcing workspace and inquiry history by signing in.'}
            </p>
          </div>
          <div className="button-row">
            <Link className="button" href="/login">
              {isZh ? '买家登录' : 'Sign in'}
            </Link>
            <Link className="button button--ghost" href="/products">
              {isZh ? '浏览产品目录' : 'Browse portfolio'}
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const inquiries = await getBuyerInquiries(session.user.id!);

  return (
    <main className="page-shell">
      <section className="section-block" data-rise="true">
        <div className="section-head">
          <span className="section-kicker">{isZh ? '买家工作台' : 'Buyer workspace'}</span>
          <h1 className="section-title">{isZh ? `欢迎回来，${session.user.name || session.user.email}` : `Welcome back, ${session.user.name || session.user.email}`}</h1>
          <p className="section-description">
            {isZh
              ? '追踪询盘进度、供应商跟进状态及报价审核。'
              : 'Track inquiry progress, supplier follow-up status, and quotation review.'}
          </p>
        </div>

        <section className="dashboard-section">
          <div className="section-head">
            <h2>{isZh ? '我的询盘' : 'My Inquiries'}</h2>
          </div>

          {inquiries.length > 0 ? (
            <div className="inquiry-list">
              {inquiries.map((inquiry) => (
                <article className="inquiry-card" key={inquiry.id}>
                  <div className="inquiry-card__head">
                    <span className="pill">{isZh
                      ? (inquiry.status === 'pending' ? '待处理' :
                         inquiry.status === 'reviewing' ? '审核中' :
                         inquiry.status === 'quoted' ? '已报价' :
                         inquiry.status === 'accepted' ? '已接受' :
                         inquiry.status === 'rejected' ? '已拒绝' : '已完成')
                      : inquiry.status}</span>
                    <span className="inquiry-card__date">
                      {inquiry.createdAt.toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US')}
                    </span>
                  </div>
                  <div className="inquiry-card__body">
                    <h3>{inquiry.productName || (isZh ? '一般出口需求' : 'General export request')}</h3>
                    <p>{inquiry.requirements}</p>
                  </div>
                  <div className="inquiry-card__meta">
                    <span>{isZh ? `目的地：${inquiry.destinationCountry}` : `Destination: ${inquiry.destinationCountry}`}</span>
                    {inquiry.quantityRequested && <span>{isZh ? `数量：${inquiry.quantityRequested}` : `Quantity: ${inquiry.quantityRequested}`}</span>}
                  </div>
                  <div className="inquiry-card__actions">
                    <Link className="button button--ghost" href={`/account/inquiries/${inquiry.id}`}>
                      {isZh ? '查看详情' : 'View details'}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="section-kicker">{isZh ? '暂无询盘' : 'No inquiries yet'}</span>
              <p>{isZh ? '您尚未提交任何询盘。浏览产品目录并发起询盘开始采购。' : 'You haven\'t submitted any inquiries yet. Browse the portfolio and start your sourcing journey.'}</p>
              <Link className="button" href="/products">
                {isZh ? '浏览产品目录' : 'Explore portfolio'}
              </Link>
            </div>
          )}
        </section>

        <div className="button-row">
          <Link className="button" href="/rfq">
            {isZh ? '发起新询盘' : 'New inquiry'}
          </Link>
          <Link className="button button--ghost" href="/products">
            {isZh ? '浏览产品目录' : 'Browse portfolio'}
          </Link>
        </div>
      </section>
    </main>
  );
}