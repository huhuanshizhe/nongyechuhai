import Image from 'next/image';
import { Link } from '../i18n/routing';
import { localize } from '../lib/highland';
import { buyerTypes, supplyStages } from '../lib/buyer-offerings';

export function SupplyRoutes({ locale }: { locale: string }) {
  const zh = locale === 'zh';
  return (
    <section className="ft-supply-routes ft-section">
      <div className="ft-container">
        <div className="ft-heading">
          <div>
            <span className="ft-section-label">
              {zh ? '采购与开发' : 'Sourcing & development'}
            </span>
            <h2>
              {zh
                ? '买原料，选食品，做自己的品牌。'
                : 'An ingredient. A finished food. Your own brand.'}
            </h2>
          </div>
          <p>
            {zh
              ? '原浆、NFC 果汁、锁鲜果实与谷物，让高原食材有更多产品表达。'
              : 'Purées, NFC juices, preserved berries and grains bring more possibilities to plateau ingredients.'}
          </p>
        </div>
        <div className="ft-supply-route-grid">
          {supplyStages.map((s, i) => (
            <Link key={s.id} href={`/collections?stage=${s.id}#formats`}>
              <span>0{i + 1}</span>
              <h3>{localize(s.name, locale)}</h3>
              <p>{localize(s.copy, locale)}</p>
              <strong>{zh ? '探索产品与方案' : 'Explore formats'} →</strong>
            </Link>
          ))}
        </div>
        <div className="ft-supply-route-footer">
          <span>
            {zh
              ? '您是食品工厂、品牌商、餐饮还是零售采购？'
              : 'Manufacturing, brand building, foodservice or retail?'}
          </span>
          <Link href="/solutions" className="ft-text-link">
            {zh ? '找到适合您的采购方案' : 'Find your sourcing route'} →
          </Link>
        </div>
      </div>
    </section>
  );
}

export function BuyerSegments({ locale }: { locale: string }) {
  const zh = locale === 'zh';
  return (
    <section className="ft-container ft-section">
      <div className="ft-heading">
        <div>
          <span className="ft-section-label">
            {zh ? '为不同客户组织不同方案' : 'Built around your business'}
          </span>
          <h2>
            {zh
              ? '同一种食材，不同的采购方式。'
              : 'One ingredient. Different ways to buy.'}
          </h2>
        </div>
        <p>
          {zh
            ? '从工厂配方到零售货架，产品形式、包装和沟通重点随您的业务改变。'
            : 'From factory formulations to retail shelves, formats, packs and buying points follow the way you work.'}
        </p>
      </div>
      <div className="ft-buyer-segment-grid">
        {buyerTypes.map((b) => (
          <article key={b.id}>
            <div className="ft-buyer-segment-image">
              <Image
                src={`/images/brand-v2/${b.image}`}
                alt={
                  zh
                    ? `${localize(b.name, locale)}食材应用示意`
                    : `Ingredient and application illustration for ${localize(b.name, locale)}`
                }
                fill
                sizes="(max-width: 650px) 100vw, (max-width: 1050px) 50vw, 33vw"
              />
            </div>
            <div className="ft-buyer-segment-body">
              <h3>{localize(b.name, locale)}</h3>
              <p className="ft-buyer-need">{localize(b.need, locale)}</p>
              <p>{localize(b.work, locale)}</p>
              <dl>
                <dt>{zh ? '优先探索' : 'Explore first'}</dt>
                <dd>{localize(b.formats, locale)}</dd>
                <dt>{zh ? '采购沟通内容' : 'Your sourcing conversation'}</dt>
                <dd>{localize(b.output, locale)}</dd>
              </dl>
              <Link
                href={`/collections?buyer=${b.id}#formats`}
                className="ft-text-link"
              >
                {zh ? '查看适合我的产品' : 'See formats for my business'} →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function NutritionProfiles({ locale }: { locale: string }) {
  const zh = locale === 'zh';
  const profiles = [
    {
      name: { zh: '红枸杞', en: 'Red goji' },
      highlight: {
        zh: '类胡萝卜素 · 玉米黄质酯',
        en: 'Carotenoids · Zeaxanthin esters',
      },
      text: {
        zh: '红枸杞研究记录了玉米黄质酯等类胡萝卜素。产品开发可结合果实风味、颜色与具体检测数据组织营养故事。',
        en: 'Red goji research identifies carotenoids including zeaxanthin esters. Build a product story around berry flavour, colour and product-specific analytical data.',
      },
      src: 'https://pubmed.ncbi.nlm.nih.gov/18486400/',
      focus: 'carotenoids',
      image: 'goji-editorial.png',
    },
    {
      name: { zh: '黑枸杞', en: 'Black goji' },
      highlight: {
        zh: '花青素 · 紫色果饮',
        en: 'Anthocyanins · Purple fruit drinks',
      },
      text: {
        zh: '花青素是黑枸杞的重要成分研究方向。为饮品探索颜色、风味与配方差异，同时评估 pH、热处理和储存对色泽的影响。',
        en: 'Anthocyanins are a documented component of black goji. Explore beverage colour, flavour and formulation differences, evaluating pH, heat and storage stability.',
      },
      src: 'https://pubs.rsc.org/en/content/articlehtml/2015/ay/c5ay00612k',
      focus: 'anthocyanins',
      image: 'black-goji-editorial.png',
    },
    {
      name: { zh: '沙棘', en: 'Sea buckthorn' },
      highlight: {
        zh: '维生素 C · 类胡萝卜素 · 明亮酸香',
        en: 'Vitamin C · Carotenoids · Bright acidity',
      },
      text: {
        zh: '沙棘食品研究讨论了维生素 C 与类胡萝卜素构成。酸香、橙色与果肉质地适合延伸到果饮、冰沙和乳制品配方。',
        en: 'Food research describes vitamin C and carotenoids in sea buckthorn. Its acidity, orange colour and pulp texture offer routes into drinks, smoothies and dairy recipes.',
      },
      src: 'https://pubmed.ncbi.nlm.nih.gov/10552673/',
      focus: 'vitamin-c',
      image: 'sea-buckthorn-editorial.png',
    },
    {
      name: { zh: '刺梨', en: 'Chestnut rose' },
      highlight: {
        zh: '维生素 C · 复合果饮研究',
        en: 'Vitamin C · Fruit-blend development',
      },
      text: {
        zh: '刺梨汁研究记录了维生素 C 等成分及储存变化。可据此讨论维生素 C 导向的配方开发，并用最终产品检测确认含量与保质期表现。',
        en: 'Chestnut rose juice research measures vitamin C and changes during storage. Discuss vitamin C-led formulation development, verifying content and shelf-life performance in the final product.',
      },
      src: 'https://pubmed.ncbi.nlm.nih.gov/36939010/',
      focus: 'vitamin-c',
      image: 'juice-range-editorial.png',
    },
  ];
  return (
    <section id="nutrition" className="ft-nutrition-section ft-section">
      <div className="ft-container">
        <div className="ft-heading">
          <div>
            <span className="ft-section-label">
              {zh
                ? '食材成分与产品价值'
                : 'Ingredient composition & product value'}
            </span>
            <h2>
              {zh
                ? '好风味之外，还有配方的想象。'
                : 'Beyond flavour. A formulation story.'}
            </h2>
          </div>
          <p>
            {zh
              ? '把食材研究转化为可讨论的开发方向：果实成分、风味、颜色与营养定位。'
              : 'Turn ingredient research into a development conversation: composition, flavour, colour and nutrition positioning.'}
          </p>
        </div>
        <div className="ft-nutrition-grid">
          {profiles.map((p) => (
            <article key={p.name.en}>
              <div className="ft-nutrition-image">
                <Image
                  src={`/images/brand-v2/${p.image}`}
                  alt={localize(p.name, locale)}
                  fill
                  sizes="(max-width:650px) 100vw, (max-width:1050px) 50vw, 25vw"
                />
              </div>
              <div>
                <span className="ft-section-label">
                  {localize(p.name, locale)}
                </span>
                <h3>{localize(p.highlight, locale)}</h3>
                <p>{localize(p.text, locale)}</p>
                <Link
                  className="ft-nutrition-products"
                  href={`/collections?focus=${p.focus}&stage=ingredient#formats`}
                >
                  {zh ? '探索相关配方方向' : 'Explore related formulations'} →
                </Link>
                <a href={p.src} target="_blank" rel="noopener noreferrer">
                  {zh ? '查看成分研究' : 'View composition research'} ↗
                </a>
              </div>
            </article>
          ))}
        </div>
        <div className="ft-nutrition-brief">
          <h3>
            {zh
              ? '想开发怎样的产品定位？'
              : 'What product positioning are you exploring?'}
          </h3>
          <p>
            {zh
              ? '便携果汁、植物食材配方、谷物早餐，或维生素 C、膳食纤维与蛋白质导向的食品。我们从您的产品简报出发，组织原料、样品与供应商沟通。'
              : 'Portable juices, botanical fruit recipes, grain breakfasts or foods developed around vitamin C, fibre and protein. Start with your brief to connect ingredients, samples and supplier discussions.'}
          </p>
          <Link
            href="/sourcing?topic=product-development"
            className="ft-button"
          >
            {zh ? '交流产品开发计划' : 'Discuss your product brief'} →
          </Link>
        </div>
        <details className="ft-nutrition-evidence">
          <summary>
            {zh
              ? '成分研究与营养表达说明'
              : 'Composition research & nutrition positioning'}
          </summary>
          <p>
            {zh
              ? '这里介绍的是食材成分与配方研究方向。原料研究不能直接证明成品的健康功效；营养含量、可用宣称与标签表达需依据最终配方、检测结果及目标市场条件。NFC 指非浓缩还原，不等同于无糖、生鲜、未经杀菌或保留全部营养。'
              : 'These are ingredient composition and formulation profiles. Ingredient studies do not establish health benefits for a finished food. Nutrient levels, claims and labels depend on the final recipe, analytical results and destination conditions. NFC means not from concentrate; it does not imply sugar-free, raw, unpasteurised or complete nutrient retention.'}
          </p>
          <a
            href="https://www.doehler.com/en/our-portfolio/fruit-vegetable-ingredients/nfc-juices.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            {zh ? 'NFC 果汁加工形式 · Döhler' : 'NFC juice formats · Döhler'} ↗
          </a>
          <a
            href="https://food.ec.europa.eu/food-safety/labelling-and-nutrition/nutrition-and-health-claims_en"
            target="_blank"
            rel="noopener noreferrer"
          >
            {zh ? '欧盟营养与健康宣称' : 'EU nutrition & health claims'} ↗
          </a>
          <a
            href="https://www.fda.gov/food/nutrition-food-labeling-and-critical-foods/label-claims-conventional-foods-and-dietary-supplements"
            target="_blank"
            rel="noopener noreferrer"
          >
            {zh ? '美国食品标签宣称 · FDA' : 'US food label claims · FDA'} ↗
          </a>
        </details>
      </div>
    </section>
  );
}
