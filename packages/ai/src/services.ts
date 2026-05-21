import { createAiClient } from './client';

// AI purpose types (mirrors Prisma enum for standalone use)
export type AiPurpose = 'PRODUCT_COPY' | 'SEO_ASSIST' | 'CONTENT_SUMMARY' | 'INQUIRY_SUMMARY' | 'BACKOFFICE_ASSIST';

// Product copy generation result
export interface ProductCopyResult {
  summary: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
}

// Inquiry summary result
export interface InquirySummaryResult {
  summary: string;
  keyPoints: string[];
  suggestedResponse: string;
  urgencyLevel: 'low' | 'medium' | 'high';
}

// Generate product copy (description, SEO content)
export async function generateProductCopy(input: {
  productName: string;
  category: string;
  brand?: string;
  model?: string;
  features?: string[];
  existingDescription?: string;
}): Promise<ProductCopyResult> {
  const { client, model } = createAiClient();

  const prompt = `You are a professional agricultural export copywriter. Generate compelling marketing copy for the following product:

Product: ${input.productName}
Category: ${input.category}
Brand: ${input.brand || 'Not specified'}
Model: ${input.model || 'Not specified'}
Key features: ${input.features?.join(', ') || 'Not specified'}
Existing description: ${input.existingDescription || 'None'}

Generate:
1. A concise summary (2-3 sentences, max 150 characters) for product listing
2. A detailed description (3-5 paragraphs) highlighting quality, sourcing, export capabilities
3. SEO-optimized title (max 60 characters)
4. SEO meta description (max 160 characters)

Focus on:
- Quality and certification
- Export-ready packaging and logistics
- Farm-to-export supply chain
- Competitive advantages for international buyers

Respond in JSON format:
{
  "summary": "...",
  "description": "...",
  "seoTitle": "...",
  "seoDescription": "..."
}`;

  const response = await client.chat.completions.create({
    model,
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' }
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No response from AI');
  }

  return JSON.parse(content) as ProductCopyResult;
}

// Generate inquiry summary and suggested response
export async function generateInquirySummary(input: {
  inquiryNumber: string;
  customerName: string;
  customerCompany?: string;
  customerCountry?: string;
  productName?: string;
  quantity?: number;
  targetPrice?: number;
  currency?: string;
  requirements?: string;
}): Promise<InquirySummaryResult> {
  const { client, model } = createAiClient();

  const prompt = `You are an agricultural export business analyst. Analyze this buyer inquiry and provide insights:

Inquiry: ${input.inquiryNumber}
Customer: ${input.customerName}
Company: ${input.customerCompany || 'Not specified'}
Country: ${input.customerCountry || 'Not specified'}
Product: ${input.productName || 'General inquiry'}
Quantity: ${input.quantity || 'Not specified'}
Target price: ${input.targetPrice ? `${input.currency || 'USD'} ${input.targetPrice}` : 'Not specified'}
Requirements: ${input.requirements || 'None specified'}

Analyze and provide:
1. A brief summary of the inquiry (2-3 sentences)
2. Key points to address in response (as array)
3. A suggested initial response template
4. Urgency level assessment based on:
   - Quantity size (large = high)
   - Target price realism (unrealistic = medium)
   - Company profile (established = high)
   - Requirements complexity

Respond in JSON format:
{
  "summary": "...",
  "keyPoints": ["...", "..."],
  "suggestedResponse": "...",
  "urgencyLevel": "low|medium|high"
}`;

  const response = await client.chat.completions.create({
    model,
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' }
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No response from AI');
  }

  return JSON.parse(content) as InquirySummaryResult;
}

// Translate content between Chinese and English
export async function translateContent(input: {
  content: string;
  sourceLocale: 'en' | 'zh';
  targetLocale: 'en' | 'zh';
  context?: 'product' | 'inquiry' | 'general';
}): Promise<string> {
  const { client, model } = createAiClient();

  const contextPrompt = input.context === 'product'
    ? 'This is agricultural product marketing content. Maintain professional B2B tone.'
    : input.context === 'inquiry'
      ? 'This is a business inquiry response. Use professional trade communication style.'
      : 'Translate accurately maintaining the original tone and meaning.';

  const prompt = `${contextPrompt}

Translate the following from ${input.sourceLocale === 'zh' ? 'Chinese' : 'English'} to ${input.targetLocale === 'zh' ? 'Chinese' : 'English'}:

${input.content}

Provide only the translated text, no explanations.`;

  const response = await client.chat.completions.create({
    model,
    messages: [{ role: 'user', content: prompt }]
  });

  return response.choices[0]?.message?.content || input.content;
}

// Generate SEO-optimized FAQ content
export async function generateFaqContent(input: {
  productName: string;
  category: string;
  commonQuestions?: string[];
  locale: 'en' | 'zh';
}): Promise<Array<{ question: string; answer: string }>> {
  const { client, model } = createAiClient();

  const languageNote = input.locale === 'zh'
    ? 'Generate in Chinese (zh-CN). Use formal business language.'
    : 'Generate in English. Use professional B2B tone.';

  const prompt = `${languageNote}

Generate 5 FAQ items for this agricultural export product:
Product: ${input.productName}
Category: ${input.category}
Common buyer concerns: ${input.commonQuestions?.join(', ') || 'Standard trade concerns'}

Focus on:
- Quality and certification
- Export packaging and logistics
- Minimum order quantities
- Payment and shipping terms
- Lead times and availability

Respond in JSON format:
[
  { "question": "...", "answer": "..." },
  ...
]`;

  const response = await client.chat.completions.create({
    model,
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' }
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No response from AI');
  }

  const parsed = JSON.parse(content);
  return Array.isArray(parsed) ? parsed : parsed.faqs || [];
}

// Helper to track AI usage
export interface AiLogEntry {
  purpose: AiPurpose;
  status: 'SUCCESS' | 'ERROR';
  provider: string;
  model: string;
  entityType?: string;
  entityId?: string;
  inputSummary?: string;
  outputSummary?: string;
  latencyMs?: number;
  errorMessage?: string;
}

export function createAiLogTracker() {
  const startTime = Date.now();

  return {
    success: (purpose: AiPurpose, entityType?: string, entityId?: string): AiLogEntry => ({
      purpose,
      status: 'SUCCESS',
      provider: 'openai-compatible',
      model: process.env.AI_MODEL || 'unknown',
      entityType,
      entityId,
      latencyMs: Date.now() - startTime
    }),
    error: (purpose: AiPurpose, errorMessage: string): AiLogEntry => ({
      purpose,
      status: 'ERROR',
      provider: 'openai-compatible',
      model: process.env.AI_MODEL || 'unknown',
      errorMessage,
      latencyMs: Date.now() - startTime
    })
  };
}