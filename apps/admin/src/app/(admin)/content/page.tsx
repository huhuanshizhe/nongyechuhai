import { getAdminContentPageData } from '../../../lib/admin-data';

export const dynamic = 'force-dynamic';

export default async function ContentPage() {
  const content = await getAdminContentPageData();

  return (
    <section className="page-stack">
      <div className="page-hero">
        <span className="eyebrow">Content</span>
        <h1 className="hero-title">内容管理</h1>
        <p className="muted">当前页面已经能看见内容页发布状态，以及 FAQ 资产挂载到页面或商品的方式。</p>
      </div>
      <div className="split-grid">
        <section className="section-panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">CMS Pages</span>
              <h2>内容页</h2>
            </div>
          </div>
          <div className="data-list">
            {content.pages.map((item) => (
              <article className="data-row" key={item.slug}>
                <div className="data-row__main">
                  <strong>{item.title}</strong>
                  <p>/{item.slug}</p>
                  <span>{item.locale} · {item.faqCount} FAQ linked</span>
                </div>
                <div className="data-row__aside">
                  <span className={`status-chip status-chip--${item.statusTone}`}>{item.status}</span>
                  <span>updated {item.updatedAt}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section-panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">FAQ inventory</span>
              <h2>FAQ 资产</h2>
            </div>
          </div>
          <div className="data-list">
            {content.faqItems.map((item) => (
              <article className="data-row" key={item.question}>
                <div className="data-row__main">
                  <strong>{item.question}</strong>
                  <p>{item.target}</p>
                  <span>{item.locale}</span>
                </div>
                <div className="data-row__aside">
                  <span className={`status-chip status-chip--${item.publishedTone}`}>{item.publishedLabel}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
