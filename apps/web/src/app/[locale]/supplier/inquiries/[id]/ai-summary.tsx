'use client';

import { useState } from 'react';
import type { InquirySummaryResult } from '@nongyechuhai/ai';

type AiSummaryButtonProps = {
  inquiryId: string;
  locale: string;
};

export function AiSummaryButton({ inquiryId, locale }: AiSummaryButtonProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InquirySummaryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const isZh = locale === 'zh';

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/ai/inquiry-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inquiryId })
      });

      if (!res.ok) {
        throw new Error(isZh ? '生成失败' : 'Generation failed');
      }

      const data = await res.json();
      setResult(data);
      setShowDetails(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : isZh ? '未知错误' : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const urgencyColors: Record<'low' | 'medium' | 'high', string> = {
    low: 'status-badge--success',
    medium: 'status-badge--warning',
    high: 'status-badge--danger'
  };

  const urgencyLabels: Record<'low' | 'medium' | 'high', string> = {
    low: isZh ? '低优先级' : 'Low priority',
    medium: isZh ? '中等优先级' : 'Medium priority',
    high: isZh ? '高优先级' : 'High priority'
  };

  return (
    <div className="ai-summary-section">
      <button
        type="button"
        className="button button--ai"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? (isZh ? '分析中...' : 'Analyzing...') : (isZh ? 'AI询盘分析' : 'AI Inquiry Analysis')}
      </button>

      {error && <p className="error-message">{error}</p>}

      {result && showDetails && (
        <div className="ai-summary-card">
          <div className="ai-summary-header">
            <h3>{isZh ? '询盘分析结果' : 'Inquiry Analysis'}</h3>
            <span className={`status-badge ${urgencyColors[result.urgencyLevel as 'low' | 'medium' | 'high']}`}>
              {urgencyLabels[result.urgencyLevel as 'low' | 'medium' | 'high']}
            </span>
          </div>

          <div className="ai-summary-body">
            <div className="ai-summary-field">
              <strong>{isZh ? '摘要' : 'Summary'}</strong>
              <p>{result.summary}</p>
            </div>

            <div className="ai-summary-field">
              <strong>{isZh ? '关键要点' : 'Key Points'}</strong>
              <ul className="key-points-list">
                {result.keyPoints.map((point: string, idx: number) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </div>

            <div className="ai-summary-field">
              <strong>{isZh ? '建议回复' : 'Suggested Response'}</strong>
              <div className="suggested-response-box">
                <p>{result.suggestedResponse}</p>
              </div>
            </div>
          </div>

          <div className="ai-summary-actions">
            <button
              type="button"
              className="button button--small button--ghost"
              onClick={() => setShowDetails(false)}
            >
              {isZh ? '关闭' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}