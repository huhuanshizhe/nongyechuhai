import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '../../i18n/routing';
import { ProductCard } from '../../components/ProductCard';
import { getHomepageData, getStorefrontShellData } from '../../lib/storefront';

const platformStandardsEn = [
  {
    title: 'Vetted program structure',
    description: 'Each supply line is framed with category logic, supplier context, and commercial route before a quotation discussion begins.'
  },
  {
    title: 'Buyer-facing qualification',
    description: 'Importers and sourcing teams can review packaging, compliance direction, and execution fit without digging through generic marketplace clutter.'
  },
  {
    title: 'Cross-border execution discipline',
    description: 'The platform presents sourcing, documentation, cold-chain planning, and follow-up as one commercial workflow rather than disconnected steps.'
  }
];

const platformStandardsZh = [
  {
    title: '认证项目结构',
    description: '每个供应线在报价讨论开始前都配有品类逻辑、供应商背景及商业路线框架。'
  },
  {
    title: '面向买家的资质认证',
    description: '进口商和采购团队可以审核包装、合规方向及执行适配，无需翻阅杂乱的通用市场列表。'
  },
  {
    title: '跨境执行规范',
    description: '平台将采购、文档、冷链规划及跟进整合为一个商业工作流，而非零散步骤。'
  }
];

const buyerChecklistEn = [
  {
    title: 'Scope check',
    description: 'Confirm product family, supplier origin, pack format, and whether the line is inquiry-led or already priced for direct review.'
  },
  {
    title: 'Execution support',
    description: 'See whether export coordination, customs handling, and cold-chain requirements are already in scope.'
  },
  {
    title: 'Inquiry readiness',
    description: 'Know what to send in your brief so the first supplier reply is commercially usable, not generic.'
  }
];

const buyerChecklistZh = [
  {
    title: '范围确认',
    description: '确认产品类别、供应商产地、包装形式，以及该产品是询盘驱动还是已定价直采。'
  },
  {
    title: '执行支持',
    description: '查看出口协调、清关处理及冷链需求是否已纳入服务范围。'
  },
  {
    title: '询盘准备',
    description: '了解如何在询盘中提供有效信息，确保供应商首次回复具有商业价值而非泛泛之谈。'
  }
];

const workflowEn = [
  {
    step: '01',
    title: 'Review the right category and origin',
    description: 'Start from the export family that matches the buyer brief before narrowing into a specific showcase line.'
  },
  {
    step: '02',
    title: 'Open the export profile',
    description: 'Use specification highlights, origin notes, and route labels to assess whether the line fits your current commercial stage.'
  },
  {
    step: '03',
    title: 'Submit the buyer brief',
    description: 'Send market, quantity, pack format, and certification needs through a single structured inquiry form.'
  },
  {
    step: '04',
    title: 'Coordinate quote and execution follow-up',
    description: 'Qualified requests can continue into quotation review, sample planning, and order coordination without restarting the conversation.'
  }
];

const workflowZh = [
  {
    step: '01',
    title: '审核品类与产地',
    description: '从符合买家需求的出口品类开始，再细化到具体产品展示线。'
  },
  {
    step: '02',
    title: '查看出口档案',
    description: '使用规格摘要、产地说明及路线标签评估产品是否符合当前商业阶段。'
  },
  {
    step: '03',
    title: '提交买家询盘',
    description: '通过单一结构化询盘表单发送市场、数量、包装形式及认证需求。'
  },
  {
    step: '04',
    title: '协调报价与执行跟进',
    description: '合格询盘可直接进入报价审核、样品规划及订单协调，无需重复沟通。'
  }
];

export const revalidate = 300;

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');
  const isZh = locale === 'zh';

  const [homeData, shellData] = await Promise.all([getHomepageData(), getStorefrontShellData()]);
  const [heroPrimaryProduct, ...heroSecondaryProducts] = homeData.featuredProducts;

  const platformStandards = isZh ? platformStandardsZh : platformStandardsEn;
  const buyerChecklist = isZh ? buyerChecklistZh : buyerChecklistEn;
  const workflow = isZh ? workflowZh : workflowEn;

  const credibilitySignals = [
    {
      label: isZh ? '认证项目' : 'Vetted programs',
      value: `${shellData.approvedSupplierCount}`,
      description: isZh ? '已面向买家展示的供应商项目。' : 'Supplier programs already positioned for buyer-facing review.'
    },
    {
      label: isZh ? '产品品类' : 'Product families',
      value: `${shellData.activeCategoryCount}`,
      description: isZh ? '正规农业品类分类，而非杂乱列表。' : 'Formal agricultural categories, not miscellaneous listing clusters.'
    },
    {
      label: isZh ? '买家就绪产品' : 'Buyer-ready lines',
      value: `${shellData.publishedProductCount}`,
      description: isZh ? '发布的产品配有可见路线、规格及下一步逻辑。' : 'Published products with visible route, specifications, and next-step logic.'
    },
    {
      label: isZh ? '响应目标' : 'Response target',
      value: isZh ? '48小时响应' : '48h response target',
      description: isZh ? '询盘处理保持市场、包装及交付上下文从首次询盘开始。' : 'Inquiry handling is structured to preserve market, pack, and delivery context from the first brief.'
    }
  ];

  const marketLanes = isZh ? [
    { title: '进口商与分销商', description: '买家在开启报价讨论前比较产地、路线及执行就绪状态。' },
    { title: '零售采购团队', description: '团队审核包装线、标签适配、货架形式及供应商跟进能力。' },
    { title: '餐饮及机构买家', description: '采购团队需要清晰的路线标签、产品背景及交付支持。' }
  ] : [
    { title: 'Importers and distributors', description: 'Buyers comparing origin, route, and execution readiness before opening a quotation discussion.' },
    { title: 'Retail sourcing teams', description: 'Teams reviewing packaged lines, labeling fit, shelf formats, and supplier follow-up capability.' },
    { title: 'Foodservice and institutional buyers', description: 'Procurement teams that need clear route labels, product context, and delivery support before samples move.' }
  ];

  return (
    <main className="page-shell page-shell--home">
      <section className="hero-stage" data-rise="true">
        <div className="hero-stage__main">
          <div className="hero-stage__eyebrow">
            <span className="section-kicker">{isZh ? '全球农业销售平台' : 'Global agricultural sales platform'}</span>
            <span className="hero-stage__tag">{isZh ? '中国供应项目 • 买家认证 • 出口交付' : 'China supply programs • buyer qualification • export delivery'}</span>
          </div>
          <div className="hero-stage__headline">
            <h1 className="hero-title">{t('hero.title')}</h1>
            <p className="hero-stage__lead">{t('hero.subtitle')}</p>
            <p className="hero-stage__body">{t('hero.description')}</p>
          </div>
          <div className="hero-stage__actions button-row">
            <Link className="button" href="/products">
              {isZh ? '浏览出口产品目录' : 'Explore export portfolio'}
            </Link>
            <Link className="button button--ghost" href="/rfq">
              {isZh ? '发起买家询盘' : 'Start buyer inquiry'}
            </Link>
          </div>
          <div className="hero-stage__brief">
            <div className="hero-stage__brief-head">
              <span className="pill">{isZh ? '买家快速指南' : 'Buyer quick brief'}</span>
              <p>
                {isZh
                  ? '界面结构让买家一次性评估采购适配、路线可见性及询盘就绪状态，无需翻阅杂乱的产品墙。'
                  : 'The interface is structured so buyers can judge sourcing fit, route visibility, and inquiry readiness in one pass instead of decoding a cluttered listing wall.'}
              </p>
            </div>
            <div className="hero-stage__brief-list">
              {buyerChecklist.map((item) => (
                <article className="hero-stage__brief-item" key={item.title}>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="hero-stage__metrics">
            {credibilitySignals.map((item) => (
              <article className="hero-stage__metric" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>

        <aside className="hero-stage__visual">
          {heroPrimaryProduct ? (
            <article className="hero-stage__showcase hero-stage__showcase--primary">
              <div className="hero-stage__showcase-media">
                <img alt={heroPrimaryProduct.primaryImageAlt} src={heroPrimaryProduct.primaryImageUrl} />
              </div>
              <div className="hero-stage__showcase-copy">
                <span className="pill">{isZh ? '精选产地线' : 'Featured origin line'}</span>
                <strong>{heroPrimaryProduct.name}</strong>
                <p>
                  {heroPrimaryProduct.supplierName} • {heroPrimaryProduct.supplierLocation}
                </p>
              </div>
            </article>
          ) : null}
          <div className="hero-stage__showcase-grid">
            {heroSecondaryProducts.slice(0, 2).map((product) => (
              <article className="hero-stage__showcase-card" key={product.slug}>
                <div className="hero-stage__showcase-card-media">
                  <img alt={product.primaryImageAlt} src={product.primaryImageUrl} />
                </div>
                <div className="hero-stage__showcase-card-copy">
                  <strong>{product.name}</strong>
                  <span>{product.categoryName}</span>
                </div>
              </article>
            ))}
          </div>
          <div className="hero-stage__showcase-note">
            <span className="pill">{isZh ? '买家覆盖' : 'Buyer coverage'}</span>
            <p>{isZh
              ? '结构化面向进口商、零售采购团队及机构买家，需要在定价前了解产地、路线及供应商背景。'
              : 'Structured for importers, retail sourcing teams, and institutional buyers that need origin, route, and supplier context before pricing starts.'}</p>
            <div className="hero-stage__showcase-lanes">
              {marketLanes.map((lane) => (
                <span key={lane.title} title={lane.description}>
                  {lane.title}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section className="credibility-strip" data-rise="true">
        {platformStandards.map((item) => (
          <article className="credibility-strip__item" key={item.title}>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
          </article>
        ))}
      </section>

      <section className="section-block section-block--portfolio" data-rise="true">
        <div className="portfolio-head">
          <span className="section-kicker">{isZh ? '精选项目' : 'Featured programs'}</span>
          <div>
            <h2 className="section-title">{isZh
              ? '面向进口商、分销商及机构买家的当前供应线。'
              : 'Current supply lines presented for importers, distributors, and institutional buyers.'}</h2>
            <p className="section-description">
              {isZh
                ? '每张卡片展示产品品类、供应商产地及合适的商业路线，买家无需打开完整出口档案即可判断。'
                : 'Each card signals product family, supplier origin, and the right commercial route before a buyer opens the full export profile.'}
            </p>
          </div>
          <Link className="button button--ghost" href="/products">
            {isZh ? '浏览所有品类' : 'Browse all categories'}
          </Link>
        </div>
        <div className="product-grid">
          {homeData.featuredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="editorial-panel editorial-panel--statement" data-rise="true">
        <div className="editorial-panel__copy">
          <span className="section-kicker">{isZh ? '运营模式' : 'Operating model'}</span>
          <h2 className="section-title">{isZh
            ? 'farmetra如何将农产品采购转化为结构化跨境销售工作流。'
            : 'How farmetra turns agricultural sourcing into a structured cross-border sales workflow.'}</h2>
          <p>
            {isZh
              ? '产品发现、供应商认证、出口文档、冷链规划及买家跟进整合为一个操作系统。让全球买家在开启样品或定价讨论前判断商业就绪状态。'
              : 'Product discovery, supplier qualification, export documentation, cold-chain planning, and buyer follow-up are presented as one operating system. That lets global buyers judge commercial readiness before they open a sampling or pricing discussion.'}
          </p>
          <div className="button-row">
            <Link className="button button--soft" href="/about">
              {isZh ? '了解平台模式' : 'Review platform approach'}
            </Link>
            <Link className="button button--ghost" href="/rfq">
              {isZh ? '开启买家讨论' : 'Open buyer discussion'}
            </Link>
          </div>
        </div>
        <div className="statement-rail">
          <article>
            <span className="pill">{isZh ? '平台覆盖' : 'Platform coverage'}</span>
            <h3>{shellData.activeCategoryCount} {isZh ? '个正规产品品类' : 'formal product families'}</h3>
            <p>{isZh
              ? '产品目录按进口商、代表团及零售采购团队实际审核农业供应的方式分组。'
              : 'The portfolio is grouped the way importers, delegations, and retail sourcing teams actually review agricultural supply.'}</p>
          </article>
          <article>
            <span className="pill">{isZh ? '供应商就绪' : 'Supplier readiness'}</span>
            <h3>{shellData.approvedSupplierCount} {isZh ? '个认证项目' : 'vetted programs'}</h3>
            <p>{isZh
              ? '供应商展示经过筛选，体现商业规范，而非堆砌无差异列表。'
              : 'Supplier representation is curated to signal commercial discipline, not to inflate the catalog with undifferentiated listings.'}</p>
          </article>
          <article>
            <span className="pill">{isZh ? '买家工作流' : 'Buyer workflow'}</span>
            <h3>{isZh ? '统一询盘中心' : 'One inquiry desk'}</h3>
            <p>{isZh
              ? '市场、数量、认证、包装及交付需求从首次询盘到跟进保持同一对话链路。'
              : 'Market, quantity, certification, packaging, and delivery requirements remain attached to the same conversation from first brief to follow-up.'}</p>
          </article>
        </div>
      </section>

      <section className="section-block" id="trade-process" data-rise="true">
        <div className="section-head">
          <span className="section-kicker">{isZh ? '贸易流程' : 'Trade process'}</span>
          <h2 className="section-title">{isZh
            ? '买家旅程设计让认证、定价及执行保持连续推进，无需重复沟通。'
            : 'The buyer journey is designed to keep qualification, pricing, and execution moving without restarting the conversation.'}</h2>
        </div>
        <div className="process-rail">
          {workflow.map((item) => (
            <article className="process-rail__item" key={item.step}>
              <span className="process-index">{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block section-block--categories" data-rise="true">
        <div className="section-head">
          <span className="section-kicker">{isZh ? '品类聚焦' : 'Category focus'}</span>
          <h2 className="section-title">{isZh
            ? '浏览规范产品品类，而非杂乱列表。'
            : 'Navigate disciplined product families, not miscellaneous listing clusters.'}</h2>
        </div>
        <div className="category-board">
          {homeData.featuredCategories.map((category, index) => (
            <article className="category-board__row" key={category.slug}>
              <span className="category-board__index">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <span className="catalog-chip">{category.familyLabel}</span>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </div>
              <Link className="product-card__link" href={`/products?category=${category.slug}`}>
                {isZh ? '浏览此品类' : 'Browse this family'}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="closing-banner" data-rise="true">
        <div>
          <span className="section-kicker">{isZh ? '下一步' : 'Next move'}</span>
          <h2 className="section-title">{isZh
            ? '需要报价、样品规划或市场准入讨论？从询盘中心开始。'
            : 'Need a quotation, sample plan, or market-entry discussion? Start with the buyer desk.'}</h2>
        </div>
        <div className="button-row">
          <Link className="button" href="/rfq">
            {isZh ? '发起买家询盘' : 'Start buyer inquiry'}
          </Link>
          <Link className="button button--earth" href="/products">
            {isZh ? '先浏览产品目录' : 'Review portfolio first'}
          </Link>
        </div>
      </section>
    </main>
  );
}