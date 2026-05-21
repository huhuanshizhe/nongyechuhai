'use client';

import { useState } from 'react';
import type { ProductCopyResult } from '@nongyechuhai/ai';

type AiGenerateButtonProps = {
  productId: string;
  locale: string;
  onApply: (result: ProductCopyResult) => void;
};

export function AiGenerateButton({ productId, locale, onApply }: AiGenerateButtonProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProductCopyResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isZh = locale === 'zh';

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/ai/product-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });

      if (!res.ok) {
        throw new Error(isZh ? '生成失败' : 'Generation failed');
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : isZh ? '未知错误' : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (result) {
      onApply(result);
      setResult(null);
    }
  };

  return (
    <div className="ai-assist-section">
      <button
        type="button"
        className="button button--ai"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? (isZh ? '生成中...' : 'Generating...') : (isZh ? 'AI生成文案' : 'AI Generate Copy')}
      </button>

      {error && <p className="error-message">{error}</p>}

      {result && (
        <div className="ai-result-card">
          <h3>{isZh ? '生成结果' : 'Generated Content'}</h3>
          <div className="ai-result-fields">
            <div className="ai-result-field">
              <label>{isZh ? '简要介绍' : 'Summary'}</label>
              <p>{result.summary}</p>
            </div>
            <div className="ai-result-field">
              <label>{isZh ? '详细描述' : 'Description'}</label>
              <p>{result.description}</p>
            </div>
            <div className="ai-result-field">
              <label>{isZh ? 'SEO标题' : 'SEO Title'}</label>
              <p>{result.seoTitle}</p>
            </div>
            <div className="ai-result-field">
              <label>{isZh ? 'SEO描述' : 'SEO Description'}</label>
              <p>{result.seoDescription}</p>
            </div>
          </div>
          <div className="ai-result-actions">
            <button type="button" className="button" onClick={handleApply}>
              {isZh ? '应用到表单' : 'Apply to form'}
            </button>
            <button type="button" className="button button--ghost" onClick={() => setResult(null)}>
              {isZh ? '取消' : 'Cancel'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}