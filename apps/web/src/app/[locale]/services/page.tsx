import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '../../../i18n/routing';
import { EditorialHero } from '../../../components/EditorialHero';
import { highlandMetadata } from '../../../lib/highland';
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return highlandMetadata(
    locale,
    { zh: '服务与支持', en: 'How we help' },
    {
      zh: '从特色食材到产品开发，为国际食品品牌和采购团队提供对接支持。',
      en: 'Sourcing and product-development support for food brands, importers and buying teams.',
    },
    '/services',
  );
}
export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const zh = locale === 'zh';
  return (
    <main className="ft-main">
      <EditorialHero
        compact
        image="/images/brand-v2/food-table-editorial.png"
        alt={
          zh
            ? '浆果、谷物与蜂蜜的餐桌搭配'
            : 'Berries, grains and honey on a table'
        }
        title={
          zh ? (
            <>
              从高原产地，
              <br />
              到您的产品。
            </>
          ) : (
            <>
              From our origins.
              <br />
              To your next idea.
            </>
          )
        }
        description={
          zh
            ? '为食品品牌、进口商和采购团队，连接值得探索的原料与风味。'
            : 'For food brands, importers and buying teams. A closer connection to distinctive ingredients and their origins.'
        }
      >
        <Link className="ft-button ft-button--white" href="/sourcing">
          {zh ? '与我们聊聊' : 'Tell us what you have in mind'}
        </Link>
      </EditorialHero>
      <section className="ft-container ft-section ft-intro">
        <span className="ft-section-label">
          {zh ? '服务与支持' : 'How we help'}
        </span>
        <h2>
          {zh
            ? '好的合作，从理解您的产品开始。'
            : 'Good partnerships start with understanding your product.'}
        </h2>
        <p>
          {zh
            ? '您关注口感、配方与消费者，我们帮助您梳理产地、产品形态与供应对接，让每一次沟通更接近真正的需求。'
            : 'You know your customers and the food you want to create. We help connect your brief with origin, product formats and the right sourcing conversation.'}
        </p>
      </section>
      <section className="ft-container ft-feature">
        <div className="ft-feature__image">
          <Image
            src="/images/brand-v2/goji-editorial.png"
            alt={
              zh ? '一碗红枸杞与绿叶' : 'Red goji berries in a porcelain bowl'
            }
            fill
            sizes="(max-width: 760px) 100vw, 50vw"
          />
        </div>
        <div className="ft-feature__copy">
          <span className="ft-section-label">
            {zh ? '以产品为起点' : 'Start with the ingredient'}
          </span>
          <h2>
            {zh
              ? '找到适合您的\n那一种风味。'
              : 'The right ingredient.\nFor the way you work.'}
          </h2>
          <p>
            {zh
              ? '从枸杞干果到谷物食品，从零售包装到食品加工应用，我们围绕用途、规格和目标市场展开对接。'
              : 'From whole goji berries to grain-based foods, from retail packs to food-manufacturing applications, we start with use, specification and destination.'}
          </p>
          <Link className="ft-text-link" href="/collections">
            {zh ? '探索产品系列' : 'Explore the collection'}
          </Link>
        </div>
      </section>
      <section className="ft-container ft-section ft-service-columns">
        {(zh
          ? [
              [
                '产品选品',
                '围绕零售、餐饮与食品加工场景，沟通产品形态、关键规格及样品需求。',
              ],
              [
                '品牌与包装',
                '为品牌化产品梳理规格、包装表达及外文内容，衔接设计与产品沟通。',
              ],
              [
                '出口对接',
                '围绕目标市场、产品资料和交付安排，协同供应与专业服务伙伴。',
              ],
            ]
          : [
              [
                'Ingredient sourcing',
                'Explore product formats, specifications and sample requirements for retail, foodservice and food manufacturing.',
              ],
              [
                'Brand & packaging',
                'Bring product specifications, packaging presentation and multilingual content into a coherent brand conversation.',
              ],
              [
                'Export coordination',
                'Connect supplier and specialist conversations around your destination, product documentation and delivery needs.',
              ],
            ]
        ).map(([name, copy], index) => (
          <article key={name}>
            <div className="ft-service-columns__image">
              <Image
                src={
                  [
                    '/images/brand-v2/quinoa-editorial.png',
                    '/images/brand-v2/hengtai-red-goji.jpg',
                    '/images/brand-v2/hengtai-origin.jpg',
                  ][index]!
                }
                alt={name}
                fill
                sizes="(max-width: 800px) 100vw, 33vw"
              />
            </div>
            <h3>{name}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </section>
      <section className="ft-contact-band">
        <div className="ft-container">
          <h2>
            {zh
              ? '您的下一个产品，\n可以从这里开始。'
              : 'Your next product\ncould start here.'}
          </h2>
          <Link className="ft-button ft-button--white" href="/buying-guide">
            {zh ? '了解采购合作流程' : 'See how sourcing works'}
          </Link>
        </div>
      </section>
    </main>
  );
}
