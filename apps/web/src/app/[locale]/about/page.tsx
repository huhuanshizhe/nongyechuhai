import { setRequestLocale } from 'next-intl/server';
import { Link } from '../../../i18n/routing';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about farmetra\'s approach to agricultural export sourcing and supplier qualification.'
};

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isZh = locale === 'zh';

  return (
    <main className="page-shell">
      <section className="section-block" data-rise="true">
        <div className="section-head">
          <span className="section-kicker">{isZh ? '关于我们' : 'About'}</span>
          <h1 className="section-title">
            {isZh
              ? 'farmetra将农产品采购转化为结构化的跨境销售工作流'
              : 'How farmetra turns agricultural sourcing into a structured cross-border sales workflow'}
          </h1>
          <p className="section-description">
            {isZh
              ? '产品发现、供应商资质、出口文档、冷链规划及买家跟进整合为一个操作系统。'
              : 'Product discovery, supplier qualification, export documentation, cold-chain planning, and buyer follow-up are presented as one operating system.'}
          </p>
        </div>

        <div className="editorial-panel editorial-panel--statement">
          <div className="editorial-panel__copy">
            <h2>{isZh ? '平台定位' : 'Platform Positioning'}</h2>
            <p>
              {isZh
                ? 'farmetra不是杂乱的B2B市场列表。我们面向进口商、分销商、零售采购团队及机构买家，提供经过筛选的农产品供应项目，每个产品线都有品类逻辑、供应商背景及商业路线框架。'
                : 'farmetra is not a cluttered B2B marketplace listing. We present vetted agricultural supply programs for importers, distributors, retail sourcing teams, and institutional buyers. Each supply line is framed with category logic, supplier context, and commercial route before quotation discussion begins.'}
            </p>
            <p>
              {isZh
                ? '买家可以审核包装、合规方向及执行适配，无需翻阅杂乱的通用市场信息。平台将采购、文档、冷链规划及跟进整合为统一的商业工作流。'
                : 'Importers and sourcing teams can review packaging, compliance direction, and execution fit without digging through generic marketplace clutter. The platform presents sourcing, documentation, cold-chain planning, and follow-up as one commercial workflow.'}
            </p>
          </div>
        </div>

        <div className="statement-rail">
          <article>
            <span className="pill">{isZh ? '供应商筛选' : 'Supplier Qualification'}</span>
            <h3>{isZh ? '认证项目展示' : 'Vetted Program Presentation'}</h3>
            <p>
              {isZh
                ? '供应商展示经过筛选，体现商业规范而非堆砌无差异化列表。'
                : 'Supplier representation is curated to signal commercial discipline, not to inflate the catalog with undifferentiated listings.'}
            </p>
          </article>
          <article>
            <span className="pill">{isZh ? '买家工作流' : 'Buyer Workflow'}</span>
            <h3>{isZh ? '结构化询盘' : 'Structured Inquiry'}</h3>
            <p>
              {isZh
                ? '市场、数量、认证、包装及交付需求在同一对话链中保持追踪。'
                : 'Market, quantity, certification, packaging, and delivery requirements remain attached to the same conversation from first brief to follow-up.'}
            </p>
          </article>
          <article>
            <span className="pill">{isZh ? '响应承诺' : 'Response Commitment'}</span>
            <h3>{isZh ? '48小时首次响应' : '48-Hour First Response'}</h3>
            <p>
              {isZh
                ? '询盘处理保持市场、包装及交付上下文从首次询盘开始。'
                : 'Inquiry handling is structured to preserve market, pack, and delivery context from the first brief.'}
            </p>
          </article>
        </div>

        <div className="button-row">
          <Link className="button" href="/products">
            {isZh ? '浏览出口产品' : 'Explore Export Portfolio'}
          </Link>
          <Link className="button button--ghost" href="/rfq">
            {isZh ? '发起询盘' : 'Start Inquiry'}
          </Link>
        </div>
      </section>
    </main>
  );
}