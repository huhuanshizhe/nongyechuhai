import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '../../../i18n/routing';
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
    { zh: '合作伙伴', en: 'Our partners' },
    {
      zh: '认识我们的枸杞供应伙伴衡源萃，与高原生产者建立连接。',
      en: 'Meet Hengyuancui, our goji sourcing partner, and connect with plateau producers.',
    },
    '/partners',
  );
}
export default async function PartnersPage({
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
        image="/images/brand-v2/hengtai-about.png"
        alt={zh ? '衡源萃枸杞种植基地' : 'Hengyuancui goji growing base'}
        title={
          zh ? (
            <>
              好食材，
              <br />
              来自用心的人。
            </>
          ) : (
            <>
              Good food.
              <br />
              Good people.
            </>
          )
        }
        description={
          zh
            ? '走近高原生产者，让每一次产品沟通，都有真实的起点。'
            : 'Get closer to plateau producers. Give every product conversation a real starting point.'
        }
      />
      <section className="ft-container ft-section ft-supplier-profile">
        <div>
          <span className="ft-section-label">
            {zh ? '枸杞供应伙伴' : 'Our goji sourcing partner'}
          </span>
          <h2>{zh ? '衡源萃' : 'Hengyuancui'}</h2>
          <p className="ft-supplier-profile__name">
            {zh
              ? '海西恒泰工贸有限公司'
              : 'Haixi Hengtai Industry and Trade Co., Ltd.'}
          </p>
          <p>
            {zh
              ? '扎根青海海西，企业农业板块围绕枸杞等高原特色农产品开展种植、加工与销售，以红枸杞、黑枸杞、枸杞叶茶和蜂蜜呈现高原特色。'
              : 'Rooted in Haixi, Qinghai, the company’s agriculture division works across growing, processing and sales of goji and other plateau products. Its range includes red goji, black goji, goji leaf tea and honey.'}
          </p>
          <div className="ft-supplier-profile__tags">
            <span>{zh ? '青海海西' : 'Haixi, Qinghai'}</span>
            <span>{zh ? '枸杞系列' : 'Goji collection'}</span>
            <span>{zh ? '特色食品' : 'Speciality foods'}</span>
          </div>
          <div className="ft-actions">
            <Link href="/sourcing?direction=goji" className="ft-button">
              {zh ? '咨询枸杞产品' : 'Enquire about goji'}
            </Link>
            <a
              href="https://www.hengyuancui.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="ft-text-link"
            >
              {zh ? '访问衡源萃官网' : 'Visit Hengyuancui'}
            </a>
          </div>
        </div>
        <div className="ft-supplier-profile__image">
          <Image
            src="/images/brand-v2/hengtai-origin.jpg"
            alt={
              zh
                ? '衡源萃基地的枸杞采收工作'
                : 'Goji harvesting shown by Hengyuancui'
            }
            fill
            sizes="(max-width: 800px) 100vw, 50vw"
          />
        </div>
      </section>
      <section className="ft-container ft-supplier-gallery">
        <figure>
          <div>
            <Image
              src="/images/brand-v2/hengtai-about.png"
              alt={zh ? '枸杞种植基地' : 'Goji growing base'}
              fill
              sizes="(max-width: 800px) 100vw, 33vw"
            />
          </div>
          <figcaption>
            {zh ? '产地里的枸杞基地' : 'At the growing base'}
          </figcaption>
        </figure>
        <figure>
          <div>
            <Image
              src="/images/brand-v2/hengtai-field.jpg"
              alt={
                zh ? '成盘整理的红枸杞' : 'Red goji berries arranged on trays'
              }
              fill
              sizes="(max-width: 800px) 100vw, 33vw"
            />
          </div>
          <figcaption>
            {zh ? '从原果开始的细节' : 'Care starts with the berry'}
          </figcaption>
        </figure>
        <figure>
          <div className="ft-supplier-gallery__pack">
            <Image
              src="/images/brand-v2/hengtai-red-goji.jpg"
              alt={
                zh
                  ? '衡源萃红枸杞包装'
                  : 'Hengyuancui red goji retail packaging'
              }
              fill
              sizes="(max-width: 800px) 100vw, 33vw"
            />
          </div>
          <figcaption>
            {zh ? '衡源萃红枸杞产品' : 'Hengyuancui red goji'}
          </figcaption>
        </figure>
      </section>
      <section className="ft-container ft-section ft-intro">
        <span className="ft-section-label">
          {zh ? '一起打开更多可能' : 'Grow the connection'}
        </span>
        <h2>
          {zh ? '您也有值得分享的好产品？' : 'Have something good to share?'}
        </h2>
        <p>
          {zh
            ? '我们欢迎高原食品生产者、海外采购伙伴和专业机构交流合作。带着您的产品、市场或想法，来认识 Farmetra。'
            : 'We welcome conversations with plateau food producers, overseas buyers and specialist partners. Bring your product, market or idea to Farmetra.'}
        </p>
        <Link href="/sourcing?topic=partnership" className="ft-button">
          {zh ? '与我们交流' : 'Start a conversation'}
        </Link>
      </section>
      <BrandContactBand locale={locale} />
    </main>
  );
}
