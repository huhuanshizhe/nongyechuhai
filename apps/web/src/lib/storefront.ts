import { existsSync, readdirSync } from 'node:fs';
import { extname, join } from 'node:path';
import { cache } from 'react';
import { Prisma } from '@prisma/client';
import { prisma } from '@nongyechuhai/db';
import { getProductImageBrief } from './product-image-briefs';

const fallbackImageUrl =
  'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=1400&q=80';

type ResolvedProductImage = {
  url: string;
  alt: string;
};

type ResolvedProductImageSet = {
  primary: ResolvedProductImage;
  gallery: ResolvedProductImage[];
};

const generatedProductImageRoot = join(process.cwd(), 'public', 'images', 'products');
const generatedProductImageExtensions = new Set(['.webp', '.png', '.jpg', '.jpeg', '.svg']);
const generatedProductImageCache = new Map<string, ResolvedProductImageSet | null>();

function getGeneratedImagePriority(fileName: string) {
  const normalized = fileName.toLowerCase();

  if (normalized.startsWith('hero') || normalized.startsWith('cover') || normalized.startsWith('main')) {
    return 0;
  }

  if (normalized.startsWith('detail-1') || normalized.startsWith('detail_1') || normalized === 'detail.webp' || normalized === 'detail.png' || normalized === 'detail.jpg' || normalized === 'detail.jpeg') {
    return 1;
  }

  if (normalized.startsWith('detail')) {
    return 2;
  }

  return 3;
}

function buildGeneratedProductImageAlt(slug: string, productName: string, fileName: string) {
  const brief = getProductImageBrief(slug);

  if (brief) {
    return getGeneratedImagePriority(fileName) === 0 ? brief.heroAlt : brief.detailAlt;
  }

  return getGeneratedImagePriority(fileName) === 0
    ? productName
    : `${productName} detail image`;
}

function getGeneratedProductImages(slug: string, productName: string) {
  if (generatedProductImageCache.has(slug)) {
    return generatedProductImageCache.get(slug) ?? null;
  }

  const productDirectory = join(generatedProductImageRoot, slug);

  if (!existsSync(productDirectory)) {
    generatedProductImageCache.set(slug, null);
    return null;
  }

  const files = readdirSync(productDirectory)
    .filter((fileName) => generatedProductImageExtensions.has(extname(fileName).toLowerCase()))
    .sort((left, right) => {
      const priorityDifference = getGeneratedImagePriority(left) - getGeneratedImagePriority(right);

      if (priorityDifference !== 0) {
        return priorityDifference;
      }

      return left.localeCompare(right);
    });

  if (files.length === 0) {
    generatedProductImageCache.set(slug, null);
    return null;
  }

  const gallery = files.map((fileName) => ({
    url: `/images/products/${slug}/${fileName}`,
    alt: buildGeneratedProductImageAlt(slug, productName, fileName)
  }));

  const resolvedImages = {
    primary: gallery[0],
    gallery
  } satisfies ResolvedProductImageSet;

  generatedProductImageCache.set(slug, resolvedImages);
  return resolvedImages;
}

const productCardSelect = Prisma.validator<Prisma.ProductSelect>()({
  id: true,
  slug: true,
  name: true,
  summary: true,
  description: true,
  richDescription: true,
  tradeMode: true,
  currency: true,
  priceMin: true,
  priceMax: true,
  model: true,
  seoTitle: true,
  seoDescription: true,
  coverImageUrl: true,
  specsJson: true,
  category: {
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      parent: {
        select: {
          name: true
        }
      }
    }
  },
  supplier: {
    select: {
      id: true,
      description: true,
      isVerified: true,
      organization: {
        select: {
          name: true,
          country: true,
          city: true
        }
      }
    }
  },
  images: {
    orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
    select: {
      url: true,
      altText: true
    }
  }
});

const productDetailSelect = Prisma.validator<Prisma.ProductSelect>()({
  ...productCardSelect,
  categoryId: true,
  faqItems: {
    where: {
      isPublished: true
    },
    orderBy: {
      sortOrder: 'asc'
    },
    select: {
      question: true,
      answer: true
    }
  },
  variants: {
    where: {
      isActive: true
    },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    select: {
      sku: true,
      price: true,
      currency: true,
      stockQty: true,
      optionValues: true
    }
  }
});

type ProductQueryResult = Prisma.ProductGetPayload<{
  select: typeof productCardSelect;
}>;

type ProductDetailQueryResult = Prisma.ProductGetPayload<{
  select: typeof productDetailSelect;
}>;

type PortfolioGroupKey = 'fresh' | 'dried' | 'retail';

export type StorefrontProductCard = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  currency: string;
  priceMinValue: number | null;
  priceMaxValue: number | null;
  tradeModeLabel: string;
  tradeModeTone: 'inquiry' | 'purchase';
  tradeModeDescription: string;
  priceLabel: string;
  primaryImageUrl: string;
  primaryImageAlt: string;
  categoryName: string;
  categorySlug: string;
  portfolioGroup: PortfolioGroupKey | null;
  supplierName: string;
  supplierLocation: string;
  supplierDescription: string | null;
  supplierVerified: boolean;
  model: string | null;
  specHighlights: Array<{
    label: string;
    value: string;
  }>;
  seoTitle: string | null;
  seoDescription: string | null;
};

export type StorefrontProductDetail = StorefrontProductCard & {
  richDescriptionHtml: string;
  gallery: Array<{
    url: string;
    alt: string;
  }>;
  faqItems: Array<{
    question: string;
    answer: string;
  }>;
  variants: Array<{
    sku: string;
    title: string;
    priceLabel: string;
    stockLabel: string;
  }>;
};

export type StorefrontSupplierProgram = {
  name: string;
  location: string;
  description: string;
  lineCount: number;
  isVerified: boolean;
};

export type StorefrontCatalogGroup = {
  key: PortfolioGroupKey;
  title: string;
  description: string;
  products: StorefrontProductCard[];
};

export type CmsPageContent = {
  slug: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  locale: string;
  seoTitle: string | null;
  seoDescription: string | null;
  publishedAtLabel: string;
  publishedAtIso: string | null;
  faqItems: Array<{
    question: string;
    answer: string;
  }>;
};

export type BuyerAccountData = {
  buyerName: string;
  buyerEmail: string;
  metrics: {
    openInquiryCount: number;
    quotedInquiryCount: number;
    activeOrderCount: number;
    paidOrderCount: number;
  };
  inquiries: Array<{
    inquiryNumber: string;
    status: string;
    statusTone: 'green' | 'amber' | 'earth' | 'slate';
    productName: string;
    supplierName: string;
    quoteCount: number;
    createdAt: string;
  }>;
  orders: Array<{
    orderNumber: string;
    status: string;
    statusTone: 'green' | 'amber' | 'earth' | 'slate';
    paymentStatus: string;
    paymentTone: 'green' | 'amber' | 'earth' | 'slate';
    supplierName: string;
    productLabel: string;
    totalAmount: string;
    createdAt: string;
  }>;
};

type CatalogFilters = {
  category?: string;
  mode?: 'inquiry' | 'direct';
};

function numberFromDecimal(value: { toString(): string } | null) {
  return value ? Number(value.toString()) : null;
}

function formatMoney(value: number, currency: string, locale = 'en-US') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: value % 1 === 0 ? 0 : 2
  }).format(value);
}

function formatShortDate(value: Date | null | undefined) {
  if (!value) {
    return 'Pending';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(value);
}

function formatStatusLabel(value: string) {
  return value
    .toLowerCase()
    .split('_')
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(' ');
}

function getStatusTone(value: string): 'green' | 'amber' | 'earth' | 'slate' {
  switch (value) {
    case 'PUBLISHED':
    case 'APPROVED':
    case 'PAID':
    case 'COMPLETED':
    case 'CLOSED_WON':
      return 'green';
    case 'NEW':
    case 'IN_REVIEW':
    case 'PENDING':
    case 'NEGOTIATING':
    case 'CONFIRMED':
    case 'PROCESSING':
      return 'amber';
    case 'QUOTED':
    case 'SHIPPED':
    case 'AUTHORIZED':
      return 'earth';
    default:
      return 'slate';
  }
}

function formatPriceLabel(
  currency: string,
  priceMin: { toString(): string } | null,
  priceMax: { toString(): string } | null,
  tradeMode: string,
  locale?: string
) {
  if (tradeMode === 'INQUIRY_ONLY') {
    const min = numberFromDecimal(priceMin);
    const max = numberFromDecimal(priceMax);

    if (min && max) {
      return `${formatMoney(min, currency, locale)} - ${formatMoney(max, currency, locale)} ${locale === 'zh-CN' ? '参考区间' : 'reference range'}`;
    }

    return locale === 'zh-CN' ? '通过询盘询价' : 'Quoted through inquiry';
  }

  const min = numberFromDecimal(priceMin);
  const max = numberFromDecimal(priceMax);

  if (min && max && min !== max) {
    return `${formatMoney(min, currency, locale)} - ${formatMoney(max, currency, locale)}`;
  }

  if (min) {
    return `${locale === 'zh-CN' ? '起价' : 'From'} ${formatMoney(min, currency, locale)}`;
  }

  if (max) {
    return `${locale === 'zh-CN' ? '最高' : 'Up to'} ${formatMoney(max, currency, locale)}`;
  }

  return locale === 'zh-CN' ? '可根据需求报价' : 'Pricing available on request';
}

function humanizeKey(value: string, locale?: string) {
  if (locale === 'zh-CN') {
    const zhMap: Record<string, string> = {
      'Product Form': '产品形态',
      'Origin Program': '产地项目',
      'Pack Format': '包装规格',
      'Shelf Life': '保质期',
      'Storage': '储存方式',
      'Grade': '等级',
      'Min Order': '最小订量'
    };
    const normalized = value.replace(/([A-Z])/g, ' $1').replace(/[_-]/g, ' ').trim();
    return zhMap[normalized] || normalized;
  }
  return value
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]/g, ' ')
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function mapSpecHighlights(specsJson: unknown, locale?: string) {
  if (!specsJson || typeof specsJson !== 'object' || Array.isArray(specsJson)) {
    return locale === 'zh-CN'
      ? [
          { label: '产地项目', value: '已与供应商确认' },
          { label: '包装规格', value: '可提供商业包装' }
        ]
      : [
          { label: 'Origin program', value: 'Confirmed with supplier' },
          { label: 'Pack format', value: 'Commercial packaging available' }
        ];
  }

  const entries = Object.entries(specsJson as Record<string, unknown>).slice(0, 4);

  if (entries.length === 0) {
    return locale === 'zh-CN'
      ? [
          { label: '产地项目', value: '已与供应商确认' },
          { label: '包装规格', value: '可提供商业包装' }
        ]
      : [
          { label: 'Origin program', value: 'Confirmed with supplier' },
          { label: 'Pack format', value: 'Commercial packaging available' }
        ];
  }

  return entries.map(([label, value]) => ({
    label: humanizeKey(label, locale),
    value: Array.isArray(value) ? value.join(' / ') : String(value)
  }));
}

const mushroomPortfolioGroupMeta: Record<PortfolioGroupKey, { title: string; description: string }> = {
  fresh: {
    title: 'Fresh products',
    description: 'Fresh mushroom lines with origin detail and published brochure pricing for wholesale, ingredient, and hospitality buyers.'
  },
  dried: {
    title: 'Dried products',
    description: 'Shelf-stable dried mushroom lines prepared for ingredient import, pantry programs, and premium specialty sourcing.'
  },
  retail: {
    title: 'Retail packs',
    description: 'Supermarket and e-commerce SKUs with published retail pack formats, storage guidance, and brochure-based reference pricing.'
  }
};

function getPortfolioGroup(product: ProductQueryResult): PortfolioGroupKey | null {
  if (product.category.slug !== 'premium-mushrooms') {
    return null;
  }

  if (product.slug.includes('retail') || product.slug.includes('soup-pack')) {
    return 'retail';
  }

  if (!product.specsJson || typeof product.specsJson !== 'object' || Array.isArray(product.specsJson)) {
    return null;
  }

  const productForm = (product.specsJson as Record<string, unknown>).productForm;

  if (typeof productForm === 'string') {
    const normalizedValue = productForm.toLowerCase();

    if (normalizedValue.includes('fresh')) {
      return 'fresh';
    }

    if (normalizedValue.includes('dried')) {
      return 'dried';
    }
  }

  return null;
}

function getTradeModeTone(tradeMode: string) {
  return tradeMode === 'DIRECT_PURCHASE' ? 'purchase' : 'inquiry';
}

function getTradeModeLabel(tradeMode: string) {
  return tradeMode === 'DIRECT_PURCHASE' ? 'Direct order program' : 'Inquiry program';
}

function getTradeModeDescription(tradeMode: string) {
  return tradeMode === 'DIRECT_PURCHASE'
    ? 'Reference pricing and standard commercial packs are already published for direct buyer review.'
    : 'This line should begin through the inquiry desk so specification, destination market, and documentation can be aligned first.';
}

function getPrimaryImage(product: ProductQueryResult) {
  const generatedImages = getGeneratedProductImages(product.slug, product.name);

  if (generatedImages?.primary) {
    return generatedImages.primary;
  }

  const brief = getProductImageBrief(product.slug);

  if (brief?.fallbackHeroUrl) {
    return {
      url: brief.fallbackHeroUrl,
      alt: brief.heroAlt
    };
  }

  const image = product.images[0];

  if (image) {
    return {
      url: image.url,
      alt: image.altText || product.name
    };
  }

  if (product.coverImageUrl) {
    return {
      url: product.coverImageUrl,
      alt: product.name
    };
  }

  return {
    url: fallbackImageUrl,
    alt: product.name
  };
}

function mapProductCard(product: ProductQueryResult): StorefrontProductCard {
  const primaryImage = getPrimaryImage(product);
  const location = [product.supplier.organization.city, product.supplier.organization.country]
    .filter(Boolean)
    .join(', ');

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    summary: product.summary || product.description || 'Export-ready agricultural product presented for international buyers.',
    currency: product.currency,
    priceMinValue: numberFromDecimal(product.priceMin),
    priceMaxValue: numberFromDecimal(product.priceMax),
    tradeModeLabel: getTradeModeLabel(product.tradeMode),
    tradeModeTone: getTradeModeTone(product.tradeMode),
    tradeModeDescription: getTradeModeDescription(product.tradeMode),
    priceLabel: formatPriceLabel(product.currency, product.priceMin, product.priceMax, product.tradeMode),
    primaryImageUrl: primaryImage.url,
    primaryImageAlt: primaryImage.alt,
    categoryName: product.category.name,
    categorySlug: product.category.slug,
    portfolioGroup: getPortfolioGroup(product),
    supplierName: product.supplier.organization.name,
    supplierLocation: location || 'Origin to be confirmed',
    supplierDescription: product.supplier.description,
    supplierVerified: product.supplier.isVerified,
    model: product.model,
    specHighlights: mapSpecHighlights(product.specsJson),
    seoTitle: product.seoTitle,
    seoDescription: product.seoDescription
  };
}

function mapVariantTitle(optionValues: unknown) {
  if (!optionValues || typeof optionValues !== 'object' || Array.isArray(optionValues)) {
    return 'Standard commercial pack';
  }

  return Object.entries(optionValues as Record<string, unknown>)
    .map(([label, value]) => `${humanizeKey(label)}: ${String(value)}`)
    .join(' · ');
}

export const getStorefrontShellData = cache(async () => {
  const [publishedProductCount, approvedSupplierCount, activeCategoryCount] = await prisma.$transaction([
    prisma.product.count({
      where: {
        status: 'PUBLISHED',
        deletedAt: null
      }
    }),
    prisma.supplier.count({
      where: {
        status: 'APPROVED',
        isVerified: true
      }
    }),
    prisma.productCategory.count({
      where: {
        isActive: true,
        products: {
          some: {
            status: 'PUBLISHED',
            deletedAt: null
          }
        }
      }
    })
  ]);

  return {
    publishedProductCount,
    approvedSupplierCount,
    activeCategoryCount
  };
});

export const getHomepageData = cache(async () => {
  const [featuredProducts, categories, editorialPage] = await prisma.$transaction([
    prisma.product.findMany({
      where: {
        status: 'PUBLISHED',
        deletedAt: null
      },
      orderBy: [{ publishedAt: 'desc' }, { updatedAt: 'desc' }],
      take: 3,
      select: productCardSelect
    }),
    prisma.productCategory.findMany({
      where: {
        isActive: true,
        products: {
          some: {
            status: 'PUBLISHED',
            deletedAt: null
          }
        }
      },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      take: 6,
      select: {
        slug: true,
        name: true,
        description: true,
        parent: {
          select: {
            name: true
          }
        }
      }
    }),
    prisma.cmsPage.findFirst({
      where: {
        slug: 'about',
        locale: 'en',
        status: 'PUBLISHED'
      },
      select: {
        title: true,
        excerpt: true,
        content: true
      }
    })
  ]);

  return {
    featuredProducts: featuredProducts.map(mapProductCard),
    featuredCategories: categories.map((category) => ({
      slug: category.slug,
      name: category.name,
      description: category.description || 'Export-ready family curated for international buyers.',
      familyLabel: category.parent?.name || 'Primary category'
    })),
    editorial: {
      title: editorialPage?.title || 'How the portfolio is organized for formal export presentation',
      excerpt:
        editorialPage?.excerpt ||
        'The portfolio is organized around category clarity, origin visibility, and buyer inquiry readiness rather than generic listing volume.'
    }
  };
});

export async function getCatalogPageData(filters: CatalogFilters) {
  const where = {
    status: 'PUBLISHED' as const,
    deletedAt: null,
    ...(filters.category
      ? {
          category: {
            slug: filters.category
          }
        }
      : {}),
    ...(filters.mode === 'inquiry'
      ? {
          tradeMode: 'INQUIRY_ONLY' as const
        }
      : filters.mode === 'direct'
        ? {
            tradeMode: 'DIRECT_PURCHASE' as const
          }
        : {})
  };

  const [products, categories, allCount, inquiryCount, directCount] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      orderBy: [{ tradeMode: 'asc' }, { publishedAt: 'desc' }, { updatedAt: 'desc' }],
      select: productCardSelect
    }),
    prisma.productCategory.findMany({
      where: {
        isActive: true,
        products: {
          some: {
            status: 'PUBLISHED',
            deletedAt: null
          }
        }
      },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      select: {
        slug: true,
        name: true,
        description: true,
        parent: {
          select: {
            name: true
          }
        }
      }
    }),
    prisma.product.count({
      where: {
        status: 'PUBLISHED',
        deletedAt: null
      }
    }),
    prisma.product.count({
      where: {
        status: 'PUBLISHED',
        deletedAt: null,
        tradeMode: 'INQUIRY_ONLY'
      }
    }),
    prisma.product.count({
      where: {
        status: 'PUBLISHED',
        deletedAt: null,
        tradeMode: 'DIRECT_PURCHASE'
      }
    })
  ]);

  const activeCategory = categories.find((category) => category.slug === filters.category) || null;
  const mappedProducts = products.map(mapProductCard);
  const supplierPrograms = Array.from(
    products.reduce((programs, product) => {
      const location = [product.supplier.organization.city, product.supplier.organization.country]
        .filter(Boolean)
        .join(', ');
      const key = `${product.supplier.organization.name}::${location}`;
      const existing = programs.get(key);

      if (existing) {
        existing.lineCount += 1;
        return programs;
      }

      programs.set(key, {
        name: product.supplier.organization.name,
        location: location || 'Origin to be confirmed',
        description:
          product.supplier.description ||
          'Verified supplier program presented through this category for buyer qualification and commercial follow-up.',
        lineCount: 1,
        isVerified: product.supplier.isVerified
      });

      return programs;
    }, new Map<string, StorefrontSupplierProgram>())
      .values()
  ).slice(0, 3);
  const productGroups = activeCategory?.slug === 'premium-mushrooms'
    ? (['fresh', 'dried', 'retail'] as PortfolioGroupKey[])
        .map((key) => {
          const groupedProducts = mappedProducts.filter((product) => product.portfolioGroup === key);

          if (groupedProducts.length === 0) {
            return null;
          }

          return {
            key,
            title: mushroomPortfolioGroupMeta[key].title,
            description: mushroomPortfolioGroupMeta[key].description,
            products: groupedProducts
          } satisfies StorefrontCatalogGroup;
        })
        .filter((group): group is StorefrontCatalogGroup => group !== null)
    : [];

  return {
    products: mappedProducts,
    categories: categories.map((category) => ({
      slug: category.slug,
      name: category.name,
      description: category.description || 'Export-ready category',
      familyLabel: category.parent?.name || 'Primary category'
    })),
    productGroups,
    supplierPrograms,
    activeCategory,
    activeMode: filters.mode || null,
    modeCounts: {
      all: allCount,
      inquiry: inquiryCount,
      direct: directCount
    }
  };
}

export const getProductDetail = cache(async (slug: string) => {
  const product = await prisma.product.findFirst({
    where: {
      slug,
      status: 'PUBLISHED',
      deletedAt: null
    },
    select: productDetailSelect
  });

  if (!product) {
    return null;
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      status: 'PUBLISHED',
      deletedAt: null,
      categoryId: product.categoryId,
      id: {
        not: product.id
      }
    },
    orderBy: [{ publishedAt: 'desc' }, { updatedAt: 'desc' }],
    take: 3,
    select: productCardSelect
  });

  const baseProduct = mapProductCard(product as ProductDetailQueryResult);
  const generatedImages = getGeneratedProductImages(product.slug, product.name);
  const gallery = generatedImages?.gallery.length
    ? generatedImages.gallery
    : product.images.length > 0
      ? product.images.map((image) => ({
          url: image.url,
          alt: image.altText || product.name
        }))
      : [
          {
            url: baseProduct.primaryImageUrl,
            alt: baseProduct.primaryImageAlt
          }
        ];

  const faqItems = product.faqItems.length > 0
    ? product.faqItems
    : [
        {
          question: 'How should commercial discussion start for this line?',
          answer: baseProduct.tradeModeDescription
        }
      ];

  return {
    product: {
      ...baseProduct,
      richDescriptionHtml:
        product.richDescription ||
        `<p>${product.description || product.summary || 'Commercial product information will be expanded here as supplier data deepens.'}</p>`,
      gallery,
      faqItems,
      variants: (product.variants || []).map((variant) => ({
        sku: variant.sku,
        title: mapVariantTitle(variant.optionValues),
        priceLabel: formatMoney(Number(variant.price.toString()), variant.currency),
        stockLabel: `Current reference availability: ${variant.stockQty} units`
      }))
    } satisfies StorefrontProductDetail,
    relatedProducts: relatedProducts.map(mapProductCard)
  };
});

export async function getRfqPageData(selectedProductSlug?: string) {
  const products = await prisma.product.findMany({
    where: {
      status: 'PUBLISHED',
      deletedAt: null
    },
    orderBy: [{ tradeMode: 'asc' }, { publishedAt: 'desc' }, { updatedAt: 'desc' }],
    select: productCardSelect
  });

  const mappedProducts = products.map(mapProductCard);
  const selectedProduct = mappedProducts.find((product) => product.slug === selectedProductSlug) || mappedProducts[0] || null;

  return {
    products: mappedProducts,
    selectedProduct
  };
}

export const getCmsPageBySlug = cache(async (slug: string) => {
  const page = await prisma.cmsPage.findFirst({
    where: {
      slug,
      locale: 'en',
      status: 'PUBLISHED'
    },
    select: {
      slug: true,
      title: true,
      excerpt: true,
      content: true,
      locale: true,
      seoTitle: true,
      seoDescription: true,
      publishedAt: true,
      updatedAt: true,
      faqItems: {
        where: {
          isPublished: true
        },
        orderBy: {
          sortOrder: 'asc'
        },
        select: {
          question: true,
          answer: true
        }
      }
    }
  });

  if (!page) {
    return null;
  }

  return {
    slug: page.slug,
    title: page.title,
    excerpt: page.excerpt || 'Editorial content for international agriculture sourcing teams.',
    contentHtml: page.content || `<p>${page.excerpt || 'Content will be published here shortly.'}</p>`,
    locale: page.locale,
    seoTitle: page.seoTitle,
    seoDescription: page.seoDescription,
    publishedAtLabel: formatShortDate(page.publishedAt || page.updatedAt),
    publishedAtIso: (page.publishedAt || page.updatedAt)?.toISOString() || null,
    faqItems: page.faqItems
  } satisfies CmsPageContent;
});

export const getBuyerAccountData = cache(async (userId: string) => {
  const [buyer, openInquiryCount, quotedInquiryCount, activeOrderCount, paidOrderCount] = await prisma.$transaction([
    prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        name: true,
        email: true,
        buyerInquiries: {
          take: 6,
          orderBy: {
            createdAt: 'desc'
          },
          select: {
            inquiryNumber: true,
            status: true,
            createdAt: true,
            supplier: {
              select: {
                organization: {
                  select: {
                    name: true
                  }
                }
              }
            },
            product: {
              select: {
                name: true
              }
            },
            quotes: {
              select: {
                id: true
              }
            }
          }
        },
        buyerOrders: {
          take: 6,
          orderBy: {
            createdAt: 'desc'
          },
          select: {
            orderNumber: true,
            status: true,
            paymentStatus: true,
            totalAmount: true,
            currency: true,
            createdAt: true,
            supplier: {
              select: {
                organization: {
                  select: {
                    name: true
                  }
                }
              }
            },
            items: {
              take: 1,
              orderBy: {
                createdAt: 'asc'
              },
              select: {
                productNameSnapshot: true,
                quantity: true
              }
            }
          }
        }
      }
    }),
    prisma.inquiry.count({
      where: {
        buyerUserId: userId,
        status: {
          notIn: ['CLOSED_WON', 'CLOSED_LOST', 'EXPIRED']
        }
      }
    }),
    prisma.inquiry.count({
      where: {
        buyerUserId: userId,
        status: {
          in: ['QUOTED', 'NEGOTIATING']
        }
      }
    }),
    prisma.order.count({
      where: {
        buyerUserId: userId,
        status: {
          in: ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED']
        }
      }
    }),
    prisma.order.count({
      where: {
        buyerUserId: userId,
        paymentStatus: 'PAID'
      }
    })
  ]);

  if (!buyer) {
    return null;
  }

  return {
    buyerName: buyer.name || buyer.email,
    buyerEmail: buyer.email,
    metrics: {
      openInquiryCount,
      quotedInquiryCount,
      activeOrderCount,
      paidOrderCount
    },
    inquiries: buyer.buyerInquiries.map((item) => ({
      inquiryNumber: item.inquiryNumber,
      status: formatStatusLabel(item.status),
      statusTone: getStatusTone(item.status),
      productName: item.product?.name || 'General sourcing request',
      supplierName: item.supplier.organization.name,
      quoteCount: item.quotes.length,
      createdAt: formatShortDate(item.createdAt)
    })),
    orders: buyer.buyerOrders.map((item) => ({
      orderNumber: item.orderNumber,
      status: formatStatusLabel(item.status),
      statusTone: getStatusTone(item.status),
      paymentStatus: formatStatusLabel(item.paymentStatus),
      paymentTone: getStatusTone(item.paymentStatus),
      supplierName: item.supplier.organization.name,
      productLabel: item.items[0]
        ? `${item.items[0].productNameSnapshot} · ${item.items[0].quantity} units`
        : 'Order lines pending',
      totalAmount: formatMoney(Number(item.totalAmount.toString()), item.currency),
      createdAt: formatShortDate(item.createdAt)
    }))
  } satisfies BuyerAccountData;
});

// Get buyer inquiries by user ID
export async function getBuyerInquiries(userId: string) {
  const inquiries = await prisma.inquiry.findMany({
    where: { buyerUserId: userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      inquiryNumber: true,
      status: true,
      createdAt: true,
      customerCountry: true,
      quantityRequested: true,
      requirements: true,
      product: { select: { name: true } }
    }
  });

  return inquiries.map((inquiry) => ({
    id: inquiry.id,
    inquiryNumber: inquiry.inquiryNumber,
    status: inquiry.status.toLowerCase(),
    createdAt: inquiry.createdAt,
    destinationCountry: inquiry.customerCountry || 'Not specified',
    quantityRequested: inquiry.quantityRequested,
    requirements: inquiry.requirements || '',
    productName: inquiry.product?.name || null
  }));
}