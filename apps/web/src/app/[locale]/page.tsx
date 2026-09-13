import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '../../i18n/routing';
import { EditorialHero } from '../../components/EditorialHero';
import { EditorialProductCard } from '../../components/EditorialProductCard';
import { BrandContactBand } from '../../components/BrandContactBand';
import { directions, highlandMetadata } from '../../lib/highland';
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return highlandMetadata(
    locale,
    { zh: '高原的馈赠，世界的风味', en: 'Good food. Remarkable origins.' },
    {
      zh: '发现青藏高原的枸杞、沙棘、谷物与蜂蜜，让特色食材走向更多餐桌。',
      en: 'Discover goji berries, sea buckthorn, grains and honey from the Qinghai–Tibet Plateau. Distinctive ingredients for more tables.',
    },
    '',
  );
}
export default async function HomePage({
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
        image="/images/highland/plateau-hero.png"
        alt={
          zh
            ? '高原雪山、河谷与金色谷物'
            : 'Snow peaks, an open valley and golden grain'
        }
        title={
          zh ? (
            <>
              高原的馈赠，
              <br />
              世界的风味。
            </>
          ) : (
            <>
              Grown high.
              <br />
              Shared worldwide.
            </>
          )
        }
        description={
          zh
            ? '从青藏高原的山川与土地出发，发现值得带向世界的食材。'
            : 'From the extraordinary landscapes of the Qinghai–Tibet Plateau, discover ingredients with a story worth sharing.'
        }
      >
        <div className="ft-hero__actions">
          <Link href="/collections" className="ft-button ft-button--white">
            {zh ? '探索高原产品' : 'Explore our products'}
          </Link>
          <Link href="/about" className="ft-hero__link">
            {zh ? '认识我们的产地' : 'Meet our origins'}
          </Link>
        </div>
      </EditorialHero>
      <div className="ft-origin-line">
        <div className="ft-container">
          <span>
            {zh ? '源自青藏高原' : 'Rooted in the Qinghai–Tibet Plateau'}
          </span>
          <span>
            {zh ? '特色食品与天然食材' : 'Distinctive foods & ingredients'}
          </span>
          <span>
            {zh ? '面向全球品牌与采购商' : 'For food brands & global buyers'}
          </span>
        </div>
      </div>
      <section className="ft-container ft-section">
        <div className="ft-heading">
          <div>
            <span className="ft-section-label">
              {zh ? '来自高原的好味道' : 'The plateau collection'}
            </span>
            <h2>
              {zh ? '食材有来处，风味有个性。' : 'Distinctive by nature.'}
            </h2>
          </div>
          <p>
            {zh
              ? '明亮的浆果、质朴的谷物、温润的蜂蜜。为您的品牌、菜单与产品发现新的灵感。'
              : 'Brilliant berries. Honest grains. A little sweetness. Find fresh inspiration for your brand, menu or next product.'}
          </p>
        </div>
        <div className="ft-product-grid">
          {directions.map((item) => (
            <EditorialProductCard key={item.slug} item={item} locale={locale} />
          ))}
        </div>
      </section>
      <section className="ft-story">
        <div className="ft-story__image">
          <Image
            src="/images/highland/plateau-hero.png"
            alt={zh ? '青藏高原风土意境' : 'A sense of the plateau landscape'}
            fill
            sizes="(max-width: 800px) 100vw, 55vw"
          />
        </div>
        <div className="ft-story__copy">
          <span className="ft-section-label">
            {zh ? '我们的产地故事' : 'A sense of place'}
          </span>
          <h2>
            {zh
              ? '一方山川，\n孕育一种风味。'
              : 'A remarkable place.\nA different perspective.'}
          </h2>
          <p>
            {zh
              ? '我们相信，了解食物的来处，是认识它的第一步。Farmetra 连接高原生产者与世界各地的食品伙伴，让产地的故事，成为产品的一部分。'
              : 'Understanding where food comes from changes the way we see it. Farmetra connects plateau producers with food partners around the world, bringing origin into the product story.'}
          </p>
          <Link href="/about" className="ft-text-link">
            {zh ? '走近高原' : 'Discover our origins'}
          </Link>
        </div>
      </section>
      <section className="ft-container ft-section ft-feature">
        <div className="ft-feature__copy">
          <span className="ft-section-label">
            {zh ? '从食材到餐桌' : 'Made for more possibilities'}
          </span>
          <h2>
            {zh
              ? '为日常餐桌，\n添一点不同。'
              : 'Familiar moments.\nFresh possibilities.'}
          </h2>
          <p>
            {zh
              ? '一碗谷物、一杯果饮，或是一款全新的食品。我们围绕真正的食用场景，连接原料、产品开发与品牌表达。'
              : 'A grain bowl. A bright fruit drink. Or an entirely new food idea. We connect ingredients, product development and brand presentation around the ways people eat.'}
          </p>
          <Link href="/services" className="ft-text-link">
            {zh ? '了解我们的支持' : 'See how we can help'}
          </Link>
        </div>
        <div className="ft-feature__image">
          <Image
            src="/images/brand-v2/food-table-editorial.png"
            alt={
              zh
                ? '谷物沙拉、枸杞、沙棘果汁与蜂蜜的餐桌搭配'
                : 'Quinoa salad, goji berries, sea buckthorn juice and honey on a table'
            }
            fill
            sizes="(max-width: 800px) 100vw, 50vw"
          />
        </div>
      </section>
      <section className="ft-partner-highlight">
        <div className="ft-container ft-partner-highlight__grid">
          <div className="ft-partner-highlight__photos">
            <div>
              <Image
                src="/images/brand-v2/hengtai-about.png"
                alt={
                  zh
                    ? '衡源萃官网展示的枸杞种植基地'
                    : 'Goji growing base shown by Hengyuancui'
                }
                fill
                sizes="(max-width: 800px) 100vw, 40vw"
              />
            </div>
            <div>
              <Image
                src="/images/brand-v2/hengtai-origin.jpg"
                alt={
                  zh
                    ? '衡源萃基地枸杞采收'
                    : 'Goji harvest at the Hengyuancui growing base'
                }
                fill
                sizes="(max-width: 800px) 50vw, 25vw"
              />
            </div>
          </div>
          <div>
            <span className="ft-section-label">
              {zh ? '认识我们的枸杞供应伙伴' : 'Meet a goji sourcing partner'}
            </span>
            <h2>
              {zh
                ? '衡源萃\n根植青海海西。'
                : 'Hengyuancui.\nRooted in Haixi, Qinghai.'}
            </h2>
            <p>
              {zh
                ? '海西恒泰工贸有限公司农业板块，专注枸杞等高原特色农产品。从真实的生产者出发，认识食材背后的土地与用心。'
                : 'The agriculture division of Haixi Hengtai Industry and Trade Co., Ltd. focuses on goji and other plateau agricultural products. Meet the producer and the place behind the ingredient.'}
            </p>
            <Link className="ft-text-link" href="/partners">
              {zh ? '认识我们的伙伴' : 'Meet our partner'}
            </Link>
          </div>
        </div>
      </section>
      <BrandContactBand locale={locale} />
    </main>
  );
}
