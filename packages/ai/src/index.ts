export { createAiClient, readAiRuntime } from './client';
export type { AiRuntime } from './client';

export {
  generateProductCopy,
  generateInquirySummary,
  translateContent,
  generateFaqContent,
  createAiLogTracker
} from './services';
export type {
  ProductCopyResult,
  InquirySummaryResult,
  AiLogEntry
} from './services';
