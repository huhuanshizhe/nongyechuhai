import Image from 'next/image';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '../../../../i18n/routing';
import {
  directions,
  localize,
  highlandMetadata,
} from '../../../../lib/highland';
import { EditorialProductCard } from '../../../../components/EditorialProductCard';
import { BrandContactBand } from '../../../../components/BrandContactBand';
type Props = { params: Promise<{ locale: string; slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const item = directions.find((item) => item.slug === slug);
  if (!item) notFound();
  return highlandMetadata(
    locale,
    item.name,
    item.description,
    `/collections/${slug}`,
    item.image,
  );
}
export function generateStaticParams() {
  return directions.map((item) => ({ slug: item.slug }));
}
export default async function CollectionPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const zh = locale === 'zh';
  const item = directions.find((item) => item.slug === slug);
  if (!item) notFound();
  const related = directions.filter((other) => other.slug !== slug).slice(0, 3);
  return (
    <main className="ft-main">
      <section className="ft-container ft-product-detail">
        <div className="ft-product-detail__image">
          <Image
            src={item.image}
            alt={localize(item.name, locale)}
            fill
            priority
            sizes="(max-width: 800px) 100vw, 50vw"
          />
        </div>
        <div className="ft-product-detail__copy">
          <Link href="/collections" className="ft-back-link">
            {zh ? '所有产品' : 'All products'}
          </Link>
          <h1>{localize(item.name, locale)}</h1>
          <p className="ft-product-detail__lead">
            {localize(item.description, locale)}
          </p>
          <p>{localize(item.detail, locale)}</p>
          <div className="ft-product-facts">
            <div>
              <span>{zh ? '产品形态' : 'Product formats'}</span>
              <p>{localize(item.formats, locale)}</p>
            </div>
            <div>
              <span>{zh ? '应用灵感' : 'Made for'}</span>
              <p>{localize(item.applications, locale)}</p>
            </div>
            <div>
              <span>{zh ? '风味搭配' : 'Pairs well with'}</span>
              <p>{localize(item.pairing, locale)}</p>
            </div>
          </div>
          <Link className="ft-button" href={`/sourcing?direction=${item.slug}`}>
            {zh ? '咨询规格与样品' : 'Discuss specifications & samples'}
          </Link>
          <p className="ft-product-note">
            {zh
              ? '具体规格、包装、起订量及交期按产品与目的地确认。图片用于产品系列与应用展示，采购以双方确认的样品和规格为准。'
              : 'Specifications, packaging, minimum quantities and lead times are confirmed for your product and destination. Images present the product category or serving ideas; purchases are based on agreed samples and specifications.'}
          </p>
          <Link className="ft-text-link" href="/buying-guide">
            {zh
              ? '首次采购？了解合作方式'
              : 'First enquiry? Read our buying guide'}
          </Link>
        </div>
      </section>
      <section className="ft-product-story">
        <div className="ft-container ft-feature">
          <div className="ft-feature__copy">
            <span className="ft-section-label">
              {zh ? '让灵感落在餐桌上' : 'Bring your ideas to the table'}
            </span>
            <h2>
              {zh
                ? '一种食材，\n不止一种表达。'
                : 'One ingredient.\nSo many possibilities.'}
            </h2>
            <p>
              {zh
                ? '无论是零售产品、餐饮菜单，还是新的食品配方，好的食材都值得被认真对待。告诉我们您的用途、包装需求和目标市场，开启一段具体的产品对话。'
                : 'For a retail range, a foodservice menu or a new recipe, good ingredients deserve attention. Share your application, packaging needs and destination to start a focused product conversation.'}
            </p>
          </div>
          <div className="ft-feature__image">
            <Image
              src="/images/brand-v2/food-table-editorial.png"
              alt={
                zh
                  ? '谷物与浆果的食用搭配'
                  : 'Serving ideas with grains and berries'
              }
              fill
              sizes="(max-width: 800px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <section className="ft-container ft-section">
        <div className="ft-heading">
          <h2>{zh ? '还可以发现' : 'Keep exploring'}</h2>
          <Link href="/collections" className="ft-text-link">
            {zh ? '查看全部产品' : 'See all products'}
          </Link>
        </div>
        <div className="ft-product-grid">
          {related.map((other) => (
            <EditorialProductCard
              key={other.slug}
              item={other}
              locale={locale}
            />
          ))}
        </div>
      </section>
      <BrandContactBand locale={locale} />
    </main>
  );
}
