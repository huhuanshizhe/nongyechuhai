import { getLocale } from 'next-intl/server';
import Link from 'next/link';

export default async function NotFound() {
  const locale = await getLocale();
  const isZh = locale === 'zh';

  return (
    <main className="page-shell">
      <section className="not-found-card" data-rise="true">
        <div className="not-found-card__icon">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="2" opacity="0.2" />
            <path d="M32 20v12M32 40v4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
        <span className="section-kicker">{isZh ? '页面未找到' : 'Page not found'}</span>
        <h1>{isZh
          ? '您请求的页面或产品在当前出口展示中已不存在。'
          : 'The page or product you requested is no longer available in the current export presentation.'}</h1>
        <p>
          {isZh
            ? '产品目录可能已更新，或该产品已停止发布。请返回出口产品目录，从活跃品类或询盘中心继续浏览。'
            : 'The portfolio may have been updated, or the product may no longer be published. Return to the export portfolio and continue from an active category or inquiry route.'}
        </p>
        <div className="button-row">
          <Link className="button" href="/products">
            {isZh ? '返回产品目录' : 'Back to portfolio'}
          </Link>
          <Link className="button button--ghost" href="/rfq">
            {isZh ? '前往询盘中心' : 'Open inquiry desk'}
          </Link>
          <Link className="button button--ghost" href="/">
            {isZh ? '返回首页' : 'Back to home'}
          </Link>
        </div>
      </section>
    </main>
  );
}
