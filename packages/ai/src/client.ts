import OpenAI from 'openai';
import { z } from 'zod';

const aiRuntimeSchema = z.object({
  AI_BASE_URL: z.string().url(),
  AI_MODEL: z.string().min(1),
  AI_API_KEY: z.string().min(1)
});

export type AiRuntime = z.infer<typeof aiRuntimeSchema>;

export function readAiRuntime(source: NodeJS.ProcessEnv = process.env): AiRuntime {
  return aiRuntimeSchema.parse(source);
}

export function createAiClient(source: NodeJS.ProcessEnv = process.env) {
  const runtime = readAiRuntime(source);

  return {
    client: new OpenAI({
      apiKey: runtime.AI_API_KEY,
      baseURL: runtime.AI_BASE_URL
    }),
    model: runtime.AI_MODEL
  };
}
