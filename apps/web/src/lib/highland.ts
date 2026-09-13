import type { Metadata } from 'next';
export type Localized = { zh: string; en: string };
export const localize = (value: Localized, locale: string) =>
  value[locale === 'zh' ? 'zh' : 'en'];
export const directions = [
  {
    slug: 'goji',
    category: 'berries',
    image: '/images/brand-v2/goji-editorial.png',
    name: { zh: '高原红枸杞', en: 'Red goji berries' },
    description: {
      zh: '一抹明亮的红，带来柔和果甜与丰富的食用灵感。',
      en: 'A brilliant red berry with a gentle sweetness and a place in everyday food.',
    },
    formats: {
      zh: '干果、果粉与果制品',
      en: 'Dried berries, powders and fruit preparations',
    },
    applications: {
      zh: '零食、谷物早餐、茶饮与烘焙',
      en: 'Snacks, breakfast bowls, tea blends and bakery',
    },
    detail: {
      zh: '整颗枸杞可以直接加入谷物早餐，也适合搭配茶饮、烘焙与混合零食。围绕果粒、口感和包装需求，发现适合您产品的表达。',
      en: 'Whole goji berries bring colour and texture to breakfast bowls, tea blends, bakery and snack mixes. Explore berry size, texture and packaging around the product you want to create.',
    },
    pairing: { zh: '谷物、坚果与清茶', en: 'Grains, nuts and a cup of tea' },
  },
  {
    slug: 'sea-buckthorn',
    category: 'berries',
    image: '/images/brand-v2/sea-buckthorn-editorial.png',
    name: { zh: '高原沙棘', en: 'Sea buckthorn' },
    description: {
      zh: '鲜明的橙色与酸香风味，让饮品与果味食品更有个性。',
      en: 'Vivid orange colour and a bright, tart character for drinks and fruit-led foods.',
    },
    formats: { zh: '果汁、原浆与果粉', en: 'Juice, purée and fruit powders' },
    applications: {
      zh: '果汁饮品、果酱、甜点与配料',
      en: 'Beverages, preserves, desserts and ingredients',
    },
    detail: {
      zh: '沙棘鲜明的果酸与色彩，为饮品、果酱和甜点开发提供鲜活灵感。从单一果味到复合配方，可围绕口感、加工方式与保存条件展开沟通。',
      en: 'Sea buckthorn’s striking colour and lively acidity offer a distinctive starting point for beverages, preserves and desserts. Discuss flavour balance, processing and storage for single-fruit or blended recipes.',
    },
    pairing: { zh: '蜂蜜、柑橘与乳制品', en: 'Honey, citrus and dairy' },
  },
  {
    slug: 'highland-barley',
    category: 'grains',
    image: '/images/brand-v2/barley-editorial.png',
    name: { zh: '青稞与谷物', en: 'Highland barley' },
    description: {
      zh: '源自高原的朴实谷香，连接传统食物与现代餐桌。',
      en: 'A distinctive grain tradition, reimagined for the way we eat today.',
    },
    formats: {
      zh: '原粮、谷物粉与加工食品',
      en: 'Whole grain, flour and grain-based foods',
    },
    applications: {
      zh: '谷物早餐、烘焙、主食与餐饮',
      en: 'Breakfast cereals, bakery, staple foods and foodservice',
    },
    detail: {
      zh: '从简单的谷物料理到烘焙与早餐食品，青稞为产品开发带来朴实而有辨识度的谷物风味。加工方式、颗粒规格与配方用途，可以共同构成选品的起点。',
      en: 'From simple grain dishes to bakery and breakfast foods, highland barley brings a grounded, distinctive grain character. Processing, grain specifications and intended recipes shape the sourcing conversation.',
    },
    pairing: {
      zh: '烘焙、菌菇与时令蔬菜',
      en: 'Bakery, mushrooms and seasonal vegetables',
    },
  },
  {
    slug: 'quinoa',
    category: 'grains',
    image: '/images/brand-v2/quinoa-editorial.png',
    name: { zh: '高原藜麦', en: 'Plateau quinoa' },
    description: {
      zh: '细腻颗粒与轻盈口感，为日常餐食增加层次。',
      en: 'Delicate grains and a versatile texture for colourful, everyday meals.',
    },
    formats: {
      zh: '原粮、混合谷物与即食组合',
      en: 'Whole grain, grain blends and prepared-food concepts',
    },
    applications: {
      zh: '沙拉、谷物碗、零售谷物与餐饮',
      en: 'Salads, grain bowls, retail grains and foodservice',
    },
    detail: {
      zh: '藜麦适合与蔬菜、香草和其他谷物组合，也能成为谷物碗和即食餐食的灵感来源。以颗粒、颜色和加工适配为线索，为您的菜单或产品寻找合适组合。',
      en: 'Quinoa pairs naturally with vegetables, herbs and other grains, offering ideas for grain bowls and prepared meals. Explore colour, grain profiles and processing suitability for your menu or food range.',
    },
    pairing: {
      zh: '香草、蔬菜与清爽酱汁',
      en: 'Fresh herbs, vegetables and bright dressings',
    },
  },
  {
    slug: 'black-goji',
    category: 'berries',
    image: '/images/brand-v2/black-goji-editorial.png',
    name: { zh: '高原黑枸杞', en: 'Black goji berries' },
    description: {
      zh: '深色小果与紫蓝色茶汤，为茶饮时刻增添一份趣味。',
      en: 'Dark little berries with a striking infusion, made for a slower tea moment.',
    },
    formats: { zh: '干果与茶饮组合', en: 'Dried berries and infusion blends' },
    applications: {
      zh: '冲泡茶饮、特色零售与礼赠',
      en: 'Botanical infusions, speciality retail and gifting',
    },
    detail: {
      zh: '一杯黑枸杞茶，以鲜明的色彩带来不一样的冲泡体验。围绕干果品质、包装和茶饮组合，探索特色零售与礼赠场景。',
      en: 'A black goji infusion brings a different colour to the tea ritual. Explore dried berry quality, packaging and infusion combinations for speciality retail and gifting.',
    },
    pairing: {
      zh: '清水慢泡与花草茶',
      en: 'Simple infusions and botanical tea blends',
    },
  },
  {
    slug: 'honey',
    category: 'pantry',
    image: '/images/brand-v2/honey-editorial.png',
    name: { zh: '高原蜂蜜', en: 'Plateau honey' },
    description: {
      zh: '柔和甜意，从一杯茶延伸到烘焙与日常餐桌。',
      en: 'A little sweetness, from a morning cup to baking and everyday food.',
    },
    formats: {
      zh: '蜂蜜、零售包装与礼赠组合',
      en: 'Honey, retail packs and gifting concepts',
    },
    applications: {
      zh: '茶饮、烘焙、早餐与食品配料',
      en: 'Tea, bakery, breakfast and food ingredients',
    },
    detail: {
      zh: '蜂蜜的色泽、口感与花源各有特点。从日常零售到食品应用，围绕具体蜜源、产品规格与包装展开沟通，发现适合您品牌的甜。',
      en: 'Every honey has its own colour, texture and floral character. From everyday retail to ingredient use, start with floral source, product specifications and packaging to find the right fit.',
    },
    pairing: { zh: '清茶、酸奶与谷物面包', en: 'Tea, yoghurt and grain bread' },
  },
] as const;
export type Collection = (typeof directions)[number];
export const highlandSocialImage = {
  url: '/images/highland/farmetra-social.png',
  alt: 'Farmetra — From the plateau. To the world.',
};
export function highlandMetadata(
  locale: string,
  title: Localized,
  description: Localized,
  path: string,
  image?: string,
): Metadata {
  const name = localize(title, locale),
    summary = localize(description, locale);
  const picture = image ? { url: image, alt: name } : highlandSocialImage;
  return {
    title: name,
    description: summary,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: {
        en: `/en${path}`,
        'zh-CN': `/zh${path}`,
        'x-default': `/en${path}`,
      },
    },
    openGraph: {
      title: `${name} | Farmetra`,
      description: summary,
      url: `/${locale}${path}`,
      type: 'website',
      siteName: 'Farmetra',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      images: [picture],
    },
    twitter: {
      card: 'summary_large_image',
      title: name,
      description: summary,
      images: [picture.url],
    },
  };
}
