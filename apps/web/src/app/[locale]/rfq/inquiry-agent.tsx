'use client';

import { useEffect, useRef, useState } from 'react';
import type {
  InquiryAgentFormDraft,
  InquiryAgentMessage,
  InquiryAgentProductContext,
  InquiryAgentResult
} from '@nongyechuhai/ai';

type InquiryAgentProps = {
  locale: string;
  formDraft: InquiryAgentFormDraft;
  selectedProduct: InquiryAgentProductContext | null;
  onSync: (result: InquiryAgentResult, messages: InquiryAgentMessage[]) => void;
};

export function InquiryAgent({ locale, formDraft, selectedProduct, onSync }: InquiryAgentProps) {
  const isZh = locale === 'zh';
  const panelRef = useRef<HTMLDivElement | null>(null);
  const composerRef = useRef<HTMLTextAreaElement | null>(null);
  const [messages, setMessages] = useState<InquiryAgentMessage[]>([
    {
      role: 'assistant',
      content: isZh
        ? `您好，我是询盘助手。您可以直接告诉我您想采购什么产品、销往哪个国家、预计数量、包装和认证要求，我会边答复边帮您整理成正式询盘。${selectedProduct?.name ? ` 当前已选产品是 ${selectedProduct.name}。` : ''}`
        : `Hello, I am your inquiry assistant. Tell me what you need to source, which market you are targeting, expected volume, pack format, and certification requirements. I will answer your questions and organize the details into a qualified inquiry.${selectedProduct?.name ? ` The currently selected product is ${selectedProduct.name}.` : ''}`
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<InquiryAgentResult | null>(null);

  const quickPrompts = isZh
    ? [
        selectedProduct?.name
          ? `${selectedProduct.name} 这条线常见的出口包装和起订沟通点有哪些？`
          : '我们是进口商，想了解你们适合怎么开始询盘。',
        '我们准备销往中东市场，需要先确认哪些认证和包装信息？',
        '请帮我整理一份适合提交询盘的采购需求清单。'
      ]
    : [
        selectedProduct?.name
          ? `What export pack formats and MOQ discussion points should we confirm for ${selectedProduct.name}?`
          : 'We are an importer. Help us start with the right inquiry structure.',
        'We plan to sell into the Middle East. Which certifications and pack details should we confirm first?',
        'Help me turn our sourcing idea into a submission-ready inquiry brief.'
      ];

  const readinessLabels = {
    discovering: isZh ? '需求摸底中' : 'Discovery in progress',
    qualified: isZh ? '已具备商务跟进条件' : 'Commercially qualified',
    ready_to_submit: isZh ? '可直接提交正式询盘' : 'Ready to submit'
  } as const;

  useEffect(() => {
    if (window.location.hash !== '#inquiry-agent') {
      return;
    }

    panelRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    composerRef.current?.focus();
  }, []);

  const sendMessage = async (content: string) => {
    const trimmed = content.trim();

    if (!trimmed || loading) {
      return;
    }

    setLoading(true);
    setError(null);
    setInputValue('');

    const nextMessages = [
      ...messages,
      {
        role: 'user' as const,
        content: trimmed
      }
    ];

    setMessages(nextMessages);

    try {
      const response = await fetch('/api/ai/inquiry-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          locale,
          messages: nextMessages,
          formDraft,
          selectedProduct
        })
      });

      if (!response.ok) {
        throw new Error(isZh ? '询盘助手暂时不可用，请稍后再试。' : 'The inquiry assistant is temporarily unavailable. Please try again.');
      }

      const data = await response.json() as InquiryAgentResult;
      const finalMessages = [
        ...nextMessages,
        {
          role: 'assistant' as const,
          content: data.reply
        }
      ];

      setMessages(finalMessages);
      setResult(data);
      onSync(data, finalMessages);
    } catch (requestError) {
      setMessages(messages);
      setError(requestError instanceof Error ? requestError.message : (isZh ? '发生未知错误。' : 'An unknown error occurred.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="field field--full inquiry-agent-panel" id="inquiry-agent" ref={panelRef}>
      <div className="inquiry-agent-panel__head">
        <div>
          <span className="section-kicker">{isZh ? '询盘智能体' : 'Inquiry co-pilot'}</span>
          <h3>{isZh ? '专业答复业务问题，并逐步补全客户与需求信息' : 'Answer business questions and progressively qualify the buyer brief'}</h3>
        </div>
        <div className="inquiry-agent-panel__status">
          {result?.briefing.industryLabel ? (
            <span className="status-pill status-pill--slate">{result.briefing.industryLabel}</span>
          ) : null}
          {result ? (
            <span className={`status-pill ${result.readiness === 'ready_to_submit' ? 'status-pill--green' : result.readiness === 'qualified' ? 'status-pill--earth' : 'status-pill--amber'}`}>
              {readinessLabels[result.readiness]}
            </span>
          ) : null}
        </div>
      </div>

      <p className="inquiry-agent-panel__intro">
        {isZh
          ? '先用自然对话说明采购场景、市场、规格和商务限制。智能体会提炼有效信息，并回填到下方正式询盘表单。'
          : 'Start with natural conversation about market, specification, volume, and commercial constraints. The agent will extract the useful details and sync them into the formal inquiry form below.'}
      </p>

      <div className="inquiry-agent-messages" aria-live="polite">
        {messages.map((message, index) => (
          <article
            key={`${message.role}-${index}`}
            className={`inquiry-agent-message inquiry-agent-message--${message.role}`}
          >
            <strong>{message.role === 'assistant' ? (isZh ? '询盘助手' : 'Inquiry assistant') : (isZh ? '您' : 'You')}</strong>
            <p>{message.content}</p>
          </article>
        ))}
      </div>

      <div className="inquiry-agent-composer">
        <textarea
          ref={composerRef}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder={isZh
            ? '例如：我们是迪拜进口商，想做清真即食鸡肉餐，先试单 1 个柜，需要英文阿文标签。'
            : 'Example: We are an importer in Dubai looking at halal ready meals. We want a trial container first and need English/Arabic labeling.'}
        />
        <div className="inquiry-agent-actions">
          <button
            type="button"
            className="button button--ai"
            onClick={() => sendMessage(inputValue)}
            disabled={loading}
          >
            {loading ? (isZh ? '分析中...' : 'Analyzing...') : (isZh ? '发送给询盘助手' : 'Send to inquiry assistant')}
          </button>
        </div>
      </div>

      {error ? <p className="error-message">{error}</p> : null}

      <div className="inquiry-agent-suggestions">
        {(result?.suggestedQuestions?.length ? result.suggestedQuestions : quickPrompts).slice(0, 3).map((question) => (
          <button
            key={question}
            type="button"
            className="button button--ghost button--small"
            onClick={() => sendMessage(question)}
            disabled={loading}
          >
            {question}
          </button>
        ))}
      </div>

      {result ? (
        <div className="inquiry-agent-briefing">
          <div className="inquiry-agent-briefing__summary">
            <strong>{isZh ? '当前买家简报' : 'Current buyer brief'}</strong>
            <p>{result.briefingSummary}</p>
          </div>

          <div className="inquiry-agent-briefing__grid">
            <div>
              <strong>{isZh ? '仍待确认' : 'Still needed'}</strong>
              {result.missingFields.length > 0 ? (
                <ul className="inquiry-agent-tag-list">
                  {result.missingFields.map((field) => (
                    <li key={field}>{field}</li>
                  ))}
                </ul>
              ) : (
                <p>{isZh ? '核心字段已经基本齐备。' : 'Core fields are now mostly complete.'}</p>
              )}
            </div>

            <div>
              <strong>{isZh ? '下一步建议' : 'Suggested next questions'}</strong>
              {result.briefing.nextQuestions && result.briefing.nextQuestions.length > 0 ? (
                <ul className="inquiry-agent-list">
                  {result.briefing.nextQuestions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>{isZh ? '可直接检查表单并提交。' : 'You can now review the form and submit.'}</p>
              )}
            </div>
          </div>

          {(result.briefing.qualificationChecklist?.length || result.briefing.recommendedDocuments?.length || result.briefing.logisticsNotes?.length) ? (
            <div className="inquiry-agent-briefing__stack">
              {result.briefing.qualificationChecklist?.length ? (
                <div>
                  <strong>{isZh ? '行业核实清单' : 'Industry qualification checklist'}</strong>
                  <ul className="inquiry-agent-list">
                    {result.briefing.qualificationChecklist.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {result.briefing.recommendedDocuments?.length ? (
                <div>
                  <strong>{isZh ? '建议提前准备的文件' : 'Recommended documents to prepare'}</strong>
                  <ul className="inquiry-agent-list">
                    {result.briefing.recommendedDocuments.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {result.briefing.logisticsNotes?.length ? (
                <div>
                  <strong>{isZh ? '物流与交付关注点' : 'Logistics and delivery watchpoints'}</strong>
                  <ul className="inquiry-agent-list">
                    {result.briefing.logisticsNotes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}