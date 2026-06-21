import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getAllSuppliersWithCredentials, type SupplierCredential } from '../../../lib/storefront';
import { Link } from '../../../i18n/routing';

type TraceabilityPageProps = {
  params: Promise<{ locale: string }>;
};

function getCopy(locale: string) {
  const isZh = locale === 'zh';

  return {
    heroKicker: isZh ? '资质与溯源' : 'Credentials & Traceability',
    heroTitle: isZh ? '农产品出海，信任是第一生产力' : 'In agricultural export, trust is the primary currency',
    heroDescription: isZh
      ? '我们公开展示每一项供应商资质、国际第三方合规认证以及养殖/种植实景，帮助您在商业决策前建立完整的溯源认知。'
      : 'We publicly display every supplier credential, international third-party compliance certification, and farming/cultivation scene to help you build complete traceability awareness before making commercial decisions.',
    certKicker: isZh ? '合规认证' : 'Compliance Certifications',
    sceneKicker: isZh ? '养殖/种植场景' : 'Farming & Cultivation Scenes',
    verifiedLabel: isZh ? '已认证供应商' : 'Verified Supplier',
    supplierSince: isZh ? '供应商' : 'Supplier',
    noCerts: isZh ? '该供应商认证信息正在收集中。' : 'Certification information for this supplier is being collected.',
    noScenes: isZh ? '养殖/种植场景图片正在收集中。' : 'Farming and cultivation scene images are being collected.',
    footerTitle: isZh ? '准备发起询盘？' : 'Ready to start an inquiry?',
    footerDescription: isZh
      ? '在了解供应商资质后，进入询盘中心明确您的采购需求。'
      : 'After reviewing supplier credentials, head to the inquiry desk to specify your sourcing requirements.',
    goToRfq: isZh ? '进入询盘中心' : 'Go to Inquiry Desk',
    browseProducts: isZh ? '浏览出口产品' : 'Browse Export Portfolio',
    certTypeLabels: {
      BUSINESS_LICENSE: isZh ? '营业执照' : 'Business License',
      CUSTOMS_REGISTRATION: isZh ? '海关备案' : 'Customs Registration',
      EXPORT_FOOD_REGISTRATION: isZh ? '出口食品生产企业备案' : 'Export Food Production Registration',
      GAP: 'GAP',
      HACCP: 'HACCP',
      ISO22000: 'ISO 22000',
      ORGANIC: isZh ? '有机认证' : 'Organic Certification',
      OTHER: isZh ? '其他认证' : 'Other Certification'
    } as Record<string, string>
  };
}

export async function generateMetadata({ params }: TraceabilityPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === 'zh';

  return {
    title: isZh ? '资质与溯源' : 'Credentials & Traceability',
    description: isZh
      ? '查看供应商营业执照、海关备案、出口食品生产企业备案及GAP、HACCP、ISO22000等国际第三方合规认证，以及养殖/种植实景。'
      : 'Review supplier business licenses, customs registration, export food production registration, and international certifications including GAP, HACCP, ISO22000, plus farming and cultivation scenes.'
  };
}

function CertBadge({ type, name, issuingBody, certificateNumber, issuedAt, expiresAt, locale }: {
  type: string;
  name: string;
  issuingBody: string | null;
  certificateNumber: string | null;
  issuedAt: string | null;
  expiresAt: string | null;
  locale: string;
}) {
  const isZh = locale === 'zh';
  const now = new Date();
  const isValid = !expiresAt || new Date(expiresAt) > now;

  return (
    <article className={`credential-badge${isValid ? '' : ' credential-badge--expired'}`}>
      <div className="credential-badge__icon">
        {type === 'HACCP' ? '🛡' : type === 'ISO22000' ? '📋' : type === 'GAP' ? '🌱' : type === 'ORGANIC' ? '🍃' : '📜'}
      </div>
      <div className="credential-badge__body">
        <strong>{name}</strong>
        {issuingBody && <span className="credential-badge__issuer">{issuingBody}</span>}
        {certificateNumber && (
          <span className="credential-badge__number">
            {isZh ? '编号: ' : 'No.: '}{certificateNumber}
          </span>
        )}
        <div className="credential-badge__dates">
          {issuedAt && (
            <span>{isZh ? '发证: ' : 'Issued: '}{new Date(issuedAt).toLocaleDateString(isZh ? 'zh-CN' : 'en-US', { year: 'numeric', month: 'short' })}</span>
          )}
          {expiresAt && (
            <span className={isValid ? '' : 'credential-badge__date--expired'}>
              {isZh ? '有效期至: ' : 'Valid until: '}{new Date(expiresAt).toLocaleDateString(isZh ? 'zh-CN' : 'en-US', { year: 'numeric', month: 'short' })}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

function SceneCard({ title, description, imageUrl, locale }: {
  title: string;
  description: string | null;
  imageUrl: string;
  locale: string;
}) {
  return (
    <article className="scene-card">
      <div className="scene-card__media">
        <img alt={title} src={imageUrl} loading="lazy" />
      </div>
      <div className="scene-card__body">
        <h4>{title}</h4>
        {description && <p>{description}</p>}
      </div>
    </article>
  );
}

function SupplierCredentialsSection({ supplier, locale }: {
  supplier: SupplierCredential;
  locale: string;
}) {
  const copy = getCopy(locale);
  const isZh = locale === 'zh';

  return (
    <section className="credential-supplier" data-rise="true">
      <div className="credential-supplier__head">
        <div>
          <span className="section-kicker">{copy.supplierSince}</span>
          <h2>{supplier.supplierName}</h2>
          {supplier.supplierDescription && (
            <p className="credential-supplier__desc">{supplier.supplierDescription}</p>
          )}
          <div className="credential-supplier__meta">
            {supplier.supplierCountry && (
              <span className="catalog-chip">{[supplier.supplierCountry, supplier.supplierCity].filter(Boolean).join(', ')}</span>
            )}
            {supplier.supplierVerified && (
              <span className="catalog-chip">{copy.verifiedLabel}</span>
            )}
          </div>
        </div>
        <div className="button-row">
          <Link className="button button--earth" href="/products">
            {copy.browseProducts}
          </Link>
        </div>
      </div>

      {/* Certifications */}
      <div className="credential-section">
        <span className="section-kicker">{copy.certKicker}</span>
        <h3>{isZh ? '国际第三方合规认证' : 'International Third-Party Compliance Certifications'}</h3>
        {supplier.certifications.length > 0 ? (
          <div className="credential-grid">
            {supplier.certifications.map((cert) => (
              <CertBadge
                key={cert.id}
                type={cert.type}
                name={cert.name}
                issuingBody={cert.issuingBody}
                certificateNumber={cert.certificateNumber}
                issuedAt={cert.issuedAt}
                expiresAt={cert.expiresAt}
                locale={locale}
              />
            ))}
          </div>
        ) : (
          <p className="credential-empty">{copy.noCerts}</p>
        )}
      </div>

      {/* Scenes */}
      <div className="credential-section">
        <span className="section-kicker">{copy.sceneKicker}</span>
        <h3>{isZh ? '产品养殖/种植实景' : 'Farming & Cultivation Scenes'}</h3>
        {supplier.scenes.length > 0 ? (
          <div className="scene-grid">
            {supplier.scenes.map((scene) => (
              <SceneCard
                key={scene.id}
                title={scene.title}
                description={scene.description}
                imageUrl={scene.imageUrl}
                locale={locale}
              />
            ))}
          </div>
        ) : (
          <p className="credential-empty">{copy.noScenes}</p>
        )}
      </div>
    </section>
  );
}

export default async function TraceabilityPage({ params }: TraceabilityPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const copy = getCopy(locale);

  const suppliers = await getAllSuppliersWithCredentials();

  return (
    <main className="page-shell">
      {/* Hero */}
      <section className="traceability-hero" data-rise="true">
        <span className="section-kicker">{copy.heroKicker}</span>
        <h1 className="hero-title">{copy.heroTitle}</h1>
        <p className="hero-stage__lead">{copy.heroDescription}</p>
      </section>

      {/* Supplier Credential Sections */}
      {suppliers.length > 0 ? (
        suppliers.map((supplier) => (
          <SupplierCredentialsSection key={supplier.supplierId} supplier={supplier} locale={locale} />
        ))
      ) : (
        <section className="section-card" data-rise="true">
          <div className="section-head">
            <h2>{locale === 'zh' ? '供应商资质信息正在收集中' : 'Supplier credential information is being collected'}</h2>
            <p className="section-description">
              {locale === 'zh'
                ? '目前暂无已认证供应商的资质数据。请联系平台运营团队了解更多信息。'
                : 'No verified supplier credential data is available yet. Please contact the platform operations team for more information.'}
            </p>
          </div>
        </section>
      )}

      {/* Footer CTA */}
      <section className="closing-banner" data-rise="true">
        <div>
          <span className="section-kicker">{locale === 'zh' ? '下一步' : 'Next Step'}</span>
          <h2 className="section-title">{copy.footerTitle}</h2>
          <p>{copy.footerDescription}</p>
        </div>
        <div className="button-row">
          <Link className="button" href="/rfq">
            {copy.goToRfq}
          </Link>
        </div>
      </section>
    </main>
  );
}
