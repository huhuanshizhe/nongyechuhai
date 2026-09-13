import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';
import { ContactComposer } from '../../../components/ContactComposer';
import { highlandMetadata } from '../../../lib/highland';
type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    direction?: string;
    topic?: string;
    brief?: string;
    buyer?: string;
  }>;
};
export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return highlandMetadata(
    locale,
    { zh: '联系我们', en: 'Let’s talk' },
    {
      zh: '联系 Farmetra，交流高原特色产品、采购与品牌合作。',
      en: 'Contact Farmetra to discuss plateau foods, sourcing and brand partnerships.',
    },
    '/sourcing',
  );
}
export default async function ContactPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const query = await searchParams;
  setRequestLocale(locale);
  const zh = locale === 'zh';
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'export@farmetra.com';
  return (
    <main className="ft-main">
      <section className="ft-container ft-contact-page">
        <div className="ft-contact-page__intro">
          <span className="ft-section-label">
            {zh ? '联系我们' : 'Get in touch'}
          </span>
          <h1>
            {zh ? '聊聊好食材，\n也聊聊新可能。' : 'Let’s talk\ngood food.'}
          </h1>
          <p>
            {zh
              ? '无论您在寻找特色产品、开发新的食品系列，还是希望开展合作，我们都期待听到您的想法。'
              : 'Whether you’re looking for distinctive products, developing a new food range or exploring a partnership, we’d love to hear your ideas.'}
          </p>
          <div className="ft-contact-page__image">
            <Image
              src="/images/brand-v2/food-table-editorial.png"
              alt={
                zh
                  ? '高原谷物、浆果与蜂蜜的餐桌组合'
                  : 'A table of plateau grains, berries and honey'
              }
              fill
              priority
              sizes="(max-width: 800px) 100vw, 45vw"
            />
          </div>
          <a className="ft-contact-email" href={`mailto:${email}`}>
            {email}
          </a>
        </div>
        <div className="ft-contact-page__form">
          <h2>{zh ? '开启一次对话' : 'Start a conversation'}</h2>
          <ContactComposer
            locale={locale}
            email={email}
            initialTopic={query.direction || query.topic}
            initialBrief={
              typeof query.brief === 'string' ? query.brief.slice(0, 1800) : ''
            }
            initialBuyer={query.buyer}
          />
        </div>
      </section>
    </main>
  );
}
