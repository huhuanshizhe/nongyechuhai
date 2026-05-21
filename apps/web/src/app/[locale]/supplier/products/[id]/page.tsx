import { setRequestLocale } from 'next-intl/server';
import { Link } from '../../../../../i18n/routing';
import { getProductForEdit, getProductCategories, updateProduct, submitProductForReview, deleteProduct } from '../../actions';
import type { ProductStatus } from '@prisma/client';
import { AiGenerateButton } from './ai-button';

type EditProductProps = {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ submit?: string }>;
};

export default async function EditProductPage({ params, searchParams }: EditProductProps) {
  const { locale, id } = await params;
  const { submit } = await searchParams;
  setRequestLocale(locale);
  const isZh = locale === 'zh';

  const [product, categories] = await Promise.all([
    getProductForEdit(id),
    getProductCategories()
  ]);

  if (!product) {
    return (
      <section className="section-block">
        <div className="shell">
          <div className="not-found-card">
            <h3>{isZh ? '产品不存在' : 'Product not found'}</h3>
            <Link className="button" href="/supplier/products">{isZh ? '返回产品列表' : 'Back to products'}</Link>
          </div>
        </div>
      </section>
    );
  }

  // Handle submit for review action
  if (submit === 'true' && product.status === 'DRAFT') {
    await submitProductForReview(id);
  }

  return (
    <section className="section-block">
      <div className="shell">
        <span className="section-kicker">{isZh ? '编辑产品' : 'Edit product'}</span>
        <h1>{product.name}</h1>

        <div className="status-bar">
          <span className={`status-badge status-badge--${product.status.toLowerCase()}`}>
            {isZh ? statusZh(product.status) : product.status}
          </span>
          {product.status === 'REJECTED' && (
            <span className="status-note">{isZh ? '请修改后重新提交审核' : 'Please edit and resubmit for review'}</span>
          )}
        </div>

        <div className="form-card">
          <form action={updateProduct} className="form-stack">
            <input type="hidden" name="productId" value={product.id} />

            <div className="form-field">
              <label className="form-label">{isZh ? '产品名称' : 'Product name'} *</label>
              <input
                type="text"
                name="name"
                className="form-input"
                required
                defaultValue={product.name}
              />
            </div>

            <div className="form-field">
              <label className="form-label">{isZh ? '品类' : 'Category'} *</label>
              <select name="categoryId" className="form-select" required defaultValue={product.categoryId}>
                <option value="">{isZh ? '选择品类' : 'Select category'}</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">{isZh ? '简要介绍' : 'Summary'}</label>
              <input
                type="text"
                name="summary"
                className="form-input"
                defaultValue={product.summary ?? ''}
              />
            </div>

            <div className="form-field">
              <label className="form-label">{isZh ? '详细描述' : 'Description'}</label>
              <textarea
                name="description"
                className="form-textarea"
                rows={6}
                defaultValue={product.description ?? ''}
              />
            </div>

            {/* AI Assist Section */}
            <div className="ai-assist-section">
              <AiGenerateButton productId={product.id} locale={locale} onApply={() => {
                // Client-side form update handled by separate component
              }} />
              <p className="ai-assist-note">
                {isZh ? '使用AI自动生成产品文案，包括简要介绍、详细描述和SEO内容。' : 'Use AI to auto-generate product copy including summary, description, and SEO content.'}
              </p>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label className="form-label">{isZh ? '品牌' : 'Brand'}</label>
                <input
                  type="text"
                  name="brand"
                  className="form-input"
                  defaultValue={product.brand ?? ''}
                />
              </div>

              <div className="form-field">
                <label className="form-label">{isZh ? '型号' : 'Model'}</label>
                <input
                  type="text"
                  name="model"
                  className="form-input"
                  defaultValue={product.model ?? ''}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label className="form-label">{isZh ? '最低价格' : 'Min price'}</label>
                <input
                  type="number"
                  name="priceMin"
                  className="form-input"
                  step="0.01"
                  min="0"
                  defaultValue={product.priceMin?.toString() ?? ''}
                />
              </div>

              <div className="form-field">
                <label className="form-label">{isZh ? '最高价格' : 'Max price'}</label>
                <input
                  type="number"
                  name="priceMax"
                  className="form-input"
                  step="0.01"
                  min="0"
                  defaultValue={product.priceMax?.toString() ?? ''}
                />
              </div>
            </div>

            {product.status !== 'PUBLISHED' && (
              <div className="form-field">
                <label className="form-label">{isZh ? '产品状态' : 'Product status'}</label>
                <select name="status" className="form-select" defaultValue={product.status}>
                  <option value="DRAFT">{isZh ? '草稿' : 'Draft'}</option>
                  <option value="PENDING_REVIEW">{isZh ? '待审核' : 'Pending Review'}</option>
                </select>
              </div>
            )}

            <div className="form-actions">
              <button type="submit" className="button">{isZh ? '保存更改' : 'Save changes'}</button>
              {product.status === 'DRAFT' && (
                <button type="button" className="button button--primary" formAction={() => submitProductForReview(id)}>
                  {isZh ? '提交审核' : 'Submit for review'}
                </button>
              )}
              <Link className="button button--ghost" href="/supplier/products">{isZh ? '返回' : 'Back'}</Link>
            </div>
          </form>
        </div>

        {product.status === 'PUBLISHED' && (
          <div className="info-card">
            <h3>{isZh ? '产品已发布' : 'Product is published'}</h3>
            <p>{isZh ? '该产品已上线，可在前台页面查看。' : 'This product is live and visible on the storefront.'}</p>
            <Link className="button button--ghost" href={`/products/${product.slug}`}>
              {isZh ? '查看产品页面' : 'View product page'}
            </Link>
          </div>
        )}

        {product.images.length > 0 && (
          <div className="info-card">
            <h3>{isZh ? '产品图片' : 'Product images'}</h3>
            <div className="image-grid">
              {product.images.map(img => (
                <img key={img.id} src={img.url} alt={img.altText ?? product.name} className="image-grid__item" />
              ))}
            </div>
          </div>
        )}

        <div className="danger-zone">
          <h3>{isZh ? '危险操作' : 'Danger zone'}</h3>
          <p>{isZh ? '删除产品将使其不再显示，但数据会保留。' : 'Deleting will hide the product but data is retained.'}</p>
          <button
            type="button"
            className="button button--danger"
            onClick={() => { if (confirm(isZh ? '确认删除此产品？' : 'Delete this product?')) deleteProduct(id); }}
          >
            {isZh ? '删除产品' : 'Delete product'}
          </button>
        </div>
      </div>
    </section>
  );
}

function statusZh(status: ProductStatus): string {
  const map: Record<ProductStatus, string> = {
    DRAFT: '草稿',
    PENDING_REVIEW: '待审核',
    APPROVED: '已通过',
    REJECTED: '已拒绝',
    PUBLISHED: '已发布',
    OFFLINE: '已下架'
  };
  return map[status] ?? status;
}