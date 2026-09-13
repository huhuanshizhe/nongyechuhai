import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';
import { HighlandCollections } from '../../../components/HighlandCollections';
import { BrandContactBand } from '../../../components/BrandContactBand';
import { highlandMetadata } from '../../../lib/highland';
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return highlandMetadata(
    locale,
    { zh: '高原产品', en: 'Our products' },
    {
      zh: '枸杞、沙棘、谷物与蜂蜜，探索高原特色食品和食材。',
      en: 'Explore goji berries, sea buckthorn, grains and honey. Distinctive food and ingredients from the plateau.',
    },
    '/collections',
  );
}
export default async function CollectionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const zh = locale === 'zh';
  return (
    <main className="ft-main">
      <section className="ft-catalogue-hero">
        <div className="ft-container">
          <div>
            <span className="ft-section-label">
              {zh ? '高原产品' : 'Our products'}
            </span>
            <h1>
              {zh
                ? '风味，\n有更多可能。'
                : 'A world of flavour.\nA place of origin.'}
            </h1>
            <p>
              {zh
                ? '从完整食材到食品灵感，发现属于高原的颜色、质地与风味。'
                : 'Discover the colours, textures and flavours of the plateau, from whole ingredients to new food ideas.'}
            </p>
          </div>
          <div className="ft-catalogue-hero__image">
            <Image
              src="/images/brand-v2/food-table-editorial.png"
              alt={
                zh
                  ? '高原食材的餐桌搭配'
                  : 'An inviting table of plateau ingredients'
              }
              fill
              priority
              sizes="(max-width: 800px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>
      <section className="ft-container ft-section">
        <HighlandCollections locale={locale} />
      </section>
      <BrandContactBand locale={locale} />
    </main>
  );
}
