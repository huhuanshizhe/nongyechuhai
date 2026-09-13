import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';
import { EditorialHero } from '../../../components/EditorialHero';
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
    { zh: '品质与细节', en: 'Quality matters' },
    {
      zh: '从产地、产品规格到包装与资料，在细节里认识食材。',
      en: 'Get to know ingredients through origin, specifications, packaging and product documentation.',
    },
    '/traceability',
  );
}
export default async function QualityPage({
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
        image="/images/brand-v2/hengtai-field.jpg"
        alt={zh ? '枸杞原料整理场景' : 'Goji berries arranged for handling'}
        title={
          zh ? (
            <>
              品质，
              <br />
              藏在每个细节里。
            </>
          ) : (
            <>
              The difference
              <br />
              is in the details.
            </>
          )
        }
        description={
          zh
            ? '好的产品对话，从了解产地、规格、加工和用途开始。'
            : 'A good product conversation starts with origin, specifications, processing and intended use.'
        }
      />
      <section className="ft-container ft-section ft-intro">
        <span className="ft-section-label">
          {zh ? '品质与细节' : 'Quality matters'}
        </span>
        <h2>
          {zh
            ? '看见食材，也看见它的来路。'
            : 'Know the ingredient.\nUnderstand its journey.'}
        </h2>
        <p>
          {zh
            ? '我们从具体产品出发，与供应伙伴沟通产地、加工、包装和资料要求，让采购团队在关键问题上得到更清晰的信息。'
            : 'We start with the specific product, working through origin, processing, packaging and documentation with supply partners so buying teams can ask the right questions.'}
        </p>
      </section>
      <section className="ft-container ft-quality-grid">
        {[
          {
            image: '/images/brand-v2/hengtai-about.png',
            title: zh ? '清晰的来源' : 'A clear origin',
            copy: zh
              ? '产地与生产者，是产品故事的起点。通过来源资料和基地介绍，了解食材背后的土地。'
              : 'Origin and producer are the starting point. Source records and growing-base introductions bring the place behind the ingredient into view.',
          },
          {
            image: '/images/brand-v2/goji-editorial.png',
            title: zh ? '适合的规格' : 'The right specification',
            copy: zh
              ? '颗粒、风味、加工方式与包装，应围绕实际用途讨论，让选品贴近您的产品需求。'
              : 'Size, flavour, processing and packaging should be discussed around the intended use, keeping sourcing close to your product brief.',
          },
          {
            image: '/images/brand-v2/hengtai-red-goji.jpg',
            title: zh ? '认真对待资料' : 'Attention to documentation',
            copy: zh
              ? '以目标市场和具体产品为基础，沟通所需规格资料、检测记录与包装信息。'
              : 'Use the destination and specific product as the basis for discussing required specifications, test records and pack information.',
          },
        ].map(({ image, title, copy }) => (
          <article key={title}>
            <div>
              <Image
                src={image}
                alt={title}
                fill
                sizes="(max-width: 800px) 100vw, 33vw"
              />
            </div>
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </section>
      <section className="ft-container ft-section ft-quality-note">
        <h2>
          {zh
            ? '您的标准，是沟通的起点。'
            : 'Your requirements set the conversation.'}
        </h2>
        <p>
          {zh
            ? '请告诉我们产品用途、目标市场与需要的资料。不同品类与市场，值得分别认真对待。'
            : 'Tell us the intended use, destination and documents you need. Every category and every market deserves its own careful conversation.'}
        </p>
      </section>
      <BrandContactBand locale={locale} />
    </main>
  );
}
