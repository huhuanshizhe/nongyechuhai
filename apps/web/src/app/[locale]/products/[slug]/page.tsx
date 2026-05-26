import { setRequestLocale } from 'next-intl/server';
import { Link } from '../../../../i18n/routing';
import { getProductDetail, type StorefrontProductDetail } from '../../../../lib/storefront';
import { auth } from '../../../../auth';
import type { Metadata } from 'next';

type ProductDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

type DetailCard = {
  label: string;
  title: string;
  body: string;
};

type DetailStep = {
  title: string;
  body: string;
};

type DetailFaq = {
  question: string;
  answer: string;
};

type ProductDetailViewModel = {
  displayName: string;
  breadcrumbName: string;
  displayCategory: string;
  heroKicker: string;
  displaySummary: string;
  routeNote: string;
  supplierLabel: string;
  supplierLocation: string;
  supplierDescription: string;
  priceCaption: string;
  priceNote: string;
  galleryNote: string;
  mediaFocusTitle: string;
  mediaFocusItems: string[];
  supportImageLabel: string;
  detailTitle: string;
  detailIntro: string;
  detailSpecs: Array<{
    label: string;
    value: string;
  }>;
  sectionTitle: string;
  sectionDescription: string;
  briefCards: DetailCard[];
  decisionCards: DetailCard[];
  workflowSteps: DetailStep[];
  faqItems: DetailFaq[];
  richDescriptionHtml: string;
  closingTitle: string;
};

function getLocaleCode(locale: string) {
  return locale === 'zh' ? 'zh-CN' : 'en-US';
}

function getProductName(slug: string, fallbackName: string, locale: string) {
  if (locale !== 'zh') {
    return fallbackName;
  }

  const nameMap: Record<string, string> = {
    'fresh-jiaobai-stems': '鲜茭白出口项目',
    'green-asparagus-spears': '绿芦笋',
    'chinese-mitten-crab': '中华绒螯蟹',
    'halal-curry-chicken-ready-meal': '清真咖喱鸡即食餐'
  };

  return nameMap[slug] || fallbackName;
}

function getCategoryName(categoryName: string, locale: string) {
  if (locale !== 'zh') {
    return categoryName;
  }

  const categoryMap: Record<string, string> = {
    'Specialty Vegetables': '特色蔬菜',
    'Prepared food': '预制食品',
    Tea: '茶叶',
    'Premium Mushrooms': '精品菌菇'
  };

  return categoryMap[categoryName] || categoryName;
}

function getUiCopy(locale: string) {
  const isZh = locale === 'zh';

  return {
    notFoundKicker: isZh ? '未找到产品' : 'Product not found',
    notFoundTitle: isZh ? '该产品不存在或已下线。' : 'This product does not exist or has been removed.',
    notFoundBody: isZh ? '请返回目录浏览其他出口项目。' : 'Please browse other products in the portfolio.',
    backToPortfolio: isZh ? '返回产品目录' : 'Back to portfolio',
    workspace: isZh ? '买家中心' : 'My workspace',
    catalogCrumb: isZh ? '出口产品' : 'Products',
    supplierVerified: isZh ? '已认证供应商' : 'Verified supplier',
    inquiryButton: isZh ? '发起询盘' : 'Request quote',
    addToInquiry: isZh ? '加入当前询盘' : 'Add to existing inquiry',
    supplierProgram: isZh ? '供应与交付' : 'Supply and delivery',
    referenceModel: isZh ? '项目型号' : 'Program reference',
    workflowKicker: isZh ? '采购建议' : 'Buying guidance',
    detailKicker: isZh ? '产品信息' : 'Product brief',
    faqTitle: isZh ? '常见问题' : 'Frequently asked questions',
    relatedKicker: isZh ? '相关产品' : 'Related products',
    relatedTitle: isZh ? '可一并讨论的同品类产品' : 'Other products in this category',
    viewDetails: isZh ? '查看详情' : 'View details',
    fitKicker: isZh ? '采购适配' : 'Buying fit',
    fitTitle: isZh ? '适合哪些采购场景' : 'Best-fit buying scenarios',
    closingKicker: isZh ? '下一步' : 'Next move',
    continueBrowsing: isZh ? '继续浏览' : 'Continue browsing',
    startInquiry: isZh ? '开始询盘' : 'Start inquiry'
  };
}

function buildGenericViewModel(product: StorefrontProductDetail, locale: string): ProductDetailViewModel {
  const isZh = locale === 'zh';
  const displayName = getProductName(product.slug, product.name, locale);

  return {
    displayName,
    breadcrumbName: displayName,
    displayCategory: getCategoryName(product.categoryName, locale),
    heroKicker: isZh ? '出口项目档案' : 'Export product dossier',
    displaySummary: product.summary,
    routeNote: product.tradeModeDescription,
    supplierLabel: isZh ? '供应项目' : 'Supplier program',
    supplierLocation: product.supplierLocation,
    supplierDescription: product.supplierDescription || product.tradeModeDescription,
    priceCaption: isZh
      ? (product.tradeModeTone === 'inquiry' ? '参考采购区间' : '参考价格')
      : (product.tradeModeTone === 'inquiry' ? 'Reference buying range' : 'Reference price'),
    priceNote: isZh
      ? '可先用该区间评估采购预算；正式报价会结合规格、包装配置、目的地市场与交付条件进一步确认。'
      : 'Final pricing should be confirmed against specification, pack format, destination market, and delivery conditions.',
    galleryNote: isZh
      ? '可重点查看产品外观、规格表现与包装方向，最终出货以确认批次为准。'
      : 'Imagery is intended to help buyers judge presentation, packaging direction, and program positioning before final shipment confirmation.',
    mediaFocusTitle: isZh ? '看图可先确认' : 'What to confirm from the images',
    mediaFocusItems: product.specHighlights.slice(0, 3).map((spec) => `${spec.label}：${spec.value}`),
    supportImageLabel: isZh ? '细节近景' : 'Detail close-up',
    detailTitle: isZh ? '采购规格与项目说明' : 'Commercial specification and program brief',
    detailIntro: isZh
      ? '以下信息适合用于首轮判断产品适配度，细项建议通过询盘继续确认。'
      : 'Use the following information for first-pass fit assessment, then confirm the commercial details through the inquiry desk.',
    detailSpecs: product.specHighlights,
    sectionTitle: isZh ? '买家首轮应确认什么' : 'What buyers should align first',
    sectionDescription: isZh
      ? '真正影响成交效率的通常不是页面上的单一价格，而是规格、窗口和履约条件是否先对齐。'
      : 'What shapes buying speed is rarely a single price point. It is whether specification, window, and fulfillment conditions are aligned early.',
    briefCards: product.specHighlights.slice(0, 3).map((spec) => ({
      label: spec.label,
      title: spec.value,
      body: isZh ? '建议作为首轮询盘里的确认项。' : 'Use this as an opening alignment point in the buyer brief.'
    })),
    decisionCards: isZh
      ? [
          {
            label: '买家匹配',
            title: '先看渠道适配度',
            body: '确认目标渠道是否真的需要这类产品，再进入包装、规格与交付节奏的讨论。'
          },
          {
            label: '商务重点',
            title: '先对齐规格与到货窗口',
            body: '对于出口项目，提前明确目标市场和到货时点会显著提升报价与履约准确度。'
          },
          {
            label: '询盘建议',
            title: '把需求一次说明清楚',
            body: '建议在首轮询盘中同步说明规格、包装、目的港和数量预期，便于更快进入有效报价。'
          }
        ]
      : [
          {
            label: 'Buyer fit',
            title: 'Validate the channel first',
            body: 'Confirm the target channel really needs this line before going deeper on packaging, specs, and timing.'
          },
          {
            label: 'Commercial focus',
            title: 'Align specification and arrival window',
            body: 'For export-led programs, clarity on market and arrival timing materially improves quote accuracy.'
          },
          {
            label: 'Platform role',
            title: 'Convert demand into an executable brief',
            body: 'We bridge supplier capability, packaging, and delivery conditions before a buyer proceeds.'
          }
        ],
    workflowSteps: isZh
      ? [
          {
            title: '确认采购目标',
            body: '明确目标市场、销售渠道与预估节奏，判断是否适合立即启动。'
          },
          {
            title: '锁定规格与包装',
            body: '把产品形态、规格偏好和包装形式放进同一轮讨论，避免报价反复。'
          },
          {
            title: '核对物流与单证',
            body: '结合目的地冷链、时效与市场要求，判断项目是否具备履约条件。'
          },
          {
            title: '输出正式询盘',
            body: '在需求清晰后再进入询盘，可获得更接近真实成交条件的回复。'
          }
        ]
      : [
          {
            title: 'Confirm the buying objective',
            body: 'Clarify market, channel, and buying cadence before moving deeper into the line.'
          },
          {
            title: 'Lock the specification and pack',
            body: 'Bring form factor, size, and pack format into the same early discussion to avoid quote churn.'
          },
          {
            title: 'Check logistics and documents',
            body: 'Validate cold-chain, timing, and market requirements before committing the route.'
          },
          {
            title: 'Submit the formal inquiry',
            body: 'Once the brief is clear, the inquiry desk can respond against a more executable scenario.'
          }
        ],
    faqItems: product.faqItems,
    richDescriptionHtml: product.richDescriptionHtml,
    closingTitle: isZh ? `准备开始${displayName.replace('出口项目', '')}询盘？` : `Ready to request a quote for ${displayName}?`
  };
}

function getProductViewModel(product: StorefrontProductDetail, locale: string): ProductDetailViewModel {
  if (locale === 'zh' && product.slug === 'fresh-jiaobai-stems') {
    return {
      displayName: '鲜茭白',
      breadcrumbName: '鲜茭白',
      displayCategory: '江南水生特色蔬菜',
      heroKicker: '江南时令水生蔬菜',
      displaySummary: '来自苏州与湖州水田基地的鲜茭白，采后 6 小时内完成预冷，以 5kg 冷藏纸箱为标准出口形式，适合亚洲商超、精品食材分销与中餐餐饮供应链。',
      routeNote: '建议先确认采收窗口、包装配置、目的港冷链接续和预计周转节奏，再进入正式询价。',
      supplierLabel: '供应与交付',
      supplierLocation: '苏州，中国',
      supplierDescription: '由江南水田基地组织采收与初段预冷，可按买家需求进一步协调包装形式、冷链安排和出运节奏。',
      priceCaption: '参考采购区间',
      priceNote: '可先用该区间评估采购预算；实际报价会随采收周、到港城市、包装形式和出运安排调整。',
      galleryNote: '可重点查看茭白的白度、切口洁净度、表面水润感和冷藏包装方向。',
      mediaFocusTitle: '看图可先确认',
      mediaFocusItems: [
        '切口是否洁净，白度是否均匀。',
        '表面是否保持新鲜水润感，未出现明显失水。',
        '包装方向是否适合 5kg 冷藏纸箱或零售托盘。'
      ],
      supportImageLabel: '切口与水润状态',
      detailTitle: '采购规格与项目说明',
      detailIntro: '鲜茭白是时令冷链项目，先判断产区与包装是否匹配，再进入到港时效、再分装和首票单证沟通。',
      detailSpecs: [
        {
          label: '预冷与冷链',
          value: '采后 6 小时内预冷'
        },
        {
          label: '包装形式',
          value: '5kg 冷藏纸箱 / 零售托盘可选'
        },
        {
          label: '产区',
          value: '苏州与湖州水田基地'
        },
        {
          label: '采收窗口',
          value: '时令鲜采'
        }
      ],
      sectionTitle: '买家首轮要先确认的四件事',
      sectionDescription: '鲜品项目的成交效率取决于窗口、规格和履约协同，下面这四步比单纯问价更关键。',
      briefCards: [
        {
          label: '产区与货源',
          title: '苏州 / 湖州时令采收',
          body: '适合需要江南特色蔬菜、且能接受季节性采购窗口的买家。'
        },
        {
          label: '预冷与保鲜',
          title: '采后 6 小时内预冷',
          body: '降低氧化和失水风险，帮助目的港到货后仍保持脆嫩质地。'
        },
        {
          label: '包装方式',
          title: '5kg 冷藏纸箱，可支持再分装',
          body: '标准箱适合批发与分销，零售托盘方案可在询盘阶段一并确认。'
        }
      ],
      decisionCards: [
        {
          label: '适配渠道',
          title: '亚洲商超与精品餐饮更匹配',
          body: '鲜茭白不是大众通货，更适合有明确亚洲菜系需求、重视差异化蔬菜结构的采购渠道。'
        },
        {
          label: '商务重点',
          title: '先对齐窗口、规格和到港节奏',
          body: '建议在第一轮询盘中说明到货周别、规格偏好、目的港城市和预估采购量。'
        },
        {
          label: '履约判断',
          title: '这是冷链协同项目，不是单纯比价品',
          body: '建议先确认目的港冷链承接条件和出运可行性，再推进正式报价与下单安排。'
        }
      ],
      workflowSteps: [
        {
          title: '确认采收窗口',
          body: '结合目标销售周、到港时间和季节性供货节奏，先判断本轮采购是否合适。'
        },
        {
          title: '锁定规格与包装',
          body: '明确切口、长度偏好、5kg 纸箱或零售托盘方案，避免报价后再频繁返工。'
        },
        {
          title: '评估冷链路径',
          body: '确认目的港、清关条件和落地仓配接续，判断鲜度风险是否可控。'
        },
        {
          title: '输出正式询盘',
          body: '在需求清晰后进入平台询盘，由我们汇总供应、单证与交付条件。'
        }
      ],
      faqItems: [
        {
          question: '为什么页面展示的是参考采购区间，而不是固定单价？',
          answer: '鲜茭白属于时令鲜品，价格会随着采收周、目的港、包装方式和冷链安排变化。页面区间用于帮助买家判断项目体量，正式报价应在询盘中结合实际需求确认。'
        },
        {
          question: '第一次询盘最好提供哪些信息？',
          answer: '建议至少提供目标市场、预计到货时间、包装偏好、月度或单批采购量，以及是否需要零售托盘或目的港再分装支持。'
        }
      ],
      richDescriptionHtml:
        '<p>鲜茭白，又称水竹、菰笋，是江南地区具有代表性的水生蔬菜。其优势在于脆嫩口感、清甜风味，以及对亚洲餐饮、特色零售和精品食材渠道的适配度。</p><p>采购这类时令鲜品时，重点通常不只是产地信息，而是采后预冷速度、失水控制、冷链衔接和标准包装是否稳定。本项目以采后 6 小时内预冷、5kg 冷藏纸箱出运为基础，更适合对鲜度和到货表现有明确要求的买家。</p><p>首次询盘建议同步说明采收窗口、包装形式、目的港时效和再分装需求。这样获得的报价与交付方案，会更接近真实可执行的采购条件。</p>',
      closingTitle: '准备开始鲜茭白询盘？'
    };
  }

  return buildGenericViewModel(product, locale);
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const product = await getProductDetail(slug, getLocaleCode(locale));
  const isZh = locale === 'zh';

  if (product) {
    const viewModel = getProductViewModel(product.product, locale);

    return {
      title: isZh && slug === 'fresh-jiaobai-stems'
        ? '鲜茭白出口项目'
        : product.product.seoTitle || viewModel.displayName || (isZh ? '产品详情' : 'Product Details'),
      description: isZh && slug === 'fresh-jiaobai-stems'
        ? '鲜茭白出口项目页，围绕采收窗口、预冷要求、包装方式与冷链履约条件组织展示，适合亚洲零售、分销与餐饮买家。'
        : product.product.seoDescription || product.product.summary || (isZh ? '查看带有出口信息的产品详情。' : 'View product details with export information.')
    };
  }

  return {
    title: isZh ? '产品详情' : 'Product Details',
    description: isZh ? '查看带有出口信息的产品详情。' : 'View product details with export information.'
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const copy = getUiCopy(locale);
  const session = await auth();

  const productDetail = await getProductDetail(slug, getLocaleCode(locale));

  if (!productDetail) {
    return (
      <main className="page-shell">
        <section className="section-block" data-rise="true">
          <div className="not-found-card">
            <span className="section-kicker">{copy.notFoundKicker}</span>
            <h3>{copy.notFoundTitle}</h3>
            <p>{copy.notFoundBody}</p>
            <div className="button-row">
              <Link className="button" href="/products">
                {copy.backToPortfolio}
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const { product, relatedProducts } = productDetail;
  const viewModel = getProductViewModel(product, locale);

  return (
    <main className="page-shell page-shell--detail">
      <section data-rise="true">
        <div className="detail-toolbar">
          <div className="breadcrumb-row">
            <Link href="/products">{copy.catalogCrumb}</Link>
            <span>/</span>
            <span>{viewModel.breadcrumbName}</span>
          </div>
          <div className="detail-toolbar__actions">
            <Link className="button button--ghost" href="/products">
              {copy.backToPortfolio}
            </Link>
            {session?.user && (
              <Link className="button button--ghost" href="/account">
                {copy.workspace}
              </Link>
            )}
          </div>
        </div>

        <article className="detail-stage">
          <div className="detail-stage__media">
            <span className="section-kicker">{viewModel.heroKicker}</span>
            <div className="detail-stage__hero">
              <img alt={product.primaryImageAlt} src={product.primaryImageUrl} />
            </div>
            {product.gallery.length > 1 ? (
              <div className="detail-stage__support">
                <article className="detail-stage__support-media">
                  <div className="detail-stage__thumb-media">
                    <img alt={product.gallery[1].alt} src={product.gallery[1].url} />
                  </div>
                  <span className="detail-stage__thumb-caption">{viewModel.supportImageLabel}</span>
                </article>
                <div className="detail-stage__support-copy">
                  <span className="section-kicker">{viewModel.mediaFocusTitle}</span>
                  <p>{viewModel.galleryNote}</p>
                  <ul className="detail-stage__checklist">
                    {viewModel.mediaFocusItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
          </div>

          <div className="detail-stage__summary">
            <div className="detail-stage__chips">
              <span className="pill">{viewModel.displayCategory}</span>
              <span className={`product-card__mode product-card__mode--${product.tradeModeTone}`}>{product.tradeModeLabel}</span>
              {product.supplierVerified ? <span className="catalog-chip">{copy.supplierVerified}</span> : null}
            </div>

            <div className="hero-stage__headline">
              <h1 className="hero-title">{viewModel.displayName}</h1>
              <p className="hero-stage__lead">{viewModel.displaySummary}</p>
              <p className="hero-stage__body">{viewModel.routeNote}</p>
            </div>

            <div className="detail-stage__pricebox">
              <span className="detail-stage__price-label">{viewModel.priceCaption}</span>
              <p className="detail-price">{product.priceLabel}</p>
              <p className="detail-aux">{viewModel.priceNote}</p>
              {product.model ? <span className="catalog-chip">{copy.referenceModel}: {product.model}</span> : null}
            </div>

            <div className="detail-stage__brief">
              <span className="section-kicker">{viewModel.supplierLabel}</span>
              <h2>{product.supplierName}</h2>
              <p>{viewModel.supplierDescription}</p>
              <div className="button-row">
                <span className="catalog-chip">{viewModel.supplierLocation}</span>
                {product.supplierVerified ? <span className="catalog-chip">{copy.supplierVerified}</span> : null}
              </div>
            </div>

            <div className="detail-stage__briefs">
              {viewModel.briefCards.map((card) => (
                <article className="detail-mini-card" key={card.label}>
                  <span className="section-kicker">{card.label}</span>
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                </article>
              ))}
            </div>

            {product.variants.length > 0 ? (
              <div className="detail-stage__brief">
                <span className="section-kicker">{locale === 'zh' ? '可选规格' : 'Available variants'}</span>
                <ul className="detail-variant-list">
                  {product.variants.slice(0, 3).map((variant) => (
                    <li key={variant.sku}>
                      <strong>{variant.title}</strong>
                      <p className="detail-aux">{variant.priceLabel}</p>
                      <p className="detail-aux">{variant.stockLabel}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="detail-action-row">
              <Link className="button" href={`/rfq?product=${slug}`}>
                {copy.inquiryButton}
              </Link>
              {session?.user && (
                <Link className="button button--ghost" href={`/rfq?product=${slug}`}>
                  {copy.addToInquiry}
                </Link>
              )}
            </div>
          </div>
        </article>
      </section>

      <section className="section-card" data-rise="true">
        <div className="section-head">
          <span className="section-kicker">{copy.workflowKicker}</span>
          <h2>{viewModel.sectionTitle}</h2>
          <p className="section-description">{viewModel.sectionDescription}</p>
        </div>
        <div className="process-rail">
          {viewModel.workflowSteps.map((step, index) => (
            <article className="process-rail__item" key={step.title}>
              <span className="process-index">{String(index + 1).padStart(2, '0')}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="detail-story-grid" data-rise="true">
        <div className="section-card">
          <div className="section-head">
            <span className="section-kicker">{copy.detailKicker}</span>
            <h2>{viewModel.detailTitle}</h2>
            <p className="section-description">{viewModel.detailIntro}</p>
          </div>
          <div className="detail-spec-grid">
            {viewModel.detailSpecs.map((spec) => (
              <article key={spec.label} className="detail-spec-card">
                <strong>{spec.label}</strong>
                <em>{spec.value}</em>
              </article>
            ))}
          </div>
          <div className="detail-rich-copy" dangerouslySetInnerHTML={{ __html: viewModel.richDescriptionHtml }} />
        </div>

        <aside className="section-card">
          <div className="section-head">
            <span className="section-kicker">{copy.fitKicker}</span>
            <h2>{copy.fitTitle}</h2>
          </div>
          <div className="statement-rail">
            {viewModel.decisionCards.map((card) => (
              <article key={card.label}>
                <span className="section-kicker">{card.label}</span>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </article>
            ))}
          </div>
        </aside>
      </section>

      {viewModel.faqItems.length > 0 ? (
        <section className="section-card" data-rise="true">
          <div className="section-head">
            <h2>{copy.faqTitle}</h2>
          </div>
          <ul className="detail-faq">
            {viewModel.faqItems.map((faq) => (
              <li key={faq.question}>
                <strong>{faq.question}</strong>
                <p>{faq.answer}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {relatedProducts.length > 0 ? (
        <section data-rise="true">
          <div className="section-head">
            <span className="section-kicker">{copy.relatedKicker}</span>
            <h2>{copy.relatedTitle}</h2>
          </div>
          <div className="product-grid">
            {relatedProducts.slice(0, 3).map((relatedProduct) => (
              <article className="product-card" key={relatedProduct.slug}>
                <div className="product-card__media">
                  <img alt={relatedProduct.primaryImageAlt} src={relatedProduct.primaryImageUrl} />
                </div>
                <div className="product-card__body">
                  <span className="product-card__category">{getCategoryName(relatedProduct.categoryName, locale)}</span>
                  <h3>{getProductName(relatedProduct.slug, relatedProduct.name, locale)}</h3>
                  <Link className="product-card__link" href={`/products/${relatedProduct.slug}`}>
                    {copy.viewDetails}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="closing-banner" data-rise="true">
        <div>
          <span className="section-kicker">{copy.closingKicker}</span>
          <h2 className="section-title">{viewModel.closingTitle}</h2>
        </div>
        <div className="button-row">
          <Link className="button" href={`/rfq?product=${slug}`}>
            {copy.startInquiry}
          </Link>
          <Link className="button button--ghost" href="/products">
            {copy.continueBrowsing}
          </Link>
        </div>
      </section>
    </main>
  );
}