import { setRequestLocale } from 'next-intl/server';
import { getSupplierProfile, updateSupplierProfile } from '../actions';

type SupplierProfileProps = {
  params: Promise<{ locale: string }>;
};

export default async function SupplierProfilePage({ params }: SupplierProfileProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isZh = locale === 'zh';

  const supplier = await getSupplierProfile();
  if (!supplier) return null;

  return (
    <section className="section-block">
      <div className="shell">
        <span className="section-kicker">{isZh ? '供应商资料' : 'Supplier profile'}</span>
        <h1>{isZh ? '供应商信息' : 'Supplier information'}</h1>

        <div className="form-card">
          <form action={updateSupplierProfile} className="form-stack">
            <div className="form-field">
              <label className="form-label">{isZh ? '公司简介' : 'Company description'}</label>
              <textarea
                name="description"
                className="form-textarea"
                rows={4}
                defaultValue={supplier.description ?? ''}
                placeholder={isZh ? '介绍您的公司背景、主营业务、优势产品等...' : 'Describe your company background, main business, and key products...'}
              />
            </div>

            <div className="form-row">
              <div className="form-field">
                <label className="form-label">{isZh ? '联系人姓名' : 'Contact name'}</label>
                <input
                  type="text"
                  name="contactName"
                  className="form-input"
                  defaultValue={supplier.contactName ?? ''}
                  placeholder={isZh ? '联系人姓名' : 'Contact person name'}
                />
              </div>

              <div className="form-field">
                <label className="form-label">{isZh ? '联系邮箱' : 'Contact email'}</label>
                <input
                  type="email"
                  name="contactEmail"
                  className="form-input"
                  defaultValue={supplier.contactEmail ?? ''}
                  placeholder={isZh ? '商务邮箱' : 'Business email'}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label className="form-label">{isZh ? '联系电话' : 'Contact phone'}</label>
                <input
                  type="tel"
                  name="contactPhone"
                  className="form-input"
                  defaultValue={supplier.contactPhone ?? ''}
                  placeholder={isZh ? '电话号码' : 'Phone number'}
                />
              </div>

              <div className="form-field">
                <label className="form-label">{isZh ? 'Logo URL' : 'Logo URL'}</label>
                <input
                  type="url"
                  name="logoUrl"
                  className="form-input"
                  defaultValue={supplier.logoUrl ?? ''}
                  placeholder={isZh ? 'Logo图片链接' : 'Logo image URL'}
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="button">{isZh ? '保存更改' : 'Save changes'}</button>
            </div>
          </form>
        </div>

        <div className="info-card">
          <h2>{isZh ? '资质信息' : 'Qualification info'}</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">{isZh ? '审核状态' : 'Review status'}</span>
              <span className={`status-badge status-badge--${supplier.status.toLowerCase()}`}>
                {supplier.status === 'APPROVED' ? (isZh ? '已认证' : 'Verified') :
                 supplier.status === 'PENDING' ? (isZh ? '审核中' : 'Pending') :
                 supplier.status === 'REJECTED' ? (isZh ? '已拒绝' : 'Rejected') :
                 (isZh ? '已暂停' : 'Suspended')}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">{isZh ? '认证标识' : 'Verified badge'}</span>
              <span>{supplier.isVerified ? (isZh ? '已认证' : 'Yes') : (isZh ? '未认证' : 'No')}</span>
            </div>
            <div className="info-item">
              <span className="info-label">{isZh ? '税号' : 'Tax ID'}</span>
              <span>{supplier.taxId ?? (isZh ? '未填写' : 'Not provided')}</span>
            </div>
            <div className="info-item">
              <span className="info-label">{isZh ? '营业执照' : 'Business license'}</span>
              {supplier.businessLicenseUrl ? (
                <a href={supplier.businessLicenseUrl} target="_blank" rel="noopener noreferrer" className="link">
                  {isZh ? '查看文件' : 'View file'}
                </a>
              ) : (
                <span>{isZh ? '未上传' : 'Not uploaded'}</span>
              )}
            </div>
            {supplier.approvedAt && (
              <div className="info-item">
                <span className="info-label">{isZh ? '认证日期' : 'Approved date'}</span>
                <span>{new Date(supplier.approvedAt).toLocaleDateString(isZh ? 'zh-CN' : 'en-US')}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}