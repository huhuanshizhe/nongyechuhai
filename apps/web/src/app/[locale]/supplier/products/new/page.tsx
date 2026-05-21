import { setRequestLocale } from 'next-intl/server';
import { getProductCategories, createProduct } from '../../actions';
import { redirect } from '../../../../../i18n/routing';

type NewProductProps = {
  params: Promise<{ locale: string }>;
};

export default async function NewProductPage({ params }: NewProductProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isZh = locale === 'zh';

  const categories = await getProductCategories();

  async function handleCreateProduct(formData: FormData) {
    'use server';
    const product = await createProduct(formData);
    redirect({ href: `/supplier/products/${product.id}`, locale });
  }

  return (
    <section className="section-block">
      <div className="shell">
        <span className="section-kicker">{isZh ? '添加产品' : 'Add product'}</span>
        <h1>{isZh ? '创建新产品' : 'Create new product'}</h1>

        <div className="form-card">
          <form action={handleCreateProduct} className="form-stack">
            <div className="form-field">
              <label className="form-label">{isZh ? '产品名称' : 'Product name'} *</label>
              <input
                type="text"
                name="name"
                className="form-input"
                required
                placeholder={isZh ? '产品名称' : 'Product name'}
              />
            </div>

            <div className="form-field">
              <label className="form-label">{isZh ? '品类' : 'Category'} *</label>
              <select name="categoryId" className="form-select" required>
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
                placeholder={isZh ? '简短描述（用于列表展示）' : 'Short description for listing'}
              />
            </div>

            <div className="form-field">
              <label className="form-label">{isZh ? '详细描述' : 'Description'}</label>
              <textarea
                name="description"
                className="form-textarea"
                rows={6}
                placeholder={isZh ? '产品详细描述...' : 'Detailed product description...'}
              />
            </div>

            <div className="form-row">
              <div className="form-field">
                <label className="form-label">{isZh ? '品牌' : 'Brand'}</label>
                <input
                  type="text"
                  name="brand"
                  className="form-input"
                  placeholder={isZh ? '品牌名称' : 'Brand name'}
                />
              </div>

              <div className="form-field">
                <label className="form-label">{isZh ? '型号' : 'Model'}</label>
                <input
                  type="text"
                  name="model"
                  className="form-input"
                  placeholder={isZh ? '产品型号' : 'Product model'}
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
                  placeholder={isZh ? '最低价格' : 'Minimum price'}
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
                  placeholder={isZh ? '最高价格' : 'Maximum price'}
                />
              </div>

              <div className="form-field">
                <label className="form-label">{isZh ? '币种' : 'Currency'}</label>
                <select name="currency" className="form-select" defaultValue="USD">
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="CNY">CNY</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="button">{isZh ? '创建产品' : 'Create product'}</button>
              <a href="/supplier/products" className="button button--ghost">{isZh ? '取消' : 'Cancel'}</a>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}