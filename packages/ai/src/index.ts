export { createAiClient, readAiRuntime } from './client';
export type { AiRuntime } from './client';

export {
  generateProductCopy,
  generateInquiryAgentReply,
  generateInquirySummary,
  resolveInquiryAgentIndustryPlaybook,
  translateContent,
  generateFaqContent,
  createAiLogTracker
} from './services';
export type {
  InquiryAgentBriefing,
  InquiryAgentFormDraft,
  InquiryAgentIndustryKey,
  InquiryAgentIndustryPlaybook,
  InquiryAgentMessage,
  InquiryAgentProductContext,
  InquiryAgentResult,
  ProductCopyResult,
  InquirySummaryResult,
  AiLogEntry
} from './services';
