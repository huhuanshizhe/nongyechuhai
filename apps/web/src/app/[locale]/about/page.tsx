import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '../../../i18n/routing';
import { EditorialHero } from '../../../components/EditorialHero';
import { BrandContactBand } from '../../../components/BrandContactBand';
import { OriginEvidence } from '../../../components/OriginEvidence';
import { highlandMetadata } from '../../../lib/highland';
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return highlandMetadata(
    locale,
    { zh: '产地故事', en: 'Our origins' },
    {
      zh: '从青藏高原出发，认识食物背后的土地与生产者。',
      en: 'Discover the places and producers behind food from the Qinghai–Tibet Plateau.',
    },
    '/about',
  );
}
export default async function AboutPage({
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
          zh ? '高原河谷与雪山' : 'An open plateau valley beneath snow peaks'
        }
        title={
          zh ? (
            <>
              每一种风味，
              <br />
              都有它的来处。
            </>
          ) : (
            <>
              Every flavour
              <br />
              starts somewhere.
            </>
          )
        }
        description={
          zh
            ? '走近青藏高原，认识食物背后的山川、土地与生产者。'
            : 'Get closer to the landscapes, the land and the producers behind food from the Qinghai–Tibet Plateau.'
        }
      />
      <section className="ft-container ft-section ft-intro">
        <span className="ft-section-label">
          {zh ? '我们是 Farmetra' : 'We are Farmetra'}
        </span>
        <h2>
          {zh
            ? '让有来处的食物，\n被更多人认识。'
            : 'Good food deserves\na wider world.'}
        </h2>
        <p>
          {zh
            ? '我们把青藏高原的特色食品，介绍给世界。从浆果到谷物，从原料到食品，Farmetra 用全球采购能够理解的方式，连接产品、产地与合作伙伴。'
            : 'We introduce distinctive plateau foods to a wider world. From berries to grains, from ingredients to finished food ideas, Farmetra brings products, origins and partners into a language global buyers can work with.'}
        </p>
      </section>
      <section className="ft-container ft-feature">
        <div className="ft-feature__image">
          <Image
            src="/images/brand-v2/supplier-goji-field-rows.jpg"
            alt={
              zh
                ? '衡塬萃提供的海西枸杞基地实拍'
                : 'Haixi goji field photograph supplied by Hengyuancui'
            }
            fill
            sizes="(max-width: 800px) 100vw, 50vw"
          />
        </div>
        <div className="ft-feature__copy">
          <span className="ft-section-label">
            {zh ? '走近青海海西' : 'Closer to Haixi, Qinghai'}
          </span>
          <h2>
            {zh
              ? '风土不是背景，\n是食物的一部分。'
              : 'Origin is not a backdrop.\nIt is part of the food.'}
          </h2>
          <p>
            {zh
              ? '衡塬萃的枸杞故事，扎根于青海海西。通过生产者的介绍和真实的基地记录，我们让产地不只停留在包装上的一个地名。'
              : 'Hengyuancui’s goji story is rooted in Haixi, Qinghai. Producer introductions and actual growing-base records help make origin more than a place name on a pack.'}
          </p>
          <Link href="/partners" className="ft-text-link">
            {zh ? '认识枸杞供应伙伴' : 'Meet our goji partner'}
          </Link>
        </div>
      </section>
      <section className="ft-container ft-section ft-origin-gallery">
        <figure>
          <div>
            <Image
              src="/images/brand-v2/hengtai-origin.jpg"
              alt={
                zh ? '枸杞基地采收场景' : 'Goji harvesting at the growing base'
              }
              fill
              sizes="(max-width: 800px) 100vw, 60vw"
            />
          </div>
          <figcaption>
            {zh
              ? '采收的时刻，是产地故事最真实的一页。'
              : 'The harvest brings the origin story to life.'}
          </figcaption>
        </figure>
        <figure>
          <div>
            <Image
              src="/images/brand-v2/goji-editorial.png"
              alt={zh ? '一碗红枸杞' : 'A bowl of red goji berries'}
              fill
              sizes="(max-width: 800px) 100vw, 35vw"
            />
          </div>
          <figcaption>
            {zh
              ? '从一颗果实，到更多餐桌。'
              : 'From one small berry to more tables.'}
          </figcaption>
        </figure>
      </section>
      <section className="ft-values-section">
        <div className="ft-container">
          <div className="ft-heading">
            <h2>{zh ? '我们在意的事。' : 'What matters to us.'}</h2>
          </div>
          <div className="ft-service-columns">
            {(zh
              ? [
                  [
                    '看见真实产地',
                    '与生产者沟通，让产品有清晰的来源，让品牌故事有真实的起点。',
                  ],
                  [
                    '尊重食材本身',
                    '关注风味、规格、加工与食用场景，以适合产品的方式呈现它。',
                  ],
                  [
                    '连接长久合作',
                    '理解品牌与采购需求，把每次沟通落在具体的产品和细节上。',
                  ],
                ]
              : [
                  [
                    'A clear sense of origin',
                    'Connect with producers so that products have a clear source and brand stories have a real starting point.',
                  ],
                  [
                    'Respect for the ingredient',
                    'Pay attention to flavour, specification, processing and how the food will actually be used.',
                  ],
                  [
                    'Thoughtful relationships',
                    'Understand the brand and buyer brief, and keep the conversation grounded in the product and its details.',
                  ],
                ]
            ).map(([title, copy]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <OriginEvidence locale={locale} />
      <BrandContactBand locale={locale} />
    </main>
  );
}
