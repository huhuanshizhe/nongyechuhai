import { setRequestLocale } from 'next-intl/server';
import { EditorialHero } from '../../../components/EditorialHero';
import { BrandContactBand } from '../../../components/BrandContactBand';
import {
  BuyerSegments,
  NutritionProfiles,
} from '../../../components/BuyerSolutions';
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
    { zh: '采购与贴牌方案', en: 'Sourcing & private-label solutions' },
    {
      zh: '为食品工厂、品牌商、餐饮、零售与分销客户组织原料、加工食品和贴牌开发方案。',
      en: 'Whole foods, ingredients and private-label development for manufacturers, brands, foodservice, retail and distributors.',
    },
    '/solutions',
    '/images/brand-v2/juice-range-editorial.png',
  );
}
export default async function SolutionsPage({
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
        image="/images/brand-v2/juice-range-editorial.png"
        alt={
          zh
            ? '四色果汁与原浆小袋的包装概念示意'
            : 'Four fruit juices and a purée pouch, illustrative packaging concepts'
        }
        title={
          zh ? (
            <>
              为您的业务，
              <br />
              找到产品的可能。
            </>
          ) : (
            <>
              From an ingredient.
              <br />
              To your next range.
            </>
          )
        }
        description={
          zh
            ? '采购原料，选择加工食品，或开发自己的品牌。以您的客户、配方与渠道为起点。'
            : 'Source ingredients, explore finished foods or develop your own label. Start with your customers, recipes and channels.'
        }
      >
        <Link
          href="/collections#formats"
          className="ft-button ft-button--white"
        >
          {zh ? '按业务探索产品' : 'Explore product formats'}
        </Link>
      </EditorialHero>
      <BuyerSegments locale={locale} />
      <section className="ft-container ft-section ft-oem-feature">
        <div>
          <span className="ft-section-label">
            {zh ? '贴牌与联合开发' : 'Private label & product development'}
          </span>
          <h2>
            {zh
              ? '让产地特色，成为您的品牌系列。'
              : 'Bring distinctive origins into your own brand.'}
          </h2>
          <p>
            {zh
              ? '从枸杞原浆小袋到 NFC 果汁，从单果沙棘到复合果饮。我们组织产品、加工与包装伙伴，围绕您的简报推进选品、样品和品牌规格沟通。'
              : 'From goji purée sachets to NFC juices, from single-fruit sea buckthorn to blended beverages. We connect product, processing and packaging partners around your brief, samples and brand specifications.'}
          </p>
          <Link
            href="/sourcing?topic=product-development&buyer=brands"
            className="ft-text-link"
          >
            {zh ? '开始品牌产品沟通' : 'Start your brand brief'} →
          </Link>
        </div>
        <ol>
          {(zh
            ? [
                [
                  '选现有产品',
                  '选择原浆、果汁或食品形式，沟通供应商现有配方与包装选项。',
                ],
                [
                  '做配方与口味',
                  '明确果汁比例、风味、份量与营养定位，讨论可执行的打样方向。',
                ],
                [
                  '定包装与标签',
                  '确认灌装与包装条件、品牌内容、目标市场标签资料及包装起订量。',
                ],
                [
                  '确认样品与供应',
                  '以样品和产品文件落实规格、报价、交期和后续供货条件。',
                ],
              ]
            : [
                [
                  'Choose a format',
                  'Explore purées, juices or foods and discuss existing supplier recipes and pack options.',
                ],
                [
                  'Develop a recipe',
                  'Define juice content, flavour, portion size and nutrition positioning for a practical sample brief.',
                ],
                [
                  'Build the pack',
                  'Discuss filling, packaging, brand content, destination label information and packaging MOQ.',
                ],
                [
                  'Agree samples & supply',
                  'Confirm specifications, price, lead time and ongoing supply terms against samples and product documents.',
                ],
              ]
          ).map(([t, c], i) => (
            <li key={t}>
              <span>0{i + 1}</span>
              <div>
                <h3>{t}</h3>
                <p>{c}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <NutritionProfiles locale={locale} />
      <BrandContactBand locale={locale} />
    </main>
  );
}
