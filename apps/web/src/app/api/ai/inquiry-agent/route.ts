import { NextRequest, NextResponse } from 'next/server';
import type {
  InquiryAgentFormDraft,
  InquiryAgentMessage,
  InquiryAgentProductContext
} from '@nongyechuhai/ai';
import { generateInquiryAgentReply, resolveInquiryAgentIndustryPlaybook } from '@nongyechuhai/ai';
import { prisma } from '@nongyechuhai/db';
import { createAppAuth } from '@nongyechuhai/auth';

const { auth } = createAppAuth();

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    baseDelayMs?: number;
    onRetry?: (attempt: number, error: unknown) => void;
  } = {}
): Promise<T> {
  const { maxRetries = 3, baseDelayMs = 1000, onRetry } = options;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }

      const status = (error as { status?: number })?.status;
      if (status !== 429 && status !== 503 && status !== 502) {
        throw error;
      }

      const waitMs = baseDelayMs * Math.pow(2, attempt);
      onRetry?.(attempt + 1, error);
      await delay(waitMs);
    }
  }

  throw new Error('Unreachable');
}

function extractQuantity(text: string) {
  const match = text.match(/\b(\d{2,}(?:,\d{3})*)\b/);

  if (!match) {
    return null;
  }

  const parsed = Number(match[1].replaceAll(',', ''));
  return Number.isFinite(parsed) ? parsed : null;
}

function extractCountry(text: string) {
  const match = text.match(/\b(?:in|to|for)\s+([A-Z][A-Za-z\s-]{2,40})(?=[,.]|\s(?:market|buyer|importer|distribution)|$)/i);

  if (!match) {
    return null;
  }

  return match[1].trim();
}

function inferPackFormat(text: string) {
  const lowered = text.toLowerCase();

  if (lowered.includes('gift-box') || lowered.includes('gift box')) {
    return 'Chilled gift-box packing';
  }

  if (lowered.includes('tray')) {
    return 'Tray packing';
  }

  if (lowered.includes('carton')) {
    return 'Export carton packing';
  }

  return null;
}

function buildFallbackInquiryAgentReply(options: {
  locale: 'en' | 'zh';
  messages: InquiryAgentMessage[];
  formDraft: InquiryAgentFormDraft;
  selectedProduct: InquiryAgentProductContext | null;
}) {
  const lastUserMessage = [...options.messages].reverse().find((message) => message.role === 'user')?.content ?? '';
  const playbook = resolveInquiryAgentIndustryPlaybook(options);
  const quantityRequested = options.formDraft.quantityRequested ?? extractQuantity(lastUserMessage);
  const customerCountry = options.formDraft.customerCountry ?? extractCountry(lastUserMessage) ?? undefined;
  const packFormat = inferPackFormat(lastUserMessage) ?? undefined;
  const requirements = options.formDraft.requirements || lastUserMessage;
  const missingFields = [
    !options.formDraft.customerName ? 'customerName' : null,
    !options.formDraft.customerEmail ? 'customerEmail' : null,
    !customerCountry ? 'customerCountry' : null,
    !requirements ? 'requirements' : null
  ].filter((field): field is string => Boolean(field));
  const readiness = missingFields.length === 0
    ? 'ready_to_submit'
    : missingFields.length <= 2
      ? 'qualified'
      : 'discovering';
  const productFocus = options.selectedProduct?.name ?? (options.locale === 'zh' ? '通用农产品采购需求' : 'General agricultural sourcing request');
  const briefingSummary = options.locale === 'zh'
    ? `${productFocus} 当前询盘已形成初步摘要。${customerCountry ? `目标市场为 ${customerCountry}` : '目标市场仍待确认'}${quantityRequested ? `，预计数量约 ${quantityRequested}` : ''}${packFormat ? `，包装偏好为 ${packFormat}` : ''}。仍需继续补齐联系人、商务邮箱及关键规格信息。`
    : `A preliminary summary is now available for ${productFocus}. The current signal suggests ${customerCountry ? `a destination market in ${customerCountry}` : 'the destination market still needs confirmation'}${quantityRequested ? `, an initial volume around ${quantityRequested}` : ''}${packFormat ? `, and a preferred pack format of ${packFormat}` : ''}. The next step is to confirm the buyer contact, business email, and the remaining product details.`;
  const suggestedQuestions = [
    ...playbook.followUpQuestions,
    ...(options.locale === 'zh'
      ? [customerCountry ? '请再确认目标到货口岸与贸易术语。' : '请补充目标进口市场和到货城市。']
      : [customerCountry ? 'Please confirm the preferred port and incoterm.' : 'Please add the destination market and arrival city.'])
  ].slice(0, 3);
  const reply = options.locale === 'zh'
    ? `已收到。${customerCountry ? `我先记录目标市场为 ${customerCountry}。` : ''}${quantityRequested ? `目前预计数量约为 ${quantityRequested}。` : ''}为了便于我们准备合适的报价和供货方案，请补充联系人姓名、商务邮箱，并先确认：${suggestedQuestions[0] ?? '请确认核心规格和交付条件。'}`
    : `Understood.${customerCountry ? ` I have noted ${customerCountry} as the destination market.` : ''}${quantityRequested ? ` I have also captured an initial volume around ${quantityRequested}.` : ''} To help our team prepare the right quotation and supply plan, please add the buyer contact name and business email, and first confirm: ${suggestedQuestions[0] ?? 'please confirm the core specification and delivery condition.'}`;

  return {
    reply,
    suggestedQuestions,
    missingFields,
    readiness,
    formDraft: {
      ...options.formDraft,
      customerCountry,
      quantityRequested,
      requirements
    },
    briefingSummary,
    briefing: {
      industryKey: playbook.key,
      industryLabel: playbook.label,
      productFocus,
      destinationMarket: customerCountry,
      packFormat,
      timelineExpectation: /mid-autumn/i.test(lastUserMessage) ? 'Mid-Autumn seasonal gifting window' : undefined,
      painPoints: [
        /customs/i.test(lastUserMessage) ? 'Customs coordination needed' : null,
        /chilled|cold/i.test(lastUserMessage) ? 'Temperature-controlled logistics required' : null,
        packFormat ? `Pack format expectation: ${packFormat}` : null
      ].filter((item): item is string => Boolean(item)),
      qualificationChecklist: playbook.qualificationChecklist,
      recommendedDocuments: playbook.recommendedDocuments,
      logisticsNotes: playbook.logisticsNotes,
      nextQuestions: suggestedQuestions
    }
  } as const;
}

function sanitizeMessages(value: unknown): InquiryAgentMessage[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is InquiryAgentMessage => {
      if (!item || typeof item !== 'object') {
        return false;
      }

      const role = 'role' in item ? item.role : null;
      const content = 'content' in item ? item.content : null;
      return (role === 'user' || role === 'assistant') && typeof content === 'string' && content.trim().length > 0;
    })
    .map((item) => ({
      role: item.role,
      content: item.content.trim().slice(0, 2000)
    }))
    .slice(-10);
}

function sanitizeFormDraft(value: unknown): InquiryAgentFormDraft {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  const record = value as Record<string, unknown>;
  const asOptionalString = (field: string) => {
    const raw = record[field];

    if (typeof raw !== 'string') {
      return undefined;
    }

    const trimmed = raw.trim();
    return trimmed ? trimmed.slice(0, 500) : undefined;
  };
  const asOptionalNumber = (field: string) => {
    const raw = record[field];

    if (typeof raw !== 'number' || !Number.isFinite(raw)) {
      return undefined;
    }

    return raw;
  };

  return {
    customerName: asOptionalString('customerName'),
    customerCompany: asOptionalString('customerCompany'),
    customerEmail: asOptionalString('customerEmail'),
    customerPhone: asOptionalString('customerPhone'),
    customerCountry: asOptionalString('customerCountry'),
    quantityRequested: asOptionalNumber('quantityRequested'),
    targetPrice: asOptionalNumber('targetPrice'),
    currency: asOptionalString('currency'),
    requirements: asOptionalString('requirements')
  };
}

function sanitizeSelectedProduct(value: unknown): InquiryAgentProductContext | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  const record = value as Record<string, unknown>;
  const readField = (field: string) => {
    const raw = record[field];

    if (typeof raw !== 'string') {
      return undefined;
    }

    const trimmed = raw.trim();
    return trimmed ? trimmed.slice(0, 500) : undefined;
  };

  return {
    slug: readField('slug'),
    name: readField('name'),
    tradeModeLabel: readField('tradeModeLabel'),
    categoryName: readField('categoryName'),
    summary: readField('summary'),
    priceLabel: readField('priceLabel'),
    supplierName: readField('supplierName'),
    supplierLocation: readField('supplierLocation')
  };
}

export async function POST(request: NextRequest) {
  const session = await auth();

  try {
    const body = await request.json();
    const locale = body?.locale === 'zh' ? 'zh' : 'en';
    const messages = sanitizeMessages(body?.messages);
    const formDraft = sanitizeFormDraft(body?.formDraft);
    const selectedProduct = sanitizeSelectedProduct(body?.selectedProduct);
    const lastUserMessage = [...messages].reverse().find((message) => message.role === 'user')?.content;

    if (!lastUserMessage) {
      return NextResponse.json({ error: 'Latest buyer message required' }, { status: 400 });
    }

    let provider = 'openai-compatible';
    let model = process.env.AI_MODEL ?? 'unknown';
    let result;

    try {
      result = await retryWithBackoff(
        () => generateInquiryAgentReply({
          locale,
          messages,
          formDraft,
          selectedProduct
        }),
        {
          maxRetries: 3,
          baseDelayMs: 1000,
          onRetry: (attempt, error) => {
            console.warn(
              `AI inquiry agent retry ${attempt}:`,
              error instanceof Error ? error.message : error
            );
          }
        }
      );
    } catch (agentError) {
      console.warn(
        'AI inquiry agent fallback in use:',
        agentError instanceof Error ? agentError.message : agentError
      );
      provider = 'rule-based-fallback';
      model = 'local-fallback';
      result = buildFallbackInquiryAgentReply({
        locale,
        messages,
        formDraft,
        selectedProduct
      });
    }

    try {
      await prisma.aiLog.create({
        data: {
          purpose: 'INQUIRY_SUMMARY',
          status: 'SUCCESS',
          provider,
          model,
          entityType: 'rfq_agent',
          inputSummary: `Locale: ${locale}; Product: ${selectedProduct?.slug ?? 'general'}; Buyer message: ${lastUserMessage}`,
          outputSummary: `Readiness: ${result.readiness}; Missing fields: ${result.missingFields.join(', ') || 'none'}`,
          metadataJson: {
            locale,
            selectedProductSlug: selectedProduct?.slug ?? null,
            messageCount: messages.length,
            missingFields: result.missingFields,
            readiness: result.readiness,
            provider
          },
          createdByUserId: session?.user?.id ?? null
        }
      });
    } catch (logError) {
      console.error('AI inquiry agent log error:', logError);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('AI inquiry agent error:', error);

    return NextResponse.json(
      { error: 'Failed to run inquiry agent' },
      { status: 500 }
    );
  }
}