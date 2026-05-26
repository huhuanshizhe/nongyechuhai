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
  const missingFieldLabels: Record<string, string> = isZh
    ? {
        customerName: '联系人姓名',
        customerCompany: '公司名称',
        customerEmail: '商务邮箱',
        customerPhone: '电话或 WhatsApp',
        customerCountry: '目的地市场',
        quantityRequested: '目标数量',
        targetPrice: '目标价格',
        currency: '币种',
        requirements: '采购要求'
      }
    : {
        customerName: 'Contact name',
        customerCompany: 'Company',
        customerEmail: 'Business email',
        customerPhone: 'Phone or WhatsApp',
        customerCountry: 'Destination market',
        quantityRequested: 'Target quantity',
        targetPrice: 'Target price',
        currency: 'Currency',
        requirements: 'Requirements'
      };
  const [messages, setMessages] = useState<InquiryAgentMessage[]>([
    {
      role: 'assistant',
      content: isZh
        ? `您好，我是在线询盘助手。您可以直接告诉我想采购的产品或品类、目的地市场、预计数量、包装和认证要求，我会边答复边帮您整理到正式询盘中。${selectedProduct?.name ? ` 如果您是从 ${selectedProduct.name} 这个页面进入，我可以先按这个方向继续；如果您要咨询其他产品，也可以直接说明。` : ''}`
        : `Hello, I am your online inquiry assistant. Tell me what product or category you need to source, which market you are targeting, expected volume, pack format, and certification requirements. I will answer your questions and help prepare a clear inquiry for our team.${selectedProduct?.name ? ` If you arrived from the ${selectedProduct.name} page, I can start from that context, but you can also switch to a different product at any time.` : ''}`
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<InquiryAgentResult | null>(null);

  const quickPrompts = isZh
    ? [
        selectedProduct?.name
          ? `如果先从 ${selectedProduct.name} 这条线开始，需要先确认哪些规格、包装和起订量？`
          : '我们想咨询平台当前没有展示的产品，应该先提供哪些关键信息？',
        '我们准备销往中东市场，需要先确认哪些认证和包装信息？',
        '请帮我把当前需求整理成一条清晰的询盘。'
      ]
    : [
        selectedProduct?.name
          ? `If we start with ${selectedProduct.name}, which specifications, pack details, and MOQ points should we confirm first?`
          : 'We need a product that is not currently shown on the platform. What should we clarify first?',
        'We plan to sell into the Middle East. Which certifications and pack details should we confirm first?',
        'Help me turn our sourcing idea into a clear inquiry message.'
      ];

  const readinessLabels = {
    discovering: isZh ? '正在收集需求' : 'Collecting inquiry details',
    qualified: isZh ? '可进入报价沟通' : 'Ready for quote follow-up',
    ready_to_submit: isZh ? '可提交正式询盘' : 'Ready to submit'
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
          <span className="section-kicker">{isZh ? '在线询盘助手' : 'Online inquiry assistant'}</span>
          <h3>{isZh ? '先把采购方向和需求聊清楚，再提交正式询盘' : 'Clarify the sourcing direction first, then submit the formal inquiry'}</h3>
        </div>
        <div className="inquiry-agent-panel__status">
          {result ? (
            <span className={`status-pill ${result.readiness === 'ready_to_submit' ? 'status-pill--green' : result.readiness === 'qualified' ? 'status-pill--earth' : 'status-pill--amber'}`}>
              {readinessLabels[result.readiness]}
            </span>
          ) : null}
        </div>
      </div>

      <p className="inquiry-agent-panel__intro">
        {isZh
          ? '您可以直接描述想采购的产品或品类，无论平台当前是否展示。助手会把有效信息同步到下方询盘表单。'
          : 'Describe the product or category you need, whether it is already listed on the platform or not. The assistant will sync the useful details into the inquiry form below.'}
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
            ? '例如：我们想找平台目录里没有完全对应的冷冻蔬菜产品，先试单 1 个柜，销往迪拜，需要英文阿文标签。'
            : 'Example: We need a frozen vegetable line that is not exactly shown in the current catalog. We want a trial container for Dubai and need English and Arabic labeling.'}
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
          <div className="inquiry-agent-briefing__grid">
            <div>
              <strong>{isZh ? '提交前还需确认' : 'Still needed before submission'}</strong>
              {result.missingFields.length > 0 ? (
                <ul className="inquiry-agent-tag-list">
                  {result.missingFields.map((field) => (
                    <li key={field}>{missingFieldLabels[field] ?? field}</li>
                  ))}
                </ul>
              ) : (
                <p>{isZh ? '主要信息已经齐备，您可以检查表单后提交。' : 'The main details are in place. You can review the form and submit.'}</p>
              )}
            </div>

            <div>
              <strong>{isZh ? '建议下一步确认' : 'Suggested next points to confirm'}</strong>
              {result.briefing.nextQuestions && result.briefing.nextQuestions.length > 0 ? (
                <ul className="inquiry-agent-list">
                  {result.briefing.nextQuestions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>{isZh ? '现在可以检查表单并提交。' : 'You can now review the form and submit.'}</p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}