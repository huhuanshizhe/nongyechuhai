import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createAiClient } from '../packages/ai/src/client';
import {
  buildProductImagePrompt,
  productImageBriefs,
  sharedNegativePrompt,
  type ProductImageBrief,
  type ProductImageShot
} from '../apps/web/src/lib/product-image-briefs';

type GenerationMode = 'auto' | 'ai' | 'svg';
type OutputFormat = 'webp' | 'png' | 'jpeg' | 'svg';

const dashScopeGenerationEndpoint = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation';
const imageRequestTimeoutMs = 120000;

type CliOptions = {
  dryRun: boolean;
  includeDetail: boolean;
  limit: number | null;
  mode: GenerationMode;
  outputFormat: OutputFormat;
  quality: 'low' | 'medium' | 'high' | 'auto';
  reportOnly: boolean;
  size: string;
  slugs: string[] | null;
};

type GeneratedShotRecord = {
  shot: ProductImageShot;
  fileName: string;
  prompt: string;
  revisedPrompt: string | null;
};

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    dryRun: false,
    includeDetail: false,
    limit: null,
    mode: 'auto',
    outputFormat: 'webp',
    quality: 'high',
    reportOnly: false,
    size: '1536x1024',
    slugs: null
  };

  for (const argument of argv) {
    if (argument === '--dry-run') {
      options.dryRun = true;
      continue;
    }

    if (argument === '--include-detail') {
      options.includeDetail = true;
      continue;
    }

    if (argument === '--report-only') {
      options.reportOnly = true;
      continue;
    }

    if (argument.startsWith('--limit=')) {
      const value = Number(argument.slice('--limit='.length));

      if (!Number.isFinite(value) || value <= 0) {
        throw new Error(`Invalid --limit value: ${argument}`);
      }

      options.limit = value;
      continue;
    }

    if (argument.startsWith('--mode=')) {
      const value = argument.slice('--mode='.length).trim();

      if (value !== 'auto' && value !== 'ai' && value !== 'svg') {
        throw new Error(`Unsupported --mode value: ${value}`);
      }

      options.mode = value;
      continue;
    }

    if (argument.startsWith('--slugs=')) {
      const value = argument
        .slice('--slugs='.length)
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

      options.slugs = value.length > 0 ? value : null;
      continue;
    }

    if (argument.startsWith('--size=')) {
      options.size = argument.slice('--size='.length).trim();
      continue;
    }

    if (argument.startsWith('--output-format=')) {
      const value = argument.slice('--output-format='.length).trim();

      if (value !== 'webp' && value !== 'png' && value !== 'jpeg' && value !== 'svg') {
        throw new Error(`Unsupported --output-format value: ${value}`);
      }

      options.outputFormat = value;
      continue;
    }

    if (argument.startsWith('--quality=')) {
      const value = argument.slice('--quality='.length).trim();

      if (value !== 'low' && value !== 'medium' && value !== 'high' && value !== 'auto') {
        throw new Error(`Unsupported --quality value: ${value}`);
      }

      options.quality = value;
      continue;
    }

    throw new Error(`Unknown argument: ${argument}`);
  }

  return options;
}

function selectBriefs(options: CliOptions) {
  let briefs = productImageBriefs;

  if (options.slugs?.length) {
    const selectedSlugs = new Set(options.slugs);
    briefs = briefs.filter((brief) => selectedSlugs.has(brief.slug));
  }

  if (typeof options.limit === 'number') {
    briefs = briefs.slice(0, options.limit);
  }

  if (briefs.length === 0) {
    throw new Error('No product image briefs matched the provided filters.');
  }

  return briefs;
}

function buildPrompt(brief: ProductImageBrief, shot: ProductImageShot) {
  return `${buildProductImagePrompt(brief, shot)} Avoid the following: ${sharedNegativePrompt}.`;
}

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function wrapText(value: string, maxChars: number, maxLines: number) {
  const words = value.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;

    if (candidate.length <= maxChars) {
      currentLine = candidate;
      continue;
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    currentLine = word;

    if (lines.length === maxLines) {
      break;
    }
  }

  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine);
  }

  if (lines.length === 0) {
    return [''];
  }

  if (words.join(' ').length > lines.join(' ').length) {
    const lastLineIndex = lines.length - 1;
    lines[lastLineIndex] = `${lines[lastLineIndex].replace(/[.,;:!?]+$/, '')}...`;
  }

  return lines;
}

function summarizeText(value: string, maxChars: number) {
  if (value.length <= maxChars) {
    return value;
  }

  return `${value.slice(0, Math.max(0, maxChars - 1)).trimEnd()}...`;
}

function createPalette(category: string) {
  const normalizedCategory = category.toLowerCase();

  if (normalizedCategory.includes('mushroom')) {
    return {
      backgroundStart: '#f7f1e4',
      backgroundEnd: '#e8dcc5',
      panel: '#fffaf2',
      ink: '#2d2a26',
      muted: '#73685a',
      accent: '#8f6743',
      accentSoft: '#d9c2aa',
      line: '#d9ccb7'
    };
  }

  if (normalizedCategory.includes('aquatic')) {
    return {
      backgroundStart: '#eef4f6',
      backgroundEnd: '#d9e6ea',
      panel: '#f9fdff',
      ink: '#24343b',
      muted: '#5d7278',
      accent: '#406a78',
      accentSoft: '#c4d8de',
      line: '#c7d7dc'
    };
  }

  if (normalizedCategory.includes('tea')) {
    return {
      backgroundStart: '#eef3e4',
      backgroundEnd: '#dde7cf',
      panel: '#f8fbf1',
      ink: '#263221',
      muted: '#5d6b53',
      accent: '#607744',
      accentSoft: '#cad8ba',
      line: '#cfdbc4'
    };
  }

  if (normalizedCategory.includes('vegetable')) {
    return {
      backgroundStart: '#edf5e7',
      backgroundEnd: '#d7e8d2',
      panel: '#f9fcf7',
      ink: '#223126',
      muted: '#607063',
      accent: '#4f7b4e',
      accentSoft: '#c3d9c1',
      line: '#cadcca'
    };
  }

  return {
    backgroundStart: '#fbf3e8',
    backgroundEnd: '#ead8c4',
    panel: '#fffaf3',
    ink: '#2d2d2b',
    muted: '#70685f',
    accent: '#a9673f',
    accentSoft: '#e0c2ac',
    line: '#ded0c2'
  };
}

function renderMushroomMotif(palette: ReturnType<typeof createPalette>, shot: ProductImageShot) {
  const stemFill = palette.panel;
  const capFill = palette.accentSoft;
  const capStroke = palette.accent;
  const scale = shot === 'hero' ? 1 : 0.9;

  return `<g transform="translate(930 150) scale(${scale})">
    <ellipse cx="290" cy="535" rx="290" ry="210" fill="${palette.accentSoft}" opacity="0.28" />
    <g opacity="0.96">
      <rect x="210" y="280" width="90" height="225" rx="40" fill="${stemFill}" stroke="${capStroke}" stroke-width="6" />
      <ellipse cx="255" cy="265" rx="180" ry="86" fill="${capFill}" stroke="${capStroke}" stroke-width="8" />
      <rect x="92" y="355" width="68" height="170" rx="30" fill="${stemFill}" stroke="${capStroke}" stroke-width="5" />
      <ellipse cx="126" cy="345" rx="122" ry="63" fill="${palette.panel}" stroke="${capStroke}" stroke-width="7" />
      <rect x="348" y="342" width="72" height="182" rx="32" fill="${stemFill}" stroke="${capStroke}" stroke-width="5" />
      <ellipse cx="384" cy="328" rx="132" ry="68" fill="${palette.panel}" stroke="${capStroke}" stroke-width="7" />
      <path d="M96 592 C162 568 242 562 330 573" stroke="${palette.accent}" stroke-width="10" stroke-linecap="round" opacity="0.38" />
    </g>
  </g>`;
}

function renderCrabMotif(palette: ReturnType<typeof createPalette>) {
  return `<g transform="translate(940 180)">
    <ellipse cx="250" cy="345" rx="165" ry="118" fill="${palette.accentSoft}" opacity="0.28" />
    <ellipse cx="250" cy="300" rx="150" ry="98" fill="${palette.accentSoft}" stroke="${palette.accent}" stroke-width="10" />
    <circle cx="200" cy="274" r="12" fill="${palette.ink}" />
    <circle cx="300" cy="274" r="12" fill="${palette.ink}" />
    <path d="M125 246 C72 212 40 176 22 128" stroke="${palette.accent}" stroke-width="12" stroke-linecap="round" fill="none" />
    <path d="M373 246 C426 212 458 176 476 128" stroke="${palette.accent}" stroke-width="12" stroke-linecap="round" fill="none" />
    <path d="M92 316 C36 316 18 352 6 402" stroke="${palette.accent}" stroke-width="12" stroke-linecap="round" fill="none" />
    <path d="M130 352 C64 392 36 440 18 494" stroke="${palette.accent}" stroke-width="12" stroke-linecap="round" fill="none" />
    <path d="M370 352 C436 392 464 440 482 494" stroke="${palette.accent}" stroke-width="12" stroke-linecap="round" fill="none" />
    <path d="M408 316 C464 316 482 352 494 402" stroke="${palette.accent}" stroke-width="12" stroke-linecap="round" fill="none" />
    <path d="M128 206 L76 134 L132 154" fill="${palette.panel}" stroke="${palette.accent}" stroke-width="8" stroke-linejoin="round" />
    <path d="M372 206 L424 134 L368 154" fill="${palette.panel}" stroke="${palette.accent}" stroke-width="8" stroke-linejoin="round" />
  </g>`;
}

function renderTeaMotif(palette: ReturnType<typeof createPalette>) {
  return `<g transform="translate(960 170)">
    <ellipse cx="235" cy="360" rx="210" ry="165" fill="${palette.accentSoft}" opacity="0.28" />
    <path d="M238 518 C258 418 260 320 244 198" stroke="${palette.accent}" stroke-width="10" stroke-linecap="round" fill="none" />
    <path d="M242 236 C146 172 92 180 76 258 C64 320 126 358 212 332 C286 310 320 248 242 236 Z" fill="${palette.panel}" stroke="${palette.accent}" stroke-width="8" />
    <path d="M248 316 C344 252 398 260 414 338 C426 400 364 438 278 412 C204 390 170 328 248 316 Z" fill="${palette.panel}" stroke="${palette.accent}" stroke-width="8" />
    <path d="M120 252 C176 258 214 274 266 310" stroke="${palette.accentSoft}" stroke-width="5" stroke-linecap="round" fill="none" />
    <path d="M222 344 C286 350 332 364 388 392" stroke="${palette.accentSoft}" stroke-width="5" stroke-linecap="round" fill="none" />
  </g>`;
}

function renderVegetableMotif(palette: ReturnType<typeof createPalette>, productName: string) {
  const isAsparagus = productName.toLowerCase().includes('asparagus');

  if (isAsparagus) {
    return `<g transform="translate(980 150)">
      <ellipse cx="220" cy="470" rx="210" ry="190" fill="${palette.accentSoft}" opacity="0.28" />
      ${[0, 1, 2, 3, 4].map((index) => {
        const x = 54 + index * 78;
        const height = 380 - index * 10;
        return `<g transform="translate(${x} ${580 - height})">
          <rect x="0" y="0" width="30" height="${height}" rx="15" fill="${palette.panel}" stroke="${palette.accent}" stroke-width="6" />
          <path d="M15 0 L0 42 L15 22 L30 42 Z" fill="${palette.accentSoft}" stroke="${palette.accent}" stroke-width="5" stroke-linejoin="round" />
        </g>`;
      }).join('')}
    </g>`;
  }

  return `<g transform="translate(950 170)">
    <ellipse cx="240" cy="420" rx="220" ry="170" fill="${palette.accentSoft}" opacity="0.28" />
    ${[0, 1, 2, 3].map((index) => {
      const x = 70 + index * 88;
      return `<g transform="translate(${x} ${140 + index * 18}) rotate(${index % 2 === 0 ? -8 : 8})">
        <rect x="0" y="0" width="42" height="360" rx="20" fill="${palette.panel}" stroke="${palette.accent}" stroke-width="7" />
        <rect x="8" y="26" width="26" height="34" rx="12" fill="${palette.accentSoft}" opacity="0.8" />
      </g>`;
    }).join('')}
  </g>`;
}

function renderMealMotif(palette: ReturnType<typeof createPalette>) {
  return `<g transform="translate(930 180)">
    <ellipse cx="280" cy="405" rx="260" ry="175" fill="${palette.accentSoft}" opacity="0.28" />
    <rect x="70" y="180" width="420" height="280" rx="34" fill="${palette.panel}" stroke="${palette.accent}" stroke-width="10" />
    <rect x="96" y="204" width="368" height="232" rx="24" fill="#f2d0a7" stroke="${palette.accentSoft}" stroke-width="6" />
    <path d="M126 286 C182 226 276 220 334 276 C380 320 392 366 412 382 C338 422 218 426 134 384 C120 356 108 324 126 286 Z" fill="${palette.accent}" opacity="0.88" />
    <path d="M176 142 C162 108 168 84 192 58" stroke="${palette.accent}" stroke-width="8" stroke-linecap="round" fill="none" />
    <path d="M268 126 C256 88 264 60 292 28" stroke="${palette.accent}" stroke-width="8" stroke-linecap="round" fill="none" />
    <path d="M352 142 C340 106 350 78 378 44" stroke="${palette.accent}" stroke-width="8" stroke-linecap="round" fill="none" />
  </g>`;
}

function renderCategoryMotif(brief: ProductImageBrief, palette: ReturnType<typeof createPalette>, shot: ProductImageShot) {
  const normalizedCategory = brief.category.toLowerCase();

  if (normalizedCategory.includes('mushroom')) {
    return renderMushroomMotif(palette, shot);
  }

  if (normalizedCategory.includes('aquatic')) {
    return renderCrabMotif(palette);
  }

  if (normalizedCategory.includes('tea')) {
    return renderTeaMotif(palette);
  }

  if (normalizedCategory.includes('vegetable')) {
    return renderVegetableMotif(palette, brief.productName);
  }

  return renderMealMotif(palette);
}

function renderSvgImage(brief: ProductImageBrief, shot: ProductImageShot) {
  const palette = createPalette(brief.category);
  const titleLines = wrapText(brief.productName, shot === 'hero' ? 22 : 20, 3);
  const descriptor = summarizeText(shot === 'hero' ? brief.heroSubject : brief.detailSubject, shot === 'hero' ? 122 : 116);
  const descriptorLines = wrapText(descriptor, shot === 'hero' ? 40 : 34, 4);
  const contextLine = summarizeText(brief.buyerContext, shot === 'hero' ? 112 : 90);
  const shotLabel = shot === 'hero' ? 'Primary export image' : 'Supporting detail image';
  const motif = renderCategoryMotif(brief, palette, shot);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1536 1024" role="img" aria-label="${escapeXml(shot === 'hero' ? brief.heroAlt : brief.detailAlt)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${palette.backgroundStart}" />
      <stop offset="100%" stop-color="${palette.backgroundEnd}" />
    </linearGradient>
    <radialGradient id="glow" cx="72%" cy="24%" r="70%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.88" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="1536" height="1024" fill="url(#bg)" />
  <rect width="1536" height="1024" fill="url(#glow)" />
  <g opacity="0.38">
    <path d="M0 860 C248 720 468 926 742 796 C1000 674 1210 744 1536 612 L1536 1024 L0 1024 Z" fill="#ffffff" />
  </g>
  <rect x="48" y="48" width="1440" height="928" rx="40" fill="none" stroke="${palette.line}" stroke-width="2" />
  <rect x="94" y="88" width="740" height="848" rx="34" fill="${palette.panel}" fill-opacity="0.84" stroke="${palette.line}" stroke-width="2" />
  <rect x="132" y="136" width="224" height="40" rx="20" fill="${palette.accentSoft}" />
  <text x="152" y="163" font-family="Source Sans 3, Arial, sans-serif" font-size="20" font-weight="700" letter-spacing="2.2" fill="${palette.accent}">${escapeXml(brief.category.toUpperCase())}</text>
  <text x="132" y="225" font-family="Source Sans 3, Arial, sans-serif" font-size="18" font-weight="700" letter-spacing="2.4" fill="${palette.muted}">${escapeXml(shotLabel.toUpperCase())}</text>
  ${titleLines.map((line, index) => `<text x="132" y="${320 + index * 84}" font-family="Georgia, Times New Roman, serif" font-size="72" font-weight="700" fill="${palette.ink}">${escapeXml(line)}</text>`).join('')}
  ${descriptorLines.map((line, index) => `<text x="132" y="${550 + index * 40}" font-family="Source Sans 3, Arial, sans-serif" font-size="30" font-weight="500" fill="${palette.muted}">${escapeXml(line)}</text>`).join('')}
  <rect x="132" y="760" width="598" height="112" rx="26" fill="#ffffff" fill-opacity="0.55" stroke="${palette.line}" stroke-width="2" />
  <text x="160" y="806" font-family="Source Sans 3, Arial, sans-serif" font-size="18" font-weight="700" letter-spacing="2.2" fill="${palette.accent}">BUYER CONTEXT</text>
  <text x="160" y="850" font-family="Source Sans 3, Arial, sans-serif" font-size="28" font-weight="600" fill="${palette.ink}">${escapeXml(contextLine)}</text>
  <text x="132" y="916" font-family="Source Sans 3, Arial, sans-serif" font-size="22" font-weight="700" letter-spacing="1.8" fill="${palette.muted}">FARMETRA EXPORT VISUAL SYSTEM</text>
  ${motif}
  <g opacity="0.82">
    <rect x="1058" y="752" width="328" height="116" rx="24" fill="${palette.panel}" fill-opacity="0.7" stroke="${palette.line}" stroke-width="2" />
    <text x="1092" y="800" font-family="Source Sans 3, Arial, sans-serif" font-size="18" font-weight="700" letter-spacing="2.1" fill="${palette.accent}">LAUNCH-SAFE REPLACEMENT</text>
    <text x="1092" y="848" font-family="Source Sans 3, Arial, sans-serif" font-size="28" font-weight="600" fill="${palette.ink}">${escapeXml(brief.productName)}</text>
  </g>
</svg>`;
}

function buildShotFileName(shot: ProductImageShot, outputFormat: OutputFormat) {
  return shot === 'hero' ? `hero.${outputFormat}` : `detail-1.${outputFormat}`;
}

function hasAiImageConfig() {
  if (process.env.AI_API_KEY?.trim() && process.env.AI_IMAGE_MODEL?.trim().startsWith('qwen-image')) {
    return true;
  }

  return ![process.env.AI_BASE_URL, process.env.AI_API_KEY].some((value) => !value || !value.trim());
}

function isDashScopeImageModel(model: string, baseUrl?: string) {
  return model.startsWith('qwen-image') || Boolean(baseUrl?.includes('dashscope.aliyuncs.com'));
}

function normalizeDashScopeImageSize(size: string) {
  return size.replace('x', '*');
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

function isRetryableRateLimitError(error: unknown) {
  const message = getErrorMessage(error).toLowerCase();
  return message.includes('429') || message.includes('ratequota') || message.includes('rate limit') || message.includes('throttling');
}

function isRetryableTransientError(error: unknown) {
  const message = getErrorMessage(error).toLowerCase();
  return message.includes('timed out') || message.includes('timeout') || message.includes('aborted') || message.includes('fetch failed');
}

function parseJsonSafely(value: string) {
  try {
    return JSON.parse(value) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs = imageRequestTimeoutMs) {
  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => controller.abort(new Error(`Request timed out after ${timeoutMs}ms`)), timeoutMs);

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeoutMs}ms`);
    }

    throw error;
  } finally {
    clearTimeout(timeoutHandle);
  }
}

async function withRetries<T>(label: string, operation: () => Promise<T>, maxRetries = 4) {
  let attempt = 0;

  while (true) {
    try {
      return await operation();
    } catch (error) {
      attempt += 1;

      if (attempt > maxRetries || (!isRetryableRateLimitError(error) && !isRetryableTransientError(error))) {
        throw error;
      }

      const delayMs = Math.min(45000, attempt * 12000);
      console.log(`${label}: hit rate limit, retrying in ${Math.round(delayMs / 1000)}s`);
      await sleep(delayMs);
    }
  }
}

type ImageSource =
  | { type: 'url'; value: string }
  | { type: 'base64'; value: string };

function extractImageSource(payload: Record<string, unknown> | null): ImageSource | null {
  if (!payload) {
    return null;
  }

  const resultCandidates = [
    (payload.output as Record<string, unknown> | undefined)?.results,
    (payload.output as Record<string, unknown> | undefined)?.images
  ];

  for (const resultCandidate of resultCandidates) {
    if (!Array.isArray(resultCandidate) || resultCandidate.length === 0) {
      continue;
    }

    const item = resultCandidate[0] as Record<string, unknown>;
    const url = item.url || item.image_url || item.orig_url || item.result_url;

    if (typeof url === 'string' && url.length > 0) {
      return { type: 'url', value: url };
    }

    const base64Value = item.base64_data || item.image_base64 || item.b64_json;

    if (typeof base64Value === 'string' && base64Value.length > 0) {
      return { type: 'base64', value: base64Value };
    }
  }

  return null;
}

function extractDashScopeChoiceImages(payload: Record<string, unknown> | null) {
  if (!payload) {
    return [] as string[];
  }

  const output = payload.output as Record<string, unknown> | undefined;
  const choices = output?.choices;

  if (!Array.isArray(choices) || choices.length === 0) {
    return [] as string[];
  }

  const firstChoice = choices[0] as Record<string, unknown>;
  const message = firstChoice.message as Record<string, unknown> | undefined;
  const content = message?.content;

  if (!Array.isArray(content)) {
    return [] as string[];
  }

  return content
    .map((item) => (item as Record<string, unknown>).image)
    .filter((value): value is string => typeof value === 'string' && value.length > 0);
}

async function imageToBuffer(image: { b64_json?: string; url?: string }) {
  if (image.b64_json) {
    return Buffer.from(image.b64_json, 'base64');
  }

  if (image.url) {
    const response = await fetchWithTimeout(image.url, {}, imageRequestTimeoutMs);

    if (!response.ok) {
      throw new Error(`Failed to download generated image from ${image.url}`);
    }

    return Buffer.from(await response.arrayBuffer());
  }

  throw new Error('The image API response did not include image data.');
}

function removeSvgFallback(outputDirectory: string, shot: ProductImageShot) {
  const fallbackPath = join(outputDirectory, buildShotFileName(shot, 'svg'));

  if (existsSync(fallbackPath)) {
    unlinkSync(fallbackPath);
  }
}

async function generateShot(options: {
  brief: ProductImageBrief;
  client: ReturnType<typeof createAiClient>['client'];
  imageModel: string;
  outputDirectory: string;
  outputFormat: Exclude<OutputFormat, 'svg'>;
  quality: CliOptions['quality'];
  shot: ProductImageShot;
  size: string;
}) {
  const prompt = buildPrompt(options.brief, options.shot);
  const fileName = buildShotFileName(options.shot, options.outputFormat);

  const response = await options.client.images.generate({
    model: options.imageModel,
    prompt,
    size: options.size,
    quality: options.quality,
    output_format: options.outputFormat,
    background: 'opaque',
    moderation: 'auto'
  });

  const image = response.data[0];

  if (!image) {
    throw new Error(`No image returned for ${options.brief.slug} (${options.shot}).`);
  }

  const buffer = await imageToBuffer(image);
  writeFileSync(join(options.outputDirectory, fileName), buffer);
  removeSvgFallback(options.outputDirectory, options.shot);

  return {
    shot: options.shot,
    fileName,
    prompt,
    revisedPrompt: image.revised_prompt ?? null
  } satisfies GeneratedShotRecord;
}

async function generateDashScopeShot(options: {
  apiKey: string;
  brief: ProductImageBrief;
  imageModel: string;
  outputDirectory: string;
  outputFormat: Exclude<OutputFormat, 'svg'>;
  shot: ProductImageShot;
  size: string;
}) {
  const prompt = buildPrompt(options.brief, options.shot);
  const fileName = buildShotFileName(options.shot, options.outputFormat);
  const payload = await withRetries(`dashscope-${options.brief.slug}-${options.shot}`, async () => {
    const response = await fetchWithTimeout(dashScopeGenerationEndpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${options.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: options.imageModel,
        input: {
          messages: [
            {
              role: 'user',
              content: [
                {
                  text: prompt
                }
              ]
            }
          ]
        },
        parameters: {
          size: normalizeDashScopeImageSize(options.size),
          negative_prompt: sharedNegativePrompt
        }
      })
    }, imageRequestTimeoutMs);

    const text = await response.text();

    if (!response.ok) {
      throw new Error(`DashScope image request failed (${response.status}): ${text || response.statusText}`);
    }

    return parseJsonSafely(text);
  });

  const imageUrls = extractDashScopeChoiceImages(payload);
  const imageSource = imageUrls[0]
    ? { type: 'url', value: imageUrls[0] } satisfies ImageSource
    : extractImageSource(payload);

  if (!imageSource) {
    throw new Error(`DashScope did not return image data for ${options.brief.slug} (${options.shot}): ${JSON.stringify(payload)}`);
  }

  const buffer = imageSource.type === 'base64'
    ? Buffer.from(imageSource.value, 'base64')
    : await imageToBuffer({ url: imageSource.value });

  writeFileSync(join(options.outputDirectory, fileName), buffer);
  removeSvgFallback(options.outputDirectory, options.shot);

  return {
    shot: options.shot,
    fileName,
    prompt,
    revisedPrompt: null
  } satisfies GeneratedShotRecord;
}

function writeSvgShot(options: {
  brief: ProductImageBrief;
  outputDirectory: string;
  shot: ProductImageShot;
}) {
  const fileName = buildShotFileName(options.shot, 'svg');
  writeFileSync(join(options.outputDirectory, fileName), renderSvgImage(options.brief, options.shot), 'utf8');

  return {
    shot: options.shot,
    fileName,
    prompt: `${options.shot === 'hero' ? options.brief.heroSubject : options.brief.detailSubject} ${options.brief.buyerContext}`,
    revisedPrompt: null
  } satisfies GeneratedShotRecord;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const briefs = selectBriefs(options);
  const shots: ProductImageShot[] = options.includeDetail ? ['hero', 'detail'] : ['hero'];
  const isFilteredRun = Boolean(options.slugs?.length) || typeof options.limit === 'number';
  const report: Array<{
    slug: string;
    productName: string;
    shots: GeneratedShotRecord[];
  }> = [];

  const resolvedMode = options.mode === 'auto'
    ? (hasAiImageConfig() ? 'ai' : 'svg')
    : options.mode;
  const resolvedOutputFormat: OutputFormat = resolvedMode === 'svg'
    ? 'svg'
    : options.outputFormat === 'svg'
      ? 'webp'
      : options.outputFormat;
  const imageModel = process.env.AI_IMAGE_MODEL?.trim() || 'gpt-image-1';
  const aiProvider = resolvedMode === 'ai'
    ? (isDashScopeImageModel(imageModel, process.env.AI_BASE_URL) ? 'dashscope' : 'openai-compatible')
    : null;

  const outputRoot = join(process.cwd(), 'apps', 'web', 'public', 'images', 'products');
  const reportFileName = isFilteredRun ? 'generation-report.partial.json' : 'generation-report.json';
  const reportPath = options.dryRun
    ? join(process.cwd(), 'docs', 'product-image-prompts.json')
    : join(outputRoot, reportFileName);

  if (options.dryRun || options.reportOnly) {
    for (const brief of briefs) {
      report.push({
        slug: brief.slug,
        productName: brief.productName,
        shots: shots.map((shot) => ({
          shot,
          fileName: shot === 'hero' ? `hero.${options.outputFormat}` : `detail-1.${options.outputFormat}`,
          prompt: buildPrompt(brief, shot),
          revisedPrompt: null
        }))
      });
    }

    writeFileSync(
      reportPath,
      JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          dryRun: options.dryRun,
          mode: resolvedMode,
          reportOnly: options.reportOnly,
          provider: aiProvider,
          imageModel: resolvedMode === 'ai' ? imageModel : null,
          reportFileName,
          shotCountPerProduct: shots.length,
          outputFormat: resolvedOutputFormat,
          quality: options.quality,
          size: options.size,
          items: report
        },
        null,
        2
      )
    );

    console.log(`${options.dryRun ? 'Dry run' : 'Report-only run'} complete. Wrote report to ${reportPath}`);
    return;
  }

  const client = resolvedMode === 'ai' && aiProvider === 'openai-compatible' ? createAiClient().client : null;
  const dashScopeApiKey = resolvedMode === 'ai' && aiProvider === 'dashscope' ? process.env.AI_API_KEY?.trim() : null;

  if (resolvedMode === 'ai' && !client) {
    if (aiProvider !== 'dashscope') {
      throw new Error('AI image mode requested, but the AI client could not be initialized.');
    }
  }

  if (resolvedMode === 'ai' && aiProvider === 'dashscope' && !dashScopeApiKey) {
    throw new Error('DashScope image mode requested, but AI_API_KEY is missing.');
  }

  if (resolvedMode === 'svg') {
    console.log('AI image credentials were not found. Generating branded SVG product visuals instead.');
  }

  mkdirSync(outputRoot, { recursive: true });

  for (const brief of briefs) {
    const outputDirectory = join(outputRoot, brief.slug);
    mkdirSync(outputDirectory, { recursive: true });

    console.log(`Generating ${brief.slug} (${shots.join(', ')}) with ${imageModel}${aiProvider === 'dashscope' ? ' via DashScope REST' : ''}`);

    const shotRecords: GeneratedShotRecord[] = [];

    for (const shot of shots) {
      shotRecords.push(resolvedMode === 'ai'
        ? aiProvider === 'dashscope'
          ? await generateDashScopeShot({
              apiKey: dashScopeApiKey!,
              brief,
              imageModel,
              outputDirectory,
              outputFormat: resolvedOutputFormat as Exclude<OutputFormat, 'svg'>,
              shot,
              size: options.size
            })
          : await generateShot({
              brief,
              client: client!,
              imageModel,
              outputDirectory,
              outputFormat: resolvedOutputFormat as Exclude<OutputFormat, 'svg'>,
              quality: options.quality,
              shot,
              size: options.size
            })
        : writeSvgShot({
            brief,
            outputDirectory,
            shot
          }));
    }

    report.push({
      slug: brief.slug,
      productName: brief.productName,
      shots: shotRecords
    });
  }

  writeFileSync(
    reportPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        dryRun: false,
        mode: resolvedMode,
        reportOnly: false,
        provider: aiProvider,
        imageModel: resolvedMode === 'ai' ? imageModel : null,
        reportFileName,
        shotCountPerProduct: shots.length,
        outputFormat: resolvedOutputFormat,
        quality: options.quality,
        size: options.size,
        items: report
      },
      null,
      2
    )
  );

  console.log(`Image generation complete in ${resolvedMode} mode. Wrote assets under ${outputRoot}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});