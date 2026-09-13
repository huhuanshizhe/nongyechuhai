import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';
import { HighlandCollections } from '../../../components/HighlandCollections';
import { BrandContactBand } from '../../../components/BrandContactBand';
import { BuyerCatalogue } from '../../../components/BuyerCatalogue';
import { Link } from '../../../i18n/routing';
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
      zh: '探索枸杞原浆、NFC 果汁、沙棘汁、刺梨汁、锁鲜枸杞、谷物原料与贴牌食品开发。',
      en: 'Explore goji purée, NFC juices, sea buckthorn, chestnut rose juice, fresh-preserved berries, grains and private-label development.',
    },
    '/collections',
  );
}
export default async function CollectionsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ buyer?: string; stage?: string; focus?: string }>;
}) {
  const { locale } = await params;
  const query = await searchParams;
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
                ? '从特色原料，\n到您的品牌食品。'
                : 'Whole foods. Ingredients.\nYour next branded range.'}
            </h1>
            <p>
              {zh
                ? '枸杞原浆、NFC 红黑枸杞果汁、沙棘汁、刺梨汁与锁鲜枸杞。按产品形式、应用和业务类型，组织您的采购选择。'
                : 'Goji purée, red and black goji NFC juices, sea buckthorn juice, chestnut rose juice and fresh-preserved berries. Explore by format, application and business type.'}
            </p>
          </div>
          <div className="ft-catalogue-hero__image">
            <Image
              src="/images/brand-v2/juice-range-editorial.png"
              alt={
                zh
                  ? '特色果汁与原浆小袋的包装概念示意'
                  : 'Fruit juices and a purée pouch, illustrative packaging concepts'
              }
              fill
              priority
              sizes="(max-width: 800px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>
      <section className="ft-container ft-section">
        <BuyerCatalogue
          key={`${query.buyer || ''}-${query.stage || ''}-${query.focus || ''}`}
          locale={locale}
          initialBuyer={query.buyer}
          initialStage={query.stage}
          initialFocus={query.focus}
        />
      </section>
      <section className="ft-container ft-catalogue-solutions-link">
        <h2>
          {zh
            ? '从您的业务出发，找到采购路径。'
            : 'Find a sourcing route for your business.'}
        </h2>
        <Link href="/solutions" className="ft-button">
          {zh ? '客户方案与食材价值' : 'Buyer solutions & ingredient profiles'}{' '}
          →
        </Link>
      </section>
      <section className="ft-container ft-section">
        <div className="ft-heading">
          <div>
            <span className="ft-section-label">
              {zh ? '按食材探索产地与风味' : 'Explore by ingredient'}
            </span>
            <h2>
              {zh
                ? '认识食材，读懂来处。'
                : 'Meet the ingredient. Know its origin.'}
            </h2>
          </div>
        </div>
        <HighlandCollections locale={locale} />
      </section>
      <BrandContactBand locale={locale} />
    </main>
  );
}
