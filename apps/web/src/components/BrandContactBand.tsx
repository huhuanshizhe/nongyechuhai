import { Link } from '../i18n/routing';
export function BrandContactBand({ locale }: { locale: string }) {
  const zh = locale === 'zh';
  return (
    <section className="ft-contact-band">
      <div className="ft-container">
        <div>
          <h2>
            {zh
              ? '让下一次合作，\n从好食材开始。'
              : 'Let’s make something\ngood together.'}
          </h2>
          <p>
            {zh
              ? '产品、供应或品牌合作，我们期待听到您的想法。'
              : 'For products, sourcing or a brand collaboration, we’d love to hear your ideas.'}
          </p>
        </div>
        <Link href="/sourcing" className="ft-button ft-button--white">
          {zh ? '联系 Farmetra' : 'Talk to Farmetra'}
        </Link>
      </div>
    </section>
  );
}
