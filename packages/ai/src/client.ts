import OpenAI from 'openai';
import { z } from 'zod';

const aiRuntimeSchema = z.object({
  AI_BASE_URL: z.string().url(),
  AI_MODEL: z.string().min(1),
  AI_API_KEY: z.string().min(1)
});

export type AiRuntime = z.infer<typeof aiRuntimeSchema>;

export type AiChatRequest<T extends object> = T;

export function readAiRuntime(source: NodeJS.ProcessEnv = process.env): AiRuntime {
  return aiRuntimeSchema.parse(source);
}

function normalizeAiBaseUrl(baseUrl: string) {
  return baseUrl
    .replace(/\/chat\/completions\/?$/i, '')
    .replace(/\/completions\/?$/i, '')
    .replace(/\/$/, '');
}

function shouldDisableThinking(baseUrl: string, model: string) {
  let host = '';

  try {
    host = new URL(baseUrl).host.toLowerCase();
  } catch {
    return false;
  }

  return host.endsWith('dashscope.aliyuncs.com') && /^qwen/i.test(model);
}

export function createAiClient(source: NodeJS.ProcessEnv = process.env) {
  const runtime = readAiRuntime(source);
  const baseURL = normalizeAiBaseUrl(runtime.AI_BASE_URL);
  const disableThinking = shouldDisableThinking(baseURL, runtime.AI_MODEL);

  return {
    client: new OpenAI({
      apiKey: runtime.AI_API_KEY,
      baseURL
    }),
    model: runtime.AI_MODEL,
    buildChatRequest<T extends object>(body: T): AiChatRequest<T> {
      if (!disableThinking) {
        return body;
      }

      return {
        ...body,
        enable_thinking: false
      } as AiChatRequest<T>;
    }
  };
}
