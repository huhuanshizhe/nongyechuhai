export type ProductImageShot = 'hero' | 'detail';

export type ProductImageBrief = {
  slug: string;
  productName: string;
  category: string;
  heroAlt: string;
  detailAlt: string;
  heroSubject: string;
  detailSubject: string;
  buyerContext: string;
  fallbackHeroUrl?: string;
};

const sharedStyleGuide =
  'Premium commercial photography for a professional agricultural export platform. Realistic, trustworthy, editorial but restrained, warm neutral stone and deep forest accents, soft natural daylight, clean composition, premium B2B catalog quality, accurate food and agricultural textures, no people unless a hand is needed for scale, no text overlay, no logos, no label gibberish.';

export const sharedNegativePrompt =
  'cartoon, illustration, 3d render, cgi, fantasy, surreal, neon lighting, oversaturated colors, supermarket aisle clutter, watermark, text, logo, gibberish packaging, duplicate products, distorted food, pets, cats, dogs, beverages, smoothies, unrelated props';

function commonsImage(fileName: string) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}`;
}

const boletusFallback = commonsImage('Boletus_edulis_11.jpg');
const steinpilzFallback = commonsImage('Steinpilz_2006_08_3.jpg');

function createBrief(input: {
  slug: string;
  productName: string;
  category: string;
  heroSubject: string;
  detailSubject: string;
  buyerContext: string;
  fallbackHeroUrl?: string;
}) {
  return {
    slug: input.slug,
    productName: input.productName,
    category: input.category,
    heroAlt: `${input.productName} primary export catalog image`,
    detailAlt: `${input.productName} supporting detail image`,
    heroSubject: input.heroSubject,
    detailSubject: input.detailSubject,
    buyerContext: input.buyerContext,
    fallbackHeroUrl: input.fallbackHeroUrl
  } satisfies ProductImageBrief;
}

function createFreshMushroomBrief(input: {
  slug: string;
  productName: string;
  feature: string;
  fallbackHeroUrl: string;
}) {
  return createBrief({
    slug: input.slug,
    productName: input.productName,
    category: 'Premium mushrooms',
    heroSubject: `Fresh ${input.productName.toLowerCase()} arranged as a refined raw-product still life, ${input.feature}, presented for a premium export catalog with clean breathing room for landscape crops.`,
    detailSubject: `Close detail of raw ${input.productName.toLowerCase()} highlighting natural texture, moisture, cap structure, and realistic ingredient quality without cooking props.`,
    buyerContext: 'Signal verified Yunnan origin, premium ingredient quality, and professional B2B export discipline for importers, specialty distributors, and hospitality buyers.',
    fallbackHeroUrl: input.fallbackHeroUrl
  });
}

function createDriedMushroomBrief(input: {
  slug: string;
  productName: string;
  feature: string;
  fallbackHeroUrl: string;
}) {
  return createBrief({
    slug: input.slug,
    productName: input.productName,
    category: 'Premium mushrooms',
    heroSubject: `Dried ${input.productName.toLowerCase()} presented in a premium ingredient still life, ${input.feature}, clean export-catalog styling with warm stone, linen, and disciplined negative space.`,
    detailSubject: `Macro detail of dried ${input.productName.toLowerCase()} showing preserved texture, premium ingredient quality, and shelf-stable presentation without decorative clutter.`,
    buyerContext: 'Signal shelf-stable export readiness, premium pantry positioning, and professional sourcing quality for ingredient buyers and curated retail programs.',
    fallbackHeroUrl: input.fallbackHeroUrl
  });
}

function createRetailMushroomBrief(input: {
  slug: string;
  productName: string;
  packagingCue: string;
  feature: string;
  fallbackHeroUrl: string;
}) {
  return createBrief({
    slug: input.slug,
    productName: input.productName,
    category: 'Premium mushrooms',
    heroSubject: `${input.productName} shown as a premium retail export SKU with ${input.packagingCue}, a small amount of product visible beside the pack, ${input.feature}, and a clean commercial tabletop composition.`,
    detailSubject: `Supporting pack-and-product image for ${input.productName}, focusing on packaging credibility, product texture, and premium retail readiness without excessive props or branding text.`,
    buyerContext: 'Signal supermarket, gifting, and e-commerce readiness for professional buyers evaluating packaged mushroom lines.',
    fallbackHeroUrl: input.fallbackHeroUrl
  });
}

export function buildProductImagePrompt(brief: ProductImageBrief, shot: ProductImageShot) {
  const subject = shot === 'hero' ? brief.heroSubject : brief.detailSubject;
  const alt = shot === 'hero' ? brief.heroAlt : brief.detailAlt;

  return [
    sharedStyleGuide,
    `Product: ${brief.productName}.`,
    `Category: ${brief.category}.`,
    `Create the ${shot === 'hero' ? 'primary catalog hero image' : 'secondary supporting detail image'} for this product.`,
    `Scene: ${subject}`,
    `Buyer context: ${brief.buyerContext}`,
    'Composition: landscape 3:2, centered product, room for responsive crop, realistic materials, premium but restrained styling, no clutter.',
    `Output intent: ${alt}`
  ].join(' ');
}

export const productImageBriefs = [
  createBrief({
    slug: 'chinese-mitten-crab',
    productName: 'Chinese Mitten Crab',
    category: 'Aquatic products',
    heroSubject:
      'Premium live Chinese mitten crabs presented in a disciplined seafood export still life, clean oxygenated transport cues, dark slate surface, subtle cold-chain packaging context, and no market-stall clutter.',
    detailSubject:
      'Close product-detail view of live Chinese mitten crab showing shell texture, tied-leg export handling, and premium seasonal seafood quality in a clean controlled setup.',
    buyerContext:
      'Signal seasonal premium seafood sourcing, cold-chain competence, and gifting-grade export presentation for importers and hospitality buyers.'
  }),
  createFreshMushroomBrief({
    slug: 'organic-oyster-mushroom',
    productName: 'Organic Oyster Mushroom',
    feature: 'meaty pale caps, layered cluster structure, and tender springy texture',
    fallbackHeroUrl: boletusFallback
  }),
  createFreshMushroomBrief({
    slug: 'organic-elm-yellow-mushroom',
    productName: 'Organic Elm Yellow Mushroom',
    feature: 'aromatic golden caps with a smooth tender bite and fresh premium produce styling',
    fallbackHeroUrl: boletusFallback
  }),
  createFreshMushroomBrief({
    slug: 'organic-yunjizong-mushroom',
    productName: 'Organic Yunjizong Mushroom',
    feature: 'premium specialty fungi character, crisp tender texture, and a higher-value ingredient feel',
    fallbackHeroUrl: steinpilzFallback
  }),
  createFreshMushroomBrief({
    slug: 'organic-red-pine-mushroom',
    productName: 'Organic Red Pine Mushroom',
    feature: 'firm caps, graded ingredient quality, and a crisp premium mushroom profile',
    fallbackHeroUrl: boletusFallback
  }),
  createFreshMushroomBrief({
    slug: 'organic-beifeng-mushroom',
    productName: 'Organic Beifeng Mushroom',
    feature: 'mid-tier premium positioning, sweet springy texture, and consistent export-grade raw quality',
    fallbackHeroUrl: steinpilzFallback
  }),
  createFreshMushroomBrief({
    slug: 'organic-grey-tiger-paw-mushroom',
    productName: 'Organic Grey Tiger Paw Mushroom',
    feature: 'thicker premium texture, sculptural cap form, and specialty-retail ingredient appeal',
    fallbackHeroUrl: boletusFallback
  }),
  createFreshMushroomBrief({
    slug: 'organic-morel-mushroom',
    productName: 'Organic Morel Mushroom',
    feature: 'distinct honeycomb cap structure, earthy premium appeal, and fine-dining ingredient quality',
    fallbackHeroUrl: steinpilzFallback
  }),
  createDriedMushroomBrief({
    slug: 'dried-organic-oyster-mushroom',
    productName: 'Dried Organic Oyster Mushroom',
    feature: 'clean dehydrated slices with approachable pantry appeal and export-ready ingredient presentation',
    fallbackHeroUrl: boletusFallback
  }),
  createDriedMushroomBrief({
    slug: 'dried-organic-elm-yellow-mushroom',
    productName: 'Dried Organic Elm Yellow Mushroom',
    feature: 'aromatic dried texture and a more premium pantry profile than commodity mushrooms',
    fallbackHeroUrl: steinpilzFallback
  }),
  createDriedMushroomBrief({
    slug: 'dried-organic-yunjizong-mushroom',
    productName: 'Dried Organic Yunjizong Mushroom',
    feature: 'premium specialty dried fungi character suitable for gifting and curated ingredient buyers',
    fallbackHeroUrl: boletusFallback
  }),
  createDriedMushroomBrief({
    slug: 'dried-organic-red-pine-mushroom',
    productName: 'Dried Organic Red Pine Mushroom',
    feature: 'firm aromatic slices with a premium dried ingredient profile and refined visual texture',
    fallbackHeroUrl: steinpilzFallback
  }),
  createDriedMushroomBrief({
    slug: 'dried-organic-beifeng-mushroom',
    productName: 'Dried Organic Beifeng Mushroom',
    feature: 'mid-tier premium ingredient quality, balanced shelf-stable presentation, and clean texture contrast',
    fallbackHeroUrl: boletusFallback
  }),
  createDriedMushroomBrief({
    slug: 'dried-organic-grey-tiger-paw-mushroom',
    productName: 'Dried Organic Grey Tiger Paw Mushroom',
    feature: 'thicker premium dried texture and a specialty ingredient look suitable for export buyers',
    fallbackHeroUrl: steinpilzFallback
  }),
  createDriedMushroomBrief({
    slug: 'dried-organic-morel-mushroom',
    productName: 'Dried Organic Morel Mushroom',
    feature: 'high-value dried morels with visible grade quality and elevated gifting-grade ingredient appeal',
    fallbackHeroUrl: boletusFallback
  }),
  createRetailMushroomBrief({
    slug: 'organic-morel-retail-box',
    productName: 'Organic Morel Retail Box',
    packagingCue: 'a premium pouch and boxed retail presentation',
    feature: 'high-value gifting cues and clean shelf-ready composition',
    fallbackHeroUrl: boletusFallback
  }),
  createRetailMushroomBrief({
    slug: 'organic-elm-yellow-retail-box',
    productName: 'Organic Elm Yellow Retail Box',
    packagingCue: 'a refined 60 g retail box with visible dried product beside it',
    feature: 'approachable supermarket-ready styling with premium category cues',
    fallbackHeroUrl: steinpilzFallback
  }),
  createRetailMushroomBrief({
    slug: 'organic-grey-tiger-paw-retail-box',
    productName: 'Organic Grey Tiger Paw Retail Box',
    packagingCue: 'a premium 60 g shelf-ready retail box and a small product spill',
    feature: 'strong premium-retail texture and gifting-oriented visual discipline',
    fallbackHeroUrl: boletusFallback
  }),
  createRetailMushroomBrief({
    slug: 'organic-beifeng-retail-box',
    productName: 'Organic Beifeng Retail Box',
    packagingCue: 'a clean 60 g consumer box with restrained pantry styling',
    feature: 'mid-tier premium positioning and supermarket-ready trust cues',
    fallbackHeroUrl: steinpilzFallback
  }),
  createRetailMushroomBrief({
    slug: 'organic-red-pine-retail-box',
    productName: 'Organic Red Pine Retail Box',
    packagingCue: 'a premium packaged SKU with a firm-texture mushroom accent beside the box',
    feature: 'curated gifting and specialty retail appeal',
    fallbackHeroUrl: boletusFallback
  }),
  createRetailMushroomBrief({
    slug: 'organic-yunjizong-retail-box',
    productName: 'Organic Yunjizong Retail Box',
    packagingCue: 'a more premium consumer box with visible high-value product texture',
    feature: 'elevated premium shelf presence and giftable specialty-food styling',
    fallbackHeroUrl: steinpilzFallback
  }),
  createRetailMushroomBrief({
    slug: 'organic-white-matsutake-retail-box',
    productName: 'Organic White Matsutake Retail Box',
    packagingCue: 'a premium consumer pack with elegant specialty-food presentation',
    feature: 'higher-end gifting and curated e-commerce visual cues',
    fallbackHeroUrl: boletusFallback
  }),
  createRetailMushroomBrief({
    slug: 'organic-dried-mushroom-soup-pack',
    productName: 'Organic Dried Mushroom Soup Pack',
    packagingCue: 'a convenient pantry soup pack with visible dried mushroom ingredients',
    feature: 'usage-driven retail clarity for supermarket and pantry programs',
    fallbackHeroUrl: steinpilzFallback
  }),
  createRetailMushroomBrief({
    slug: 'organic-seasonal-fresh-mushroom-soup-pack',
    productName: 'Organic Seasonal Fresh Mushroom Soup Pack',
    packagingCue: 'a chilled premium 1 kg foam-box gifting format with fresh mushroom assortment cues',
    feature: 'seasonal premium gifting and fresh-retail cold-chain credibility',
    fallbackHeroUrl: boletusFallback
  }),
  createBrief({
    slug: 'west-lake-longjing-tea',
    productName: 'West Lake Longjing Tea',
    category: 'Tea',
    heroSubject:
      'Premium West Lake Longjing dry tea leaves with a nitrogen-flushed tin, refined Hangzhou tea-estate styling, pale warm stone surface, and disciplined gift-grade export presentation.',
    detailSubject:
      'Close detail of flat-pressed Longjing tea leaves with elegant texture, subtle tea tools, and professional origin-led premium gifting cues.',
    buyerContext:
      'Signal protected origin, premium spring harvest quality, and retail or hospitality gift readiness for global tea buyers.'
  }),
  createBrief({
    slug: 'fresh-jiaobai-stems',
    productName: 'Fresh Jiaobai Stems',
    category: 'Vegetables',
    heroSubject:
      'Fresh trimmed Jiaobai stems arranged for a chilled export produce catalog, subtle moisture, crisp clean-cut ends, perforated carton cue, and no wet-market clutter.',
    detailSubject:
      'Close detail of Jiaobai stem texture showing crisp white interior, fresh surface moisture, and premium produce quality in a controlled cold-chain setup.',
    buyerContext:
      'Signal seasonal chilled-export readiness, cold-chain discipline, and specialty produce quality for Asian retail and foodservice buyers.'
  }),
  createBrief({
    slug: 'green-asparagus-spears',
    productName: 'Green Asparagus Spears',
    category: 'Vegetables',
    heroSubject:
      'Straight green asparagus spears bundled for a premium export-produce catalog, hydro-cooled freshness cues, clean carton context, and professional reefer-program presentation.',
    detailSubject:
      'Macro detail of asparagus tips and spear uniformity showing premium fresh quality, tight heads, and realistic chilled produce texture.',
    buyerContext:
      'Signal sizing consistency, cold-chain readiness, and disciplined fresh-produce export presentation for importers and foodservice buyers.'
  }),
  createBrief({
    slug: 'halal-curry-chicken-ready-meal',
    productName: 'Halal Curry Chicken Ready Meal',
    category: 'Prepared food',
    heroSubject:
      'Halal curry chicken ready meal shown as a premium export-ready packaged food SKU in an unbranded sealed tray with minimal blank compliance band, no readable packaging text, and restrained warm food styling suitable for B2B buyers.',
    detailSubject:
      'Supporting image of the halal curry chicken ready meal with the tray partly opened or plated beside the pack, realistic curry texture, clear portioning, and trustworthy retail-food presentation with no readable packaging text.',
    buyerContext:
      'Signal halal compliance, export pack discipline, and professional prepared-food sourcing credibility for Gulf, Southeast Asian, and institutional buyers.'
  })
] satisfies ProductImageBrief[];

export const productImageBriefsBySlug = Object.fromEntries(
  productImageBriefs.map((brief) => [brief.slug, brief])
) as Record<string, ProductImageBrief>;

export function getProductImageBrief(slug: string) {
  return productImageBriefsBySlug[slug] ?? null;
}

export function getProductImageStyleGuide() {
  return sharedStyleGuide;
}