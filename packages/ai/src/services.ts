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

export interface InquiryAgentMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface InquiryAgentProductContext {
  slug?: string;
  name?: string;
  tradeModeLabel?: string;
  categoryName?: string;
  summary?: string;
  priceLabel?: string;
  supplierName?: string;
  supplierLocation?: string;
}

export interface InquiryAgentFormDraft {
  customerName?: string;
  customerCompany?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerCountry?: string;
  quantityRequested?: number | null;
  targetPrice?: number | null;
  currency?: string;
  requirements?: string;
}

export type InquiryAgentIndustryKey = 'aquatic' | 'mushroom' | 'tea' | 'vegetable' | 'halal' | 'general';

export interface InquiryAgentIndustryPlaybook {
  key: InquiryAgentIndustryKey;
  label: string;
  commercialFocus: string[];
  qualificationChecklist: string[];
  recommendedDocuments: string[];
  logisticsNotes: string[];
  followUpQuestions: string[];
}

export interface InquiryAgentBriefing {
  industryKey?: InquiryAgentIndustryKey;
  industryLabel?: string;
  buyerRole?: string;
  businessModel?: string;
  productFocus?: string;
  destinationMarket?: string;
  packFormat?: string;
  certificationsNeeded?: string[];
  incotermPreference?: string;
  timelineExpectation?: string;
  painPoints?: string[];
  qualificationChecklist?: string[];
  recommendedDocuments?: string[];
  logisticsNotes?: string[];
  nextQuestions?: string[];
}

export interface InquiryAgentResult {
  reply: string;
  suggestedQuestions: string[];
  missingFields: string[];
  readiness: 'discovering' | 'qualified' | 'ready_to_submit';
  formDraft: InquiryAgentFormDraft;
  briefingSummary: string;
  briefing: InquiryAgentBriefing;
}

function inferIndustryKey(input: {
  selectedProduct?: InquiryAgentProductContext | null;
  messages?: InquiryAgentMessage[];
}): InquiryAgentIndustryKey {
  const context = [
    input.selectedProduct?.categoryName,
    input.selectedProduct?.name,
    input.selectedProduct?.summary,
    ...(input.messages?.map((message) => message.content) ?? [])
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  if (/aquatic|seafood|crab|shrimp|fish|海鲜|螃蟹|水产/.test(context)) {
    return 'aquatic';
  }

  if (/mushroom|morel|fungi|菌|蘑菇/.test(context)) {
    return 'mushroom';
  }

  if (/tea|longjing|green tea|black tea|茶/.test(context)) {
    return 'tea';
  }

  if (/vegetable|asparagus|jiaobai|produce|蔬菜|芦笋|茭白/.test(context)) {
    return 'vegetable';
  }

  if (/halal|ready meal|prepared food|curry|清真|即食/.test(context)) {
    return 'halal';
  }

  return 'general';
}

export function resolveInquiryAgentIndustryPlaybook(input: {
  locale: 'en' | 'zh';
  selectedProduct?: InquiryAgentProductContext | null;
  messages?: InquiryAgentMessage[];
}): InquiryAgentIndustryPlaybook {
  const key = inferIndustryKey(input);
  const isZh = input.locale === 'zh';

  switch (key) {
    case 'aquatic':
      return {
        key,
        label: isZh ? '水产出口打法' : 'Aquatic export playbook',
        commercialFocus: isZh
          ? ['活鲜/冰鲜形式', '规格等级与单只重量', '冷链与清关配合']
          : ['Live versus chilled format', 'Size grading and unit weight', 'Cold-chain and customs coordination'],
        qualificationChecklist: isZh
          ? ['目标市场与到货城市', '活鲜还是冰鲜礼盒', '规格等级或单只重量', '首单数量与节令窗口']
          : ['Destination market and arrival city', 'Live or chilled gift-box format', 'Size grade or unit weight', 'Trial volume and seasonal window'],
        recommendedDocuments: isZh
          ? ['卫生证书/检疫文件', '原产地证', '装箱单与商业发票', '冷链作业说明']
          : ['Health or quarantine certificate', 'Certificate of origin', 'Packing list and commercial invoice', 'Cold-chain operating note'],
        logisticsNotes: isZh
          ? ['重点确认机场/港口到货节奏', '温控和损耗容忍度要前置沟通']
          : ['Confirm airport or port arrival rhythm early', 'Align temperature control and acceptable loss tolerance upfront'],
        followUpQuestions: isZh
          ? ['您需要活鲜、冰鲜礼盒，还是其他商业包装路径？', '请确认目标规格等级、到货时间窗口，以及希望采用的贸易术语。']
          : ['Do you need live shipment, chilled gift-box format, or another commercial pack route?', 'Please confirm the target size grade, arrival window, and preferred incoterm.']
      };
    case 'mushroom':
      return {
        key,
        label: isZh ? '菌菇出口打法' : 'Mushroom export playbook',
        commercialFocus: isZh
          ? ['鲜品/干品/零售装区分', '等级与含水率', '箱规与储存条件']
          : ['Fresh, dried, or retail pack distinction', 'Grade and moisture level', 'Carton format and storage conditions'],
        qualificationChecklist: isZh
          ? ['产品形态', '等级或品级标准', '箱规或零售包装', '是否需要有机/其他认证']
          : ['Product form', 'Grade or quality standard', 'Carton or retail pack format', 'Whether organic or other certification is required'],
        recommendedDocuments: isZh
          ? ['原产地证', '装箱单与商业发票', '如需要则提供有机或合规证明']
          : ['Certificate of origin', 'Packing list and commercial invoice', 'Organic or compliance certificate if required'],
        logisticsNotes: isZh
          ? ['鲜品要先确认保鲜和冷链', '干品和零售装要确认含水率与破损控制']
          : ['Fresh lines need early shelf-life and cold-chain confirmation', 'Dried and retail packs need moisture and breakage control alignment'],
        followUpQuestions: isZh
          ? ['您要的是鲜品、干品，还是零售装项目？', '请确认希望的等级、箱规或零售包装形式。']
          : ['Are you targeting a fresh line, dried line, or retail pack program?', 'Please confirm the desired grade and carton or retail pack format.']
      };
    case 'tea':
      return {
        key,
        label: isZh ? '茶叶出口打法' : 'Tea export playbook',
        commercialFocus: isZh
          ? ['采摘季与等级', '零售礼盒/餐饮大包装', '香气稳定与标签合规']
          : ['Harvest season and grade', 'Retail gifting versus foodservice pack', 'Flavor stability and label compliance'],
        qualificationChecklist: isZh
          ? ['目标渠道', '采摘季和等级', '包装形式', '是否关注农残或检测报告']
          : ['Target channel', 'Harvest season and grade', 'Pack format', 'Whether residue testing or reports are required'],
        recommendedDocuments: isZh
          ? ['原产地证', '装箱单与商业发票', '检测报告或合规资料（如需要）']
          : ['Certificate of origin', 'Packing list and commercial invoice', 'Testing report or compliance file if required'],
        logisticsNotes: isZh
          ? ['零售礼盒要确认防潮与充氮包装', '高端礼赠项目要关注节令档期']
          : ['Retail gifting packs should confirm moisture protection and nitrogen flush', 'Premium gifting programs should align with seasonal sales windows'],
        followUpQuestions: isZh
          ? ['您是做礼赠零售、商超上架，还是餐饮渠道？', '请确认希望的采摘季、等级和包装规格。']
          : ['Are you sourcing for gifting retail, supermarket shelves, or foodservice?', 'Please confirm the target harvest season, grade, and pack specification.']
      };
    case 'vegetable':
      return {
        key,
        label: isZh ? '蔬菜出口打法' : 'Vegetable export playbook',
        commercialFocus: isZh
          ? ['规格尺寸', '预冷与冷链', '箱规与到货保鲜']
          : ['Size specification', 'Pre-cooling and cold-chain control', 'Carton format and arrival freshness'],
        qualificationChecklist: isZh
          ? ['尺寸或等级标准', '箱规', '到货时效', '冷链要求']
          : ['Size or grade standard', 'Carton format', 'Arrival timing', 'Cold-chain requirement'],
        recommendedDocuments: isZh
          ? ['卫生或植检文件', '原产地证', '装箱单与商业发票']
          : ['Health or phytosanitary file', 'Certificate of origin', 'Packing list and commercial invoice'],
        logisticsNotes: isZh
          ? ['鲜蔬项目要优先锁定预冷、装柜和到货温控', '易损规格要前置确认损耗容忍度']
          : ['Fresh vegetable lines should lock pre-cooling, container loading, and arrival temperature early', 'Fragile specs need loss tolerance aligned in advance'],
        followUpQuestions: isZh
          ? ['请确认目标尺寸标准和每箱规格。', '您希望的到货周期和冷链条件是什么？']
          : ['Please confirm the target size specification and carton format.', 'What arrival timeline and cold-chain condition do you require?']
      };
    case 'halal':
      return {
        key,
        label: isZh ? '清真食品出口打法' : 'Halal food export playbook',
        commercialFocus: isZh
          ? ['清真认证范围', '标签语言与法规', '常温/冷链与货架期']
          : ['Halal certification scope', 'Label language and regulatory fit', 'Ambient versus cold-chain shelf-life planning'],
        qualificationChecklist: isZh
          ? ['目标市场清真认证要求', '标签语言', '零售装或餐饮装', '货架期与箱规']
          : ['Destination-market halal certification requirement', 'Label language', 'Retail-ready versus foodservice case pack', 'Shelf life and case format'],
        recommendedDocuments: isZh
          ? ['清真证书', '卫生证书', '原产地证', '标签审核资料']
          : ['Halal certificate', 'Health certificate', 'Certificate of origin', 'Label review file'],
        logisticsNotes: isZh
          ? ['先确认是否常温运输即可满足市场要求', '私牌项目要尽早锁定标签与法规审核']
          : ['Confirm whether ambient shipment is acceptable for the market', 'Private-label programs should lock label and regulatory review early'],
        followUpQuestions: isZh
          ? ['请确认目标市场接受哪一类清真认证，以及需要哪些标签语言。', '您需要零售即食包装、餐饮箱装，还是私牌开发路径？']
          : ['Please confirm which halal certification scope and label languages your market requires.', 'Do you need retail-ready packs, foodservice cases, or a private-label route?']
      };
    default:
      return {
        key: 'general',
        label: isZh ? '通用出口打法' : 'General export playbook',
        commercialFocus: isZh
          ? ['目标市场', '产品范围', '包装规格', '合规文件']
          : ['Destination market', 'Product scope', 'Pack format', 'Compliance documents'],
        qualificationChecklist: isZh
          ? ['产品或品类方向', '目标市场', '首单数量', '包装与文件要求']
          : ['Product or category direction', 'Destination market', 'Initial volume', 'Packaging and document requirements'],
        recommendedDocuments: isZh
          ? ['原产地证', '装箱单与商业发票', '根据品类补充合规文件']
          : ['Certificate of origin', 'Packing list and commercial invoice', 'Category-specific compliance files as needed'],
        logisticsNotes: isZh
          ? ['先确认到货时间、贸易术语和包装路线', '再判断是否需要冷链或标签审查']
          : ['Confirm arrival timing, incoterm, and pack route first', 'Then assess whether cold-chain or label review is needed'],
        followUpQuestions: isZh
          ? ['请先告诉我目标市场、产品方向和预计首单量。', '您目前最关心的是包装、价格、认证，还是交付时效？']
          : ['Please first confirm the destination market, product direction, and expected first order volume.', 'What matters most right now: packaging, pricing, certification, or delivery timing?']
      };
  }
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
  const { client, model, buildChatRequest } = createAiClient();

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

  const response = await client.chat.completions.create(buildChatRequest({
    model,
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' }
  }));

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
  const { client, model, buildChatRequest } = createAiClient();

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

  const response = await client.chat.completions.create(buildChatRequest({
    model,
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' }
  }));

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No response from AI');
  }

  return JSON.parse(content) as InquirySummaryResult;
}

export async function generateInquiryAgentReply(input: {
  locale: 'en' | 'zh';
  messages: InquiryAgentMessage[];
  formDraft?: InquiryAgentFormDraft;
  selectedProduct?: InquiryAgentProductContext | null;
}): Promise<InquiryAgentResult> {
  const { client, model, buildChatRequest } = createAiClient();
  const industryPlaybook = resolveInquiryAgentIndustryPlaybook(input);
  const transcript = input.messages
    .slice(-10)
    .map((message) => `${message.role.toUpperCase()}: ${message.content}`)
    .join('\n');
  const selectedProduct = input.selectedProduct
    ? JSON.stringify(input.selectedProduct, null, 2)
    : 'No specific product preselected.';
  const formDraft = input.formDraft
    ? JSON.stringify(input.formDraft, null, 2)
    : 'No structured lead data captured yet.';
  const responseLanguage = input.locale === 'zh'
    ? 'Simplified Chinese'
    : 'English';

  const prompt = `You are a professional B2B agricultural export inquiry assistant for an online sourcing platform.

Your job in each turn is to:
1. Answer the buyer's latest business question clearly and professionally.
2. Keep the conversation focused on agricultural export sourcing, trade feasibility, packaging, logistics, documentation, pricing context, certifications, and supplier coordination.
3. Collect buyer identity and demand details progressively: contact person, company, destination market, target product, volume, target price, packaging, certifications, timing, and commercial constraints.
4. Ask no more than 2 follow-up questions at a time.
5. Do not invent unavailable guarantees, certifications, inventory, or lead times. Use careful trade language when details are not yet confirmed.
6. If the user asks something unrelated to business sourcing, redirect them back to the inquiry scope.

Respond in ${responseLanguage}.

Detected industry playbook:
${JSON.stringify(industryPlaybook, null, 2)}

Selected product context:
${selectedProduct}

Current captured form draft:
${formDraft}

Conversation transcript:
${transcript || 'USER: Hello'}

Return a JSON object with this exact shape:
{
  "reply": "professional answer plus the next best follow-up question(s)",
  "suggestedQuestions": ["...", "..."],
  "missingFields": ["customerName", "customerCompany", "customerEmail", "customerPhone", "customerCountry", "quantityRequested", "targetPrice", "currency", "requirements"],
  "readiness": "discovering|qualified|ready_to_submit",
  "formDraft": {
    "customerName": "",
    "customerCompany": "",
    "customerEmail": "",
    "customerPhone": "",
    "customerCountry": "",
    "quantityRequested": 0,
    "targetPrice": 0,
    "currency": "USD",
    "requirements": ""
  },
  "briefingSummary": "2-4 sentence buyer brief summary",
  "briefing": {
    "buyerRole": "",
    "businessModel": "",
    "industryKey": "general",
    "industryLabel": "General export playbook",
    "productFocus": "",
    "destinationMarket": "",
    "packFormat": "",
    "certificationsNeeded": ["..."],
    "incotermPreference": "",
    "timelineExpectation": "",
    "painPoints": ["..."],
    "qualificationChecklist": ["..."],
    "recommendedDocuments": ["..."],
    "logisticsNotes": ["..."],
    "nextQuestions": ["...", "..."]
  }
}

Rules:
- Only populate formDraft values that are explicitly stated or strongly implied.
- quantityRequested and targetPrice must be numbers when known, otherwise null.
- requirements should be a concise buyer brief suitable for an RFQ form when enough detail exists.
- missingFields should only list fields that still materially block qualification.
- use the detected industry playbook to shape the reply, follow-up questions, qualification checklist, document list, and logistics notes.
- readiness should be:
  - discovering: early conversation, still broad
  - qualified: enough detail for commercial follow-up but still with gaps
  - ready_to_submit: enough detail to create a strong inquiry now
- suggestedQuestions and briefing.nextQuestions should be concrete and useful, not generic.`;

  const response = await client.chat.completions.create(buildChatRequest({
    model,
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' }
  }));

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No response from AI');
  }

  return JSON.parse(content) as InquiryAgentResult;
}

// Translate content between Chinese and English
export async function translateContent(input: {
  content: string;
  sourceLocale: 'en' | 'zh';
  targetLocale: 'en' | 'zh';
  context?: 'product' | 'inquiry' | 'general';
}): Promise<string> {
  const { client, model, buildChatRequest } = createAiClient();

  const contextPrompt = input.context === 'product'
    ? 'This is agricultural product marketing content. Maintain professional B2B tone.'
    : input.context === 'inquiry'
      ? 'This is a business inquiry response. Use professional trade communication style.'
      : 'Translate accurately maintaining the original tone and meaning.';

  const prompt = `${contextPrompt}

Translate the following from ${input.sourceLocale === 'zh' ? 'Chinese' : 'English'} to ${input.targetLocale === 'zh' ? 'Chinese' : 'English'}:

${input.content}

Provide only the translated text, no explanations.`;

  const response = await client.chat.completions.create(buildChatRequest({
    model,
    messages: [{ role: 'user', content: prompt }]
  }));

  return response.choices[0]?.message?.content || input.content;
}

// Generate SEO-optimized FAQ content
export async function generateFaqContent(input: {
  productName: string;
  category: string;
  commonQuestions?: string[];
  locale: 'en' | 'zh';
}): Promise<Array<{ question: string; answer: string }>> {
  const { client, model, buildChatRequest } = createAiClient();

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

  const response = await client.chat.completions.create(buildChatRequest({
    model,
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' }
  }));

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