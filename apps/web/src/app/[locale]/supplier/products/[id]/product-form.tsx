'use client';

import { useState } from 'react';
import type { ProductCategory, ProductImage, ProductStatus } from '@prisma/client';
import type { ProductCopyResult } from '@nongyechuhai/ai';
import { AiGenerateButton } from './ai-button';
import { Link } from '../../../../../i18n/routing';

type ProductFormProps = {
  product: {
    id: string;
    name: string;
    summary: string | null;
    description: string | null;
    brand: string | null;
    model: string | null;
    categoryId: string;
    priceMin: number | null;
    priceMax: number | null;
    status: ProductStatus;
    slug: string;
    images: ProductImage[];
  };
  categories: ProductCategory[];
  locale: string;
  onSubmit: (formData: FormData) => void;
  onSubmitForReview: () => void;
};

export function ProductForm({ product, categories, locale, onSubmit, onSubmitForReview }: ProductFormProps) {
  const [formState, setFormState] = useState({
    summary: product.summary ?? '',
    description: product.description ?? '',
    seoTitle: '',
    seoDescription: ''
  });

  const isZh = locale === 'zh';

  const handleAiApply = (result: ProductCopyResult) => {
    setFormState(prev => ({
      ...prev,
      summary: result.summary,
      description: result.description,
      seoTitle: result.seoTitle,
      seoDescription: result.seoDescription
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit(formData);
  };

  return (
    <div className="form-card">
      <form onSubmit={handleSubmit} className="form-stack">
        <input type="hidden" name="productId" value={product.id} />
        <input type="hidden" name="seoTitle" value={formState.seoTitle} />
        <input type="hidden" name="seoDescription" value={formState.seoDescription} />

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
            value={formState.summary}
            onChange={e => setFormState(prev => ({ ...prev, summary: e.target.value }))}
          />
        </div>

        <div className="form-field">
          <label className="form-label">{isZh ? '详细描述' : 'Description'}</label>
          <textarea
            name="description"
            className="form-textarea"
            rows={6}
            value={formState.description}
            onChange={e => setFormState(prev => ({ ...prev, description: e.target.value }))}
          />
        </div>

        {/* AI Generation Button */}
        <AiGenerateButton productId={product.id} locale={locale} onApply={handleAiApply} />

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

        {formState.seoTitle && (
          <div className="info-card">
            <h4>{isZh ? 'SEO设置' : 'SEO Settings'}</h4>
            <p><strong>{isZh ? 'SEO标题' : 'SEO Title'}:</strong> {formState.seoTitle}</p>
            <p><strong>{isZh ? 'SEO描述' : 'SEO Description'}:</strong> {formState.seoDescription}</p>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="button">{isZh ? '保存更改' : 'Save changes'}</button>
          {product.status === 'DRAFT' && (
            <button type="button" className="button button--primary" onClick={onSubmitForReview}>
              {isZh ? '提交审核' : 'Submit for review'}
            </button>
          )}
          <Link className="button button--ghost" href="/supplier/products">{isZh ? '返回' : 'Back'}</Link>
        </div>
      </form>
    </div>
  );
}