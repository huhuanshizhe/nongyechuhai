import Image from 'next/image';
import { Link } from '../i18n/routing';

export function OriginEvidence({ locale }: { locale: string }) {
  const zh = locale === 'zh';
  return (
    <section className="ft-origin-evidence ft-section">
      <div className="ft-container">
        <div className="ft-heading">
          <div>
            <span className="ft-section-label">
              {zh
                ? '青藏高原 · 青海特色产区'
                : 'Qinghai · A distinctive corner of the plateau'}
            </span>
            <h2>
              {zh ? '山川有个性，食材有来处。' : 'A place you can taste.'}
            </h2>
          </div>
          <p>
            {zh
              ? '从柴达木的枸杞，到高原冷水中的虹鳟。认识产区，发现新的产品可能。'
              : 'From Qaidam goji berries to cold-water rainbow trout. Explore a region with a distinctive food identity.'}
          </p>
        </div>
        <div className="ft-origin-editorials">
          <article>
            <div className="ft-origin-photo">
              <Image
                src="/images/brand-v2/hengtai-about.png"
                alt={
                  zh
                    ? '衡源萃官网展示的青海海西枸杞产区'
                    : 'Goji-growing landscape in Haixi, Qinghai, shown by Hengyuancui'
                }
                fill
                sizes="(max-width: 800px) 100vw, 50vw"
              />
              <span>QINGHAI / GOJI</span>
            </div>
            <div className="ft-origin-body">
              <span className="ft-section-label">
                {zh ? '柴达木枸杞' : 'Goji from Qaidam'}
              </span>
              <h3>
                {zh
                  ? '小小红果，鲜明产地。'
                  : 'Small berries. A strong sense of place.'}
              </h3>
              <p>
                {zh
                  ? '让产地成为产品故事的一部分。探索干枸杞及相关食品的规格、包装与应用，寻找适合您品牌的选择。'
                  : 'Make origin part of your product story. Explore dried goji formats, packaging and food applications for your brand.'}
              </p>
              <div className="ft-origin-numbers">
                <div>
                  <strong>{zh ? '45.23万亩' : '≈30,153 ha'}</strong>
                  <span>
                    {zh ? '青海省枸杞种植面积' : 'Goji planted in Qinghai'}
                  </span>
                </div>
                <div>
                  <strong>{zh ? '20万亩' : '≈13,333 ha'}</strong>
                  <span>
                    {zh
                      ? '绿色有机认证面积*'
                      : 'Green Food / organic certified area*'}
                  </span>
                </div>
              </div>
              <p className="ft-origin-note">
                {zh
                  ? '2025 年 9 月公开披露。*绿色与有机认证的合并口径，非全部有机认证。'
                  : 'Disclosed September 2025; converted from 452,300 / 200,000 mu. *Combined Green Food / organic category, not exclusively organic.'}
              </p>
              <Link href="/collections/goji" className="ft-text-link">
                {zh ? '探索枸杞产品' : 'Explore goji berries'} →
              </Link>
            </div>
          </article>
          <article>
            <div className="ft-origin-photo">
              <Image
                src="/images/brand-v2/rainbow-trout-editorial.png"
                alt={
                  zh
                    ? '虹鳟整鱼与鱼片，品类示意'
                    : 'Illustrative rainbow trout and fillet portions on ice'
                }
                fill
                sizes="(max-width: 800px) 100vw, 50vw"
              />
              <span>QINGHAI / RAINBOW TROUT</span>
            </div>
            <div className="ft-origin-body">
              <span className="ft-section-label">
                {zh ? '高原冷水鱼 · 虹鳟' : 'Cold-water rainbow trout'}
              </span>
              <h3>
                {zh
                  ? '来自高原水域的另一种风味。'
                  : 'Another side of plateau food.'}
              </h3>
              <p>
                {zh
                  ? '虹鳟为青海的特色食品产业增添了水产选择。以具体产品的加工形态、冷链与目的地要求，开启采购讨论。'
                  : 'Rainbow trout adds a seafood dimension to Qinghai’s food landscape. Start a conversation around product formats, cold-chain needs and destination requirements.'}
              </p>
              <div className="ft-origin-numbers">
                <div>
                  <strong>{zh ? '3.8亿元以上' : 'RMB 380m+'}</strong>
                  <span>
                    {zh
                      ? '2025 年青海冷水鱼（虹鳟鱼）出口额'
                      : 'Qinghai rainbow-trout exports, 2025'}
                  </span>
                </div>
              </div>
              <p className="ft-origin-note">
                {zh
                  ? '区域产业介绍，非现货供应承诺；供应与目的地条件须另行确认。图片为品类示意。'
                  : 'Regional industry spotlight, not a stock offer. Supplier availability and destination requirements need confirmation. Illustrative image.'}
              </p>
              <Link
                href="/sourcing?topic=rainbow-trout"
                className="ft-text-link"
              >
                {zh ? '讨论采购需求' : 'Discuss your requirements'} →
              </Link>
            </div>
          </article>
        </div>
        <details className="ft-origin-sources">
          <summary>
            {zh ? '数据口径与来源' : 'Regional figures & sources'}
          </summary>
          <p>
            {zh
              ? '枸杞数据为青海省 2025 年 9 月披露值。“绿色有机认证面积”为合并口径，不等同于全部取得有机认证。冷水鱼出口额为 2025 全年数据。以上均为青海省区域统计，不代表 Farmetra 或供应伙伴的产能、认证或出口业绩。'
              : 'Goji figures: Qinghai provincial disclosure, September 2025. “Green Food / organic” is the source’s combined category, not an exclusively organic-certified area. 15 mu = 1 hectare. Trout exports cover 2025. These are Qinghai regional statistics, not Farmetra or supplier capacity, certification or export results.'}
          </p>
          <a
            href="https://www.qinghai.gov.cn/zwgk/system/2025/09/19/030081965.shtml"
            target="_blank"
            rel="noopener noreferrer"
          >
            {zh
              ? '青海省政府 · 产区数据（2025）'
              : 'Qinghai Government · Regional agriculture (2025)'}{' '}
            ↗
          </a>
          <a
            href="https://www.qhio.gov.cn/system/2026/01/29/030510597.shtml"
            target="_blank"
            rel="noopener noreferrer"
          >
            {zh
              ? '青海省新闻发布会 · 外贸工作（2026 年 1 月）'
              : 'Qinghai press briefing · Foreign trade (January 2026)'}{' '}
            ↗
          </a>
        </details>
      </div>
    </section>
  );
}

export function OriginPrinciples({ locale }: { locale: string }) {
  const zh = locale === 'zh';
  const items = zh
    ? [
        [
          '自然风土',
          '讲清食材的来处。',
          '以具体产区、原料、风味与加工方式认识食物。配方与品质特征，以每一款产品的资料为依据。',
        ],
        [
          '食品安全',
          '以产品与批次为依据。',
          '采购讨论围绕适用的检测、生产管理与追溯资料展开，并核对目的地要求。',
        ],
        [
          '有机认证',
          '有机，有据可查。',
          '有机选项按具体供应商、产品、有效证书与适用市场确认，不将区域优势作为所有产品的认证。',
        ],
      ]
    : [
        [
          'NATURAL CHARACTER',
          'Character rooted in place.',
          'Explore the place, ingredients, flavour and processing behind each food. Ingredient and processing details are discussed product by product.',
        ],
        [
          'FOOD SAFETY',
          'Product-specific evidence.',
          'Discuss applicable testing, production controls and traceability records for the product and batch, alongside destination requirements.',
        ],
        [
          'ORGANIC OPTIONS',
          'Organic, where certified.',
          'Organic options depend on the supplier, product, valid certificate and destination market. Regional credentials are not certification for every product.',
        ],
      ];
  return (
    <section className="ft-container ft-section ft-origin-principles">
      <div>
        <span className="ft-section-label">
          {zh
            ? '产地有故事，品质有依据'
            : 'A sense of place. A basis for trust.'}
        </span>
        <h2>
          {zh
            ? '自然的底色，可信的选择。'
            : 'Nature shapes the story. Evidence supports the choice.'}
        </h2>
      </div>
      <div className="ft-origin-principle-grid">
        {items.map(([label, title, text], i) => (
          <article key={label}>
            <span className="ft-principle-number">0{i + 1}</span>
            <span className="ft-section-label">{label}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
