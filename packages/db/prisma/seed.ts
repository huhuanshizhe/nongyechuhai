import {
  OrganizationMemberRole,
  OrganizationType,
  PageStatus,
  PasswordAlgo,
  PaymentProvider,
  PaymentStatus,
  PrismaClient,
  ProductImageType,
  ProductStatus,
  SupplierStatus,
  TradeMode,
  UserRole,
  UserStatus
} from '@prisma/client';

const prisma = new PrismaClient();

const adminPasswordHash = '$2b$10$S2Nmrk.4N81Pxqm.Hyb9Eem3m2Qbv/OSRZgw3pjKYwn0FLiMzQ6wK';
const supplierPasswordHash = '$2b$10$j8bQVlcayD7DNBubB4bQpOOgFs71/tcVLYYYW2GDqwsxDPmp5RE3a';
const legacyProductSlugs = ['premium-dried-chili', 'dehydrated-garlic-flakes', 'yunnan-wild-boletus'];
const legacyCategorySlugs = ['spices-seasonings', 'dehydrated-vegetables'];
const huilinProductSlugs = new Set([
  'organic-oyster-mushroom',
  'organic-elm-yellow-mushroom',
  'organic-yunjizong-mushroom',
  'organic-red-pine-mushroom',
  'organic-beifeng-mushroom',
  'organic-grey-tiger-paw-mushroom',
  'organic-morel-mushroom',
  'dried-organic-oyster-mushroom',
  'dried-organic-elm-yellow-mushroom',
  'dried-organic-yunjizong-mushroom',
  'dried-organic-red-pine-mushroom',
  'dried-organic-beifeng-mushroom',
  'dried-organic-grey-tiger-paw-mushroom',
  'dried-organic-morel-mushroom',
  'organic-morel-retail-box',
  'organic-elm-yellow-retail-box',
  'organic-grey-tiger-paw-retail-box',
  'organic-beifeng-retail-box',
  'organic-red-pine-retail-box',
  'organic-yunjizong-retail-box',
  'organic-white-matsutake-retail-box',
  'organic-dried-mushroom-soup-pack',
  'organic-seasonal-fresh-mushroom-soup-pack'
]);

function commonsImage(fileName: string) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}`;
}

function huilinImage(slug: string) {
  return `/images/huilin-ai/${slug}.svg`;
}

function resolveCoverImage(slug: string, fallbackUrl: string) {
  return huilinProductSlugs.has(slug) ? huilinImage(slug) : fallbackUrl;
}

function minutesEarlier(date: Date, minutes: number) {
  return new Date(date.getTime() - minutes * 60 * 1000);
}

function daysLater(date: Date, days: number) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

type SupplierSeed = {
  slug: string;
  name: string;
  legalName: string;
  email: string;
  phone: string;
  website: string;
  country: string;
  city: string;
  addressLine1: string;
  postalCode: string;
  description: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  attachUserId?: string;
};

async function upsertSupplierProgram(program: SupplierSeed) {
  const organization = await prisma.organization.upsert({
    where: { slug: program.slug },
    update: {
      type: OrganizationType.SUPPLIER,
      name: program.name,
      legalName: program.legalName,
      email: program.email,
      phone: program.phone,
      website: program.website,
      country: program.country,
      city: program.city,
      addressLine1: program.addressLine1,
      postalCode: program.postalCode
    },
    create: {
      type: OrganizationType.SUPPLIER,
      slug: program.slug,
      name: program.name,
      legalName: program.legalName,
      email: program.email,
      phone: program.phone,
      website: program.website,
      country: program.country,
      city: program.city,
      addressLine1: program.addressLine1,
      postalCode: program.postalCode
    }
  });

  if (program.attachUserId) {
    await prisma.organizationMember.upsert({
      where: {
        organizationId_userId: {
          organizationId: organization.id,
          userId: program.attachUserId
        }
      },
      update: {
        role: OrganizationMemberRole.OWNER,
        isPrimary: true
      },
      create: {
        organizationId: organization.id,
        userId: program.attachUserId,
        role: OrganizationMemberRole.OWNER,
        isPrimary: true
      }
    });
  }

  return prisma.supplier.upsert({
    where: { organizationId: organization.id },
    update: {
      status: SupplierStatus.APPROVED,
      description: program.description,
      contactName: program.contactName,
      contactEmail: program.contactEmail,
      contactPhone: program.contactPhone,
      isVerified: true,
      approvedAt: new Date()
    },
    create: {
      organizationId: organization.id,
      status: SupplierStatus.APPROVED,
      description: program.description,
      contactName: program.contactName,
      contactEmail: program.contactEmail,
      contactPhone: program.contactPhone,
      isVerified: true,
      approvedAt: new Date()
    }
  });
}

type ProductLineSeed = {
  supplierId: string;
  categoryId: string;
  slug: string;
  name: string;
  brand: string;
  model: string;
  summary: string;
  description: string;
  richDescription: string;
  tradeMode: TradeMode;
  priceMin: string;
  priceMax: string;
  hasVariants: boolean;
  totalStock: number;
  specsJson: Record<string, unknown>;
  seoTitle: string;
  seoDescription: string;
  coverImageUrl: string;
  publishedAt: Date;
  currency?: string;
};

async function upsertProductLine(line: ProductLineSeed) {
  const resolvedCoverImageUrl = resolveCoverImage(line.slug, line.coverImageUrl);

  return prisma.product.upsert({
    where: { slug: line.slug },
    update: {
      supplierId: line.supplierId,
      categoryId: line.categoryId,
      name: line.name,
      brand: line.brand,
      model: line.model,
      summary: line.summary,
      description: line.description,
      richDescription: line.richDescription,
      tradeMode: line.tradeMode,
      status: ProductStatus.PUBLISHED,
      currency: line.currency ?? 'USD',
      priceMin: line.priceMin,
      priceMax: line.priceMax,
      hasVariants: line.hasVariants,
      totalStock: line.totalStock,
      specsJson: line.specsJson,
      seoTitle: line.seoTitle,
      seoDescription: line.seoDescription,
      coverImageUrl: resolvedCoverImageUrl,
      publishedAt: line.publishedAt
    },
    create: {
      supplierId: line.supplierId,
      categoryId: line.categoryId,
      slug: line.slug,
      name: line.name,
      brand: line.brand,
      model: line.model,
      summary: line.summary,
      description: line.description,
      richDescription: line.richDescription,
      tradeMode: line.tradeMode,
      status: ProductStatus.PUBLISHED,
      currency: line.currency ?? 'USD',
      priceMin: line.priceMin,
      priceMax: line.priceMax,
      hasVariants: line.hasVariants,
      totalStock: line.totalStock,
      specsJson: line.specsJson,
      seoTitle: line.seoTitle,
      seoDescription: line.seoDescription,
      coverImageUrl: resolvedCoverImageUrl,
      publishedAt: line.publishedAt
    }
  });
}

async function main() {
  if (!process.env.DATABASE_URL) {
    process.stdout.write('DATABASE_URL is not set. Skipping seed.\n');
    return;
  }

  const now = new Date();

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@nongyechuhai.local' },
    update: {
      name: 'Platform Admin',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      passwordHash: adminPasswordHash,
      passwordAlgo: PasswordAlgo.BCRYPT
    },
    create: {
      email: 'admin@nongyechuhai.local',
      name: 'Platform Admin',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      passwordHash: adminPasswordHash,
      passwordAlgo: PasswordAlgo.BCRYPT
    }
  });

  const supplierUser = await prisma.user.upsert({
    where: { email: 'supplier@nongyechuhai.local' },
    update: {
      name: 'Jiangnan Supplier Owner',
      role: UserRole.SUPPLIER,
      status: UserStatus.ACTIVE,
      passwordHash: supplierPasswordHash,
      passwordAlgo: PasswordAlgo.BCRYPT
    },
    create: {
      email: 'supplier@nongyechuhai.local',
      name: 'Jiangnan Supplier Owner',
      role: UserRole.SUPPLIER,
      status: UserStatus.ACTIVE,
      passwordHash: supplierPasswordHash,
      passwordAlgo: PasswordAlgo.BCRYPT
    }
  });

  const buyerUser = await prisma.user.upsert({
    where: { email: 'buyer@nongyechuhai.local' },
    update: {
      name: 'Demo Buyer',
      role: UserRole.BUYER,
      status: UserStatus.ACTIVE,
      passwordHash: adminPasswordHash,
      passwordAlgo: PasswordAlgo.BCRYPT
    },
    create: {
      email: 'buyer@nongyechuhai.local',
      name: 'Demo Buyer',
      role: UserRole.BUYER,
      status: UserStatus.ACTIVE,
      passwordHash: adminPasswordHash,
      passwordAlgo: PasswordAlgo.BCRYPT
    }
  });

  const jiangnanSupplier = await upsertSupplierProgram({
    slug: 'jiangnan-fresh-export',
    name: 'Jiangnan Fresh Export Co., Ltd.',
    legalName: 'Jiangnan Fresh Export Co., Ltd.',
    email: 'trade@jiangnanfresh.example',
    phone: '+86-512-0000-1800',
    website: 'https://jiangnanfresh.example',
    country: 'China',
    city: 'Suzhou',
    addressLine1: 'No. 18 Yangcheng Lake Logistics Avenue',
    postalCode: '215000',
    description:
      'Direct farm and packhouse program covering lower Yangtze aquatic specialties and seasonal water vegetables for export discussion.',
    contactName: 'Zhou Lan',
    contactEmail: 'trade@jiangnanfresh.example',
    contactPhone: '+86-512-0000-1800',
    attachUserId: supplierUser.id
  });

  const yunnanSupplier = await upsertSupplierProgram({
    slug: 'yunnan-highland-harvest',
    name: 'Yunnan Huilin Biotechnology Co., Ltd.',
    legalName: 'Yunnan Huilin Biotechnology Co., Ltd.',
    email: 'sales@huilinbio.example',
    phone: '+86-189-8827-2512',
    website: '',
    country: 'China',
    city: 'Kunming',
    addressLine1: 'Muyang Village, Aziying Subdistrict, Panlong District',
    postalCode: '650000',
    description:
      'Edible mushroom supplier established in 2006 with a 700-plus-acre organic demonstration base in Aziying, Kunming, and a 3,000-square-meter innovation center supporting spawn R&D, cultivation demonstration, technical service, processing, sales, and category education across fresh, dried, and retail mushroom programs.',
    contactName: 'Huilin Sales Desk',
    contactEmail: 'sales@huilinbio.example',
    contactPhone: '+86-189-8827-2512'
  });

  const westLakeSupplier = await upsertSupplierProgram({
    slug: 'west-lake-tea-botanicals',
    name: 'West Lake Tea & Botanicals Co., Ltd.',
    legalName: 'West Lake Tea & Botanicals Co., Ltd.',
    email: 'export@westlaketea.example',
    phone: '+86-571-0000-1188',
    website: 'https://westlaketea.example',
    country: 'China',
    city: 'Hangzhou',
    addressLine1: 'No. 26 Meijiawu Tea Village Road',
    postalCode: '310000',
    description:
      'Origin-led tea export program focused on premium green tea, gifting formats, and hospitality supply packs.',
    contactName: 'Lin Qiao',
    contactEmail: 'export@westlaketea.example',
    contactPhone: '+86-571-0000-1188'
  });

  const greenShootsSupplier = await upsertSupplierProgram({
    slug: 'green-shoots-produce-export',
    name: 'Green Shoots Produce Export Co., Ltd.',
    legalName: 'Green Shoots Produce Export Co., Ltd.',
    email: 'hello@greenshoots.example',
    phone: '+86-631-0000-1166',
    website: 'https://greenshoots.example',
    country: 'China',
    city: 'Weihai',
    addressLine1: 'No. 9 Coastal Reefer Logistics Park',
    postalCode: '264200',
    description:
      'Chilled vegetable export program covering asparagus and other premium fresh produce for retail and foodservice distribution.',
    contactName: 'Guo Chen',
    contactEmail: 'hello@greenshoots.example',
    contactPhone: '+86-631-0000-1166'
  });

  const eurasiaSupplier = await upsertSupplierProgram({
    slug: 'eurasia-halal-foods',
    name: 'Eurasia Halal Foods Co., Ltd.',
    legalName: 'Eurasia Halal Foods Co., Ltd.',
    email: 'bd@eurasiahalal.example',
    phone: '+86-534-0000-3290',
    website: 'https://eurasiahalal.example',
    country: 'China',
    city: 'Dezhou',
    addressLine1: 'No. 56 International Food Park Avenue',
    postalCode: '253000',
    description:
      'Halal-certified prepared foods program designed for retail, travel catering, and institutional export channels.',
    contactName: 'Amina Ma',
    contactEmail: 'bd@eurasiahalal.example',
    contactPhone: '+86-534-0000-3290'
  });

  const legacyGreenfieldOrganization = await prisma.organization.findUnique({
    where: { slug: 'greenfield-agro' },
    select: { id: true }
  });

  if (legacyGreenfieldOrganization) {
    await prisma.supplier.updateMany({
      where: { organizationId: legacyGreenfieldOrganization.id },
      data: {
        status: SupplierStatus.SUSPENDED,
        isVerified: false
      }
    });
  }

  const rootCategory = await prisma.productCategory.upsert({
    where: { slug: 'agricultural-products' },
    update: {
      name: 'China Agricultural Exports',
      description: 'A formal export portfolio presenting premium Chinese agricultural products with direct farm sourcing and end-to-end delivery support.'
    },
    create: {
      name: 'China Agricultural Exports',
      slug: 'agricultural-products',
      description: 'A formal export portfolio presenting premium Chinese agricultural products with direct farm sourcing and end-to-end delivery support.',
      sortOrder: 1,
      isActive: true
    }
  });

  const aquaticCategory = await prisma.productCategory.upsert({
    where: { slug: 'aquatic-products' },
    update: {
      parentId: rootCategory.id,
      name: 'Aquatic Products',
      description: 'Seasonal aquatic export programs supported by harvest planning, cold-chain handling, and destination-market coordination.'
    },
    create: {
      parentId: rootCategory.id,
      name: 'Aquatic Products',
      slug: 'aquatic-products',
      description: 'Seasonal aquatic export programs supported by harvest planning, cold-chain handling, and destination-market coordination.',
      sortOrder: 1,
      isActive: true
    }
  });

  const fungiCategory = await prisma.productCategory.upsert({
    where: { slug: 'premium-mushrooms' },
    update: {
      parentId: rootCategory.id,
      name: 'Premium Mushrooms',
      description: 'Organic mushroom programs from Yunnan spanning fresh fungi, dried ingredient lines, and supermarket or e-commerce retail packs. Current supplier coverage includes oyster, morel, tiger paw, yunjizong, and seasonal mixed soup-pack formats.'
    },
    create: {
      parentId: rootCategory.id,
      name: 'Premium Mushrooms',
      slug: 'premium-mushrooms',
      description: 'Organic mushroom programs from Yunnan spanning fresh fungi, dried ingredient lines, and supermarket or e-commerce retail packs. Current supplier coverage includes oyster, morel, tiger paw, yunjizong, and seasonal mixed soup-pack formats.',
      sortOrder: 2,
      isActive: true
    }
  });

  const teaCategory = await prisma.productCategory.upsert({
    where: { slug: 'chinese-tea' },
    update: {
      parentId: rootCategory.id,
      name: 'Chinese Tea',
      description: 'Origin-specific Chinese tea programs for premium retail, gifting, hospitality, and cultural presentation.'
    },
    create: {
      parentId: rootCategory.id,
      name: 'Chinese Tea',
      slug: 'chinese-tea',
      description: 'Origin-specific Chinese tea programs for premium retail, gifting, hospitality, and cultural presentation.',
      sortOrder: 3,
      isActive: true
    }
  });

  const vegetablesCategory = await prisma.productCategory.upsert({
    where: { slug: 'specialty-vegetables' },
    update: {
      parentId: rootCategory.id,
      name: 'Specialty Vegetables',
      description: 'Specialty vegetable programs prepared for fresh export, reefer movement, and premium retail or foodservice presentation.'
    },
    create: {
      parentId: rootCategory.id,
      name: 'Specialty Vegetables',
      slug: 'specialty-vegetables',
      description: 'Specialty vegetable programs prepared for fresh export, reefer movement, and premium retail or foodservice presentation.',
      sortOrder: 4,
      isActive: true
    }
  });

  const halalCategory = await prisma.productCategory.upsert({
    where: { slug: 'halal-prepared-foods' },
    update: {
      parentId: rootCategory.id,
      name: 'Halal Prepared Foods',
      description: 'Halal-certified prepared food programs designed for retail, institutional catering, airline supply, and cross-border distribution.'
    },
    create: {
      parentId: rootCategory.id,
      name: 'Halal Prepared Foods',
      slug: 'halal-prepared-foods',
      description: 'Halal-certified prepared food programs designed for retail, institutional catering, airline supply, and cross-border distribution.',
      sortOrder: 5,
      isActive: true
    }
  });

  await prisma.product.updateMany({
    where: {
      slug: {
        in: legacyProductSlugs
      }
    },
    data: {
      status: ProductStatus.OFFLINE
    }
  });

  await prisma.productCategory.updateMany({
    where: {
      slug: {
        in: legacyCategorySlugs
      }
    },
    data: {
      isActive: false
    }
  });

  const chineseMittenCrab = await upsertProductLine({
    supplierId: jiangnanSupplier.id,
    categoryId: aquaticCategory.id,
    slug: 'chinese-mitten-crab',
    name: 'Chinese Mitten Crab',
    brand: 'Jiangnan Fresh',
    model: 'JFE-CRAB-220',
    summary: 'Seasonal live Chinese mitten crab from lower Yangtze farms. Available September–December for live export, chilled gift-box, and premium festive retail programs. Oxygenated transport and cold-chain documentation included.',
    description: 'Lower Yangtze-bred Eriocheir sinensis for importers, hospitality groups, and seasonal premium retail. Harvest timing, packaging, and route confirmed through inquiry.',
    richDescription:
      '<p>The Chinese mitten crab (Eriocheir sinensis) is a prized seasonal delicacy across East and Southeast Asian markets, with established demand during the Mid-Autumn and year-end festive window. This program sources from lower Yangtze breeding bases in Jiangsu, where water quality, feed management, and harvest scheduling are controlled for export consistency.</p><p>Each crab ships in oxygenated live-transport crates with individual compartmenting. For gift-market buyers, chilled presentation boxes with cold-chain monitoring are also available. All shipments include origin certification, health inspection documentation, and bilingual (CN/EN) labeling.</p><p>Typical buyer discussions begin with harvest window confirmation, destination-market import requirements, packaging format, and transport routing — allowing commercial terms to be structured around real seasonal and logistical parameters rather than estimates.</p>',
    tradeMode: TradeMode.INQUIRY_ONLY,
    priceMin: '26.00',
    priceMax: '42.00',
    hasVariants: false,
    totalStock: 800,
    specsJson: {
      originRegion: 'Lower Yangtze breeding bases',
      seasonWindow: 'September to December',
      packFormats: ['Live oxygenated crate', 'Chilled gift box'],
      coldChain: 'Airport and reefer coordination'
    },
    seoTitle: 'Chinese Mitten Crab Export Program',
    seoDescription: 'Seasonal Chinese mitten crab export program with gifting formats, cold-chain planning, and delivery coordination.',
    coverImageUrl: commonsImage('HK SW 上環 Sheung Wan 永樂街 120 Wing Lok Street shop 成隆行 Shing Lung Hong 大閘蟹 live Chinese mitten crabs water tank December 2021 SS2 03.jpg'),
    publishedAt: minutesEarlier(now, 0)
  });

  const organicOysterMushroom = await upsertProductLine({
    supplierId: yunnanSupplier.id,
    categoryId: fungiCategory.id,
    slug: 'organic-oyster-mushroom',
    name: 'Organic Oyster Mushroom',
    brand: 'Huilin Organic',
    model: 'HL-FRESH-OST-1KG',
    summary: 'Fresh organic oyster mushrooms from Kunming, Yunnan. Meaty caps, tender texture. Reference price CNY 11/kg. Suitable for wholesale fresh supply, foodservice prep, and fresh import programs.',
    description: 'Fresh organic Pleurotus ostreatus from Huilin&apos;s 700-acre organic demonstration base in Aziying, Kunming. Direct-order with published CNY pricing.',
    richDescription:
      '<p>Organic oyster mushrooms from Huilin&apos;s certified organic base in Aziying, Panlong District, Kunming. The 700-acre facility operates under organic cultivation protocols with documented soil, water, and input management. Oyster mushrooms are grown in climate-controlled houses with regulated humidity and ventilation to produce consistent cap size and texture.</p><p>Fresh product is reference-priced at CNY 11/kg. Caps are meaty with tender texture and light springiness — characteristics that hold up well in fresh distribution, foodservice preparation, and trial import programs. The supplier ships in foam-box packaging with ice packs for short-haul distribution; longer-distance cold-chain arrangements are discussed per order.</p><p>This product serves as an accessible entry point into Huilin&apos;s broader organic mushroom range, backed by the supplier&apos;s 3,000 m² innovation center supporting spawn R&D, cultivation, processing, and technical service.</p>',
    tradeMode: TradeMode.DIRECT_PURCHASE,
    currency: 'CNY',
    priceMin: '11.00',
    priceMax: '11.00',
    hasVariants: false,
    totalStock: 3600,
    specsJson: {
      productForm: 'Fresh organic mushroom',
      originBase: 'Muyang Village, Aziying, Panlong District, Kunming',
      referencePrice: 'CNY 11/kg',
      productTraits: 'Meaty caps with tender texture and light springiness'
    },
    seoTitle: 'Organic Oyster Mushroom Supplier Program',
    seoDescription: 'Fresh organic oyster mushroom supply program from Kunming for wholesale, foodservice, and fresh import review.',
    coverImageUrl: commonsImage('Boletus_edulis_11.jpg'),
    publishedAt: minutesEarlier(now, 1)
  });

  const organicMorelMushroom = await upsertProductLine({
    supplierId: yunnanSupplier.id,
    categoryId: fungiCategory.id,
    slug: 'organic-morel-mushroom',
    name: 'Organic Morel Mushroom',
    brand: 'Huilin Organic',
    model: 'HL-FRESH-MOREL-1KG',
    summary: 'Fresh organic morel mushrooms (Morchella) from Kunming, Yunnan. Rich aroma, honeycomb cap structure, crisp-smooth texture. Reference price CNY 125–160/kg. For premium ingredient sourcing, hospitality, and specialty import.',
    description: 'Fresh organic morels from Huilin&apos;s Kunming base. Higher-value line with grade-dependent pricing. Suitable for premium hospitality, gifting, and specialty ingredient import.',
    richDescription:
      '<p>Organic morel mushrooms (Morchella spp.) are among the most sought-after fungi in global culinary and ingredient markets. Huilin cultivates these under organic protocol at its Aziying, Kunming facility, with controlled substrate, humidity, and harvest timing to produce consistent cap development and aroma profile.</p><p>The fresh line is reference-priced at CNY 125–160/kg depending on grade. Morels exhibit a rich, earthy aroma with a honeycomb cap structure and a crisp, smooth bite that holds texture through cooking. Primary commercial channels include premium hospitality purchasing, seasonal gifting, and specialty ingredient import for high-end retail and foodservice.</p><p>Buyers evaluating this product typically discuss seasonal availability windows, grade selection, cold-chain routing to destination, and whether the fresh line should be paired with dried or retail-ready formats from the same supplier for a more complete program.</p>',
    tradeMode: TradeMode.DIRECT_PURCHASE,
    currency: 'CNY',
    priceMin: '125.00',
    priceMax: '160.00',
    hasVariants: false,
    totalStock: 920,
    specsJson: {
      productForm: 'Fresh organic morel',
      originBase: 'Muyang Village, Aziying, Panlong District, Kunming',
      referencePrice: 'CNY 125-160/kg',
      targetChannels: 'Hospitality, gifting, and specialty ingredient import'
    },
    seoTitle: 'Organic Morel Mushroom Supplier Program',
    seoDescription: 'Fresh organic morel mushroom line from Kunming for premium ingredient, gifting, and hospitality sourcing.',
    coverImageUrl: commonsImage('Steinpilz_2006_08_3.jpg'),
    publishedAt: minutesEarlier(now, 2)
  });

  const organicMorelRetailBox = await upsertProductLine({
    supplierId: yunnanSupplier.id,
    categoryId: fungiCategory.id,
    slug: 'organic-morel-retail-box',
    name: 'Organic Morel Retail Box',
    brand: 'Huilin Organic',
    model: 'HL-RETAIL-MOREL',
    summary: '60 g organic morel retail box. Two SKUs: 30 g pouch (CNY 31) and 50 g box (CNY 48). 12-month shelf life, sealed packaging. Direct-order for supermarket, e-commerce, and gifting channels.',
    description: 'Retail-ready organic morel packs from Huilin in consumer-facing pouch and box formats with published wholesale pricing.',
    richDescription:
      '<p>The Organic Morel Retail Box translates Huilin&apos;s organic morel supply into a supermarket and e-commerce-ready format rather than a bulk ingredient line.</p><p>The current supplier brochure lists two commercial packs: a 30 g pouch at CNY 31 and a 50 g box at CNY 48, both stored sealed in a cool, dark place with a published shelf life of 12 months.</p><p>These formats are suitable for buyers wanting a smaller test order, retail shelf review, gift-pack evaluation, or a more structured discussion about labeling, channel fit, and minimum order quantity before expanding into a broader mushroom program.</p>',
    tradeMode: TradeMode.DIRECT_PURCHASE,
    currency: 'CNY',
    priceMin: '31.00',
    priceMax: '48.00',
    hasVariants: true,
    totalStock: 1800,
    specsJson: {
      packFormats: ['30g pouch', '50g box'],
      shelfLife: '12 months',
      storage: 'Sealed, cool, dark place',
      minOrderQty: '100 boxes'
    },
    seoTitle: 'Organic Morel Retail Box Direct Order Program',
    seoDescription: 'Retail-ready organic morel packs for supermarket, e-commerce, and gifting channels with published 30g and 50g formats.',
    coverImageUrl: commonsImage('Boletus_edulis_11.jpg'),
    publishedAt: minutesEarlier(now, 3)
  });

  await Promise.all(
    [
      {
        slug: 'organic-elm-yellow-mushroom',
        name: 'Organic Elm Yellow Mushroom',
        model: 'HL-FRESH-EYM-1KG',
        summary: 'Fresh organic elm yellow mushrooms from Kunming prepared for specialty retail, foodservice prep, and buyers who need an aromatic Yunnan fungi line with a published brochure price.',
        description: 'A fresh organic elm yellow mushroom line from Huilin for buyers looking for a fragrant, tender mushroom offer from a verified Yunnan supplier program.',
        richDescription:
          '<p>Organic Elm Yellow Mushroom extends the Huilin fresh range with a line suited to chefs, specialty distributors, and importers who want a more aromatic mushroom profile than a standard oyster line.</p><p>The supplier brochure lists the product at CNY 15 per kilogram and highlights its rich aroma, fresh taste, and smooth tender texture, making it useful for both premium retail and foodservice preparation.</p><p>The line is a ready-to-review fresh product with a published supplier price, clear origin, and straightforward route into first-order discussion.</p>',
        priceMin: '15.00',
        priceMax: '15.00',
        totalStock: 2200,
        specsJson: {
          productForm: 'Fresh organic mushroom',
          originBase: 'Muyang Village, Aziying, Panlong District, Kunming',
          referencePrice: 'CNY 15/kg',
          productTraits: 'Fragrant aroma with a smooth tender bite'
        },
        seoTitle: 'Organic Elm Yellow Mushroom Supplier Program',
        seoDescription: 'Fresh organic elm yellow mushroom line from Kunming with a published brochure price for specialty retail and foodservice buyers.',
        coverImageUrl: commonsImage('Boletus_edulis_11.jpg')
      },
      {
        slug: 'organic-yunjizong-mushroom',
        name: 'Organic Yunjizong Mushroom',
        model: 'HL-FRESH-YJZ-1KG',
        summary: 'Fresh organic yunjizong mushrooms from Huilin positioned for premium ingredient sourcing, hospitality menus, and buyers seeking a higher-value Yunnan mushroom line.',
        description: 'A fresh organic yunjizong program from Yunnan Huilin with a published supplier price and a premium taste profile for professional buyers.',
        richDescription:
          '<p>Organic Yunjizong Mushroom is presented as one of the higher-value fresh products in the Huilin brochure, aimed at buyers who need a distinct Yunnan specialty with stronger menu and gifting appeal.</p><p>The brochure lists the line at CNY 80 per kilogram and describes a crisp, tender texture with a sweet aromatic bite, positioning it above everyday fresh mushroom programs.</p><p>That makes it suitable for premium ingredient import, hospitality purchasing, and curated retail programs that need a more differentiated mushroom story.</p>',
        priceMin: '80.00',
        priceMax: '80.00',
        totalStock: 980,
        specsJson: {
          productForm: 'Fresh organic mushroom',
          originBase: 'Muyang Village, Aziying, Panlong District, Kunming',
          referencePrice: 'CNY 80/kg',
          productTraits: 'Crisp tender texture with sweet aromatic notes'
        },
        seoTitle: 'Organic Yunjizong Mushroom Supplier Program',
        seoDescription: 'Fresh organic yunjizong mushroom from Kunming with a published brochure price for premium ingredient and hospitality buyers.',
        coverImageUrl: commonsImage('Steinpilz_2006_08_3.jpg')
      },
      {
        slug: 'organic-red-pine-mushroom',
        name: 'Organic Red Pine Mushroom',
        model: 'HL-FRESH-RPM-1KG',
        summary: 'Fresh organic red pine mushrooms with grade-based brochure pricing for buyers needing a structured Yunnan supply line for ingredient, retail, and foodservice channels.',
        description: 'A fresh red pine mushroom line from Huilin with Grade I and Grade II pricing published in the supplier brochure.',
        richDescription:
          '<p>Organic Red Pine Mushroom is listed by Huilin as a graded fresh product rather than a single undifferentiated bulk line.</p><p>The brochure quotes Grade I at CNY 40 per kilogram and Grade II at CNY 30 per kilogram, while describing a crisp, firm texture and clean mushroom aroma suited to premium ingredient use.</p><p>This line demonstrates the supplier&apos;s ability to support more disciplined commercial review where grade and price structure matter.</p>',
        priceMin: '30.00',
        priceMax: '40.00',
        totalStock: 1500,
        specsJson: {
          productForm: 'Fresh organic mushroom',
          availableGrades: 'Grade I / Grade II',
          referencePrice: 'CNY 40/kg grade I; CNY 30/kg grade II',
          productTraits: 'Crisp, firm texture with a clean aroma'
        },
        seoTitle: 'Organic Red Pine Mushroom Supplier Program',
        seoDescription: 'Fresh organic red pine mushroom line with grade-based brochure pricing for ingredient and foodservice buyers.',
        coverImageUrl: commonsImage('Boletus_edulis_11.jpg')
      },
      {
        slug: 'organic-beifeng-mushroom',
        name: 'Organic Beifeng Mushroom',
        model: 'HL-FRESH-BFM-1KG',
        summary: 'Fresh organic beifeng mushrooms positioned for wholesale fresh supply and premium retail with a published brochure price and a sweet, springy texture profile.',
        description: 'A fresh organic beifeng mushroom line from Huilin for buyers looking for a smooth, springy Yunnan fungi product with visible supplier pricing.',
        richDescription:
          '<p>Organic Beifeng Mushroom broadens the Huilin fresh offering with a line positioned between mainstream edible mushrooms and higher-value premium specialties.</p><p>The supplier brochure lists the product at CNY 30 per kilogram and describes a tender yet springy texture with a sweet crisp bite that can support both wholesale fresh distribution and more premium retail presentation.</p><p>It is a practical mid-tier mushroom line for buyers wanting visible pricing and a differentiated texture profile without moving all the way into morel-level pricing.</p>',
        priceMin: '30.00',
        priceMax: '30.00',
        totalStock: 1680,
        specsJson: {
          productForm: 'Fresh organic mushroom',
          originBase: 'Muyang Village, Aziying, Panlong District, Kunming',
          referencePrice: 'CNY 30/kg',
          productTraits: 'Tender, springy texture with a sweet crisp bite'
        },
        seoTitle: 'Organic Beifeng Mushroom Supplier Program',
        seoDescription: 'Fresh organic beifeng mushroom line from Kunming with a published brochure price for wholesale and premium retail buyers.',
        coverImageUrl: commonsImage('Steinpilz_2006_08_3.jpg')
      },
      {
        slug: 'organic-grey-tiger-paw-mushroom',
        name: 'Organic Grey Tiger Paw Mushroom',
        model: 'HL-FRESH-GTP-1KG',
        summary: 'Fresh organic grey tiger paw mushrooms with grade-based brochure pricing for buyers seeking a thicker, premium-texture Yunnan fungi line.',
        description: 'A fresh grey tiger paw mushroom program from Huilin with Grade I and Grade II pricing published for commercial review.',
        richDescription:
          '<p>Organic Grey Tiger Paw Mushroom is one of the thicker-textured fresh mushroom lines in the Huilin brochure, suitable for buyers who need a more premium mouthfeel and stronger specialty positioning.</p><p>The supplier lists Grade I at CNY 40 per kilogram and Grade II at CNY 30 per kilogram, while describing a crisp, thick, fine-textured bite that distinguishes it from standard fresh mushroom programs.</p><p>That makes it a useful product for specialty retail, ingredient buyers, and hospitality programs that want a visible premium step-up within the same supplier portfolio.</p>',
        priceMin: '30.00',
        priceMax: '40.00',
        totalStock: 1320,
        specsJson: {
          productForm: 'Fresh organic mushroom',
          availableGrades: 'Grade I / Grade II',
          referencePrice: 'CNY 40/kg grade I; CNY 30/kg grade II',
          productTraits: 'Thick, crisp texture with a refined bite'
        },
        seoTitle: 'Organic Grey Tiger Paw Mushroom Supplier Program',
        seoDescription: 'Fresh organic grey tiger paw mushroom with grade-based brochure pricing for specialty retail and ingredient buyers.',
        coverImageUrl: commonsImage('Boletus_edulis_11.jpg')
      },
      {
        slug: 'dried-organic-oyster-mushroom',
        name: 'Dried Organic Oyster Mushroom',
        model: 'HL-DRIED-OST-1KG',
        summary: 'Dried organic oyster mushrooms from Huilin prepared for ingredient buyers, pantry programs, and packaged-food sourcing with a published brochure price.',
        description: 'A dried organic oyster mushroom line from Yunnan Huilin for ingredient and shelf-stable distribution programs.',
        richDescription:
          '<p>Dried Organic Oyster Mushroom translates one of Huilin&apos;s most accessible fresh products into a shelf-stable ingredient line that is easier to move through export and retail channels.</p><p>The brochure lists the dried format at CNY 45 per kilogram while retaining the same meaty texture and familiar appeal that make oyster mushroom a straightforward entry line for buyers.</p><p>It is positioned on the platform for ingredient import, pantry formats, and foodservice buyers wanting a lower-complexity dried mushroom starting point.</p>',
        priceMin: '45.00',
        priceMax: '45.00',
        totalStock: 1900,
        specsJson: {
          productForm: 'Dried organic mushroom',
          originBase: 'Muyang Village, Aziying, Panlong District, Kunming',
          referencePrice: 'CNY 45/kg',
          productTraits: 'Meaty texture in a shelf-stable dried format'
        },
        seoTitle: 'Dried Organic Oyster Mushroom Supplier Program',
        seoDescription: 'Dried organic oyster mushroom from Kunming with a published brochure price for ingredient and pantry buyers.',
        coverImageUrl: commonsImage('Boletus_edulis_11.jpg')
      },
      {
        slug: 'dried-organic-elm-yellow-mushroom',
        name: 'Dried Organic Elm Yellow Mushroom',
        model: 'HL-DRIED-EYM-1KG',
        summary: 'Dried organic elm yellow mushrooms for ingredient, retail, and pantry channels with an aromatic profile and published brochure price.',
        description: 'A dried elm yellow mushroom line from Huilin for buyers wanting a more aromatic shelf-stable mushroom format.',
        richDescription:
          '<p>Dried Organic Elm Yellow Mushroom extends the shelf-stable Huilin range with a line that retains the aromatic identity of the fresh product while simplifying export handling.</p><p>The supplier brochure lists the dried line at CNY 85 per kilogram and positions it as a high-nutrition, low-calorie mushroom suited to ingredient and pantry formats.</p><p>For buyers, it offers a stronger aromatic profile than a dried oyster line while still remaining commercially approachable.</p>',
        priceMin: '85.00',
        priceMax: '85.00',
        totalStock: 1280,
        specsJson: {
          productForm: 'Dried organic mushroom',
          originBase: 'Muyang Village, Aziying, Panlong District, Kunming',
          referencePrice: 'CNY 85/kg',
          productTraits: 'Aromatic shelf-stable mushroom with a tender bite after rehydration'
        },
        seoTitle: 'Dried Organic Elm Yellow Mushroom Supplier Program',
        seoDescription: 'Dried organic elm yellow mushroom with a published brochure price for ingredient and pantry sourcing.',
        coverImageUrl: commonsImage('Steinpilz_2006_08_3.jpg')
      },
      {
        slug: 'dried-organic-yunjizong-mushroom',
        name: 'Dried Organic Yunjizong Mushroom',
        model: 'HL-DRIED-YJZ-1KG',
        summary: 'Dried organic yunjizong mushrooms aimed at premium ingredient, gifting, and specialty pantry channels with a high-value brochure price.',
        description: 'A premium dried yunjizong line from Huilin for buyers seeking higher-value Yunnan mushroom products in shelf-stable form.',
        richDescription:
          '<p>Dried Organic Yunjizong Mushroom is positioned as one of the more premium shelf-stable lines in the Huilin brochure.</p><p>The product is listed at CNY 260 per kilogram and is presented for buyers who need stronger product differentiation, premium ingredient positioning, and easier storage than a chilled fresh line.</p><p>It is suitable for specialty ingredient sourcing, curated retail programs, and gift-oriented food assortments built around Yunnan fungi.</p>',
        priceMin: '260.00',
        priceMax: '260.00',
        totalStock: 760,
        specsJson: {
          productForm: 'Dried organic mushroom',
          originBase: 'Muyang Village, Aziying, Panlong District, Kunming',
          referencePrice: 'CNY 260/kg',
          productTraits: 'Premium shelf-stable line with sweet aromatic notes'
        },
        seoTitle: 'Dried Organic Yunjizong Mushroom Supplier Program',
        seoDescription: 'Dried organic yunjizong mushroom with a published brochure price for premium ingredient and specialty retail buyers.',
        coverImageUrl: commonsImage('Boletus_edulis_11.jpg')
      },
      {
        slug: 'dried-organic-red-pine-mushroom',
        name: 'Dried Organic Red Pine Mushroom',
        model: 'HL-DRIED-RPM-1KG',
        summary: 'Dried organic red pine mushrooms with a published brochure price for ingredient sourcing, pantry formats, and premium retail programs.',
        description: 'A dried organic red pine mushroom line from Huilin for buyers seeking a firm, aromatic Yunnan fungi product in shelf-stable form.',
        richDescription:
          '<p>Dried Organic Red Pine Mushroom converts one of Huilin&apos;s graded fresh lines into a more transport-friendly dried ingredient format.</p><p>The supplier brochure lists the dried line at CNY 210 per kilogram and emphasizes the same clean aroma and firm texture profile that make red pine mushroom attractive in more premium applications.</p><p>That gives buyers a shelf-stable route into the same mushroom family without relying on fresh-cold-chain execution.</p>',
        priceMin: '210.00',
        priceMax: '210.00',
        totalStock: 940,
        specsJson: {
          productForm: 'Dried organic mushroom',
          originBase: 'Muyang Village, Aziying, Panlong District, Kunming',
          referencePrice: 'CNY 210/kg',
          productTraits: 'Firm aromatic dried format for premium ingredient use'
        },
        seoTitle: 'Dried Organic Red Pine Mushroom Supplier Program',
        seoDescription: 'Dried organic red pine mushroom with a published brochure price for ingredient and premium retail buyers.',
        coverImageUrl: commonsImage('Steinpilz_2006_08_3.jpg')
      },
      {
        slug: 'dried-organic-beifeng-mushroom',
        name: 'Dried Organic Beifeng Mushroom',
        model: 'HL-DRIED-BFM-1KG',
        summary: 'Dried organic beifeng mushrooms presented for ingredient and retail programs with a mid-tier brochure price and a sweet crisp flavor profile.',
        description: 'A dried beifeng mushroom line from Huilin for shelf-stable ingredient distribution and curated pantry ranges.',
        richDescription:
          '<p>Dried Organic Beifeng Mushroom is positioned as a commercially approachable dried line that still offers a distinct texture and flavor profile.</p><p>The brochure lists the product at CNY 120 per kilogram and describes a sweet crisp bite supported by high amino-acid content, making it suitable for both ingredient sourcing and consumer pantry formats.</p><p>On the platform, it works as a mid-range dried Yunnan mushroom line with visible pricing and clear origin context.</p>',
        priceMin: '120.00',
        priceMax: '120.00',
        totalStock: 1100,
        specsJson: {
          productForm: 'Dried organic mushroom',
          originBase: 'Muyang Village, Aziying, Panlong District, Kunming',
          referencePrice: 'CNY 120/kg',
          productTraits: 'Mid-tier dried line with a sweet crisp flavor profile'
        },
        seoTitle: 'Dried Organic Beifeng Mushroom Supplier Program',
        seoDescription: 'Dried organic beifeng mushroom with a published brochure price for ingredient and pantry buyers.',
        coverImageUrl: commonsImage('Boletus_edulis_11.jpg')
      },
      {
        slug: 'dried-organic-grey-tiger-paw-mushroom',
        name: 'Dried Organic Grey Tiger Paw Mushroom',
        model: 'HL-DRIED-GTP-1KG',
        summary: 'Dried organic grey tiger paw mushrooms prepared for specialty ingredient and premium pantry programs with a published brochure price.',
        description: 'A dried grey tiger paw mushroom line from Huilin for buyers needing a more premium-texture shelf-stable fungi product.',
        richDescription:
          '<p>Dried Organic Grey Tiger Paw Mushroom keeps the premium positioning of the fresh line while making it easier to handle in export, pantry, and ingredient channels.</p><p>The supplier brochure lists the dried product at CNY 130 per kilogram and highlights its thicker texture and richer nutritional profile compared with more standard mushroom formats.</p><p>That gives specialty ingredient buyers a shelf-stable line with clearer premium cues than everyday dried mushrooms.</p>',
        priceMin: '130.00',
        priceMax: '130.00',
        totalStock: 860,
        specsJson: {
          productForm: 'Dried organic mushroom',
          originBase: 'Muyang Village, Aziying, Panlong District, Kunming',
          referencePrice: 'CNY 130/kg',
          productTraits: 'Premium-texture dried line for specialty buyers'
        },
        seoTitle: 'Dried Organic Grey Tiger Paw Mushroom Supplier Program',
        seoDescription: 'Dried organic grey tiger paw mushroom with a published brochure price for specialty ingredient sourcing.',
        coverImageUrl: commonsImage('Steinpilz_2006_08_3.jpg')
      },
      {
        slug: 'dried-organic-morel-mushroom',
        name: 'Dried Organic Morel Mushroom',
        model: 'HL-DRIED-MOR-1KG',
        summary: 'Dried organic morels positioned for premium ingredient, gifting, and specialty pantry channels with grade-based brochure pricing.',
        description: 'A premium dried morel line from Huilin with brochure pricing published by grade for higher-value commercial review.',
        richDescription:
          '<p>Dried Organic Morel Mushroom is one of the highest-value shelf-stable lines in the Huilin brochure, aimed at buyers who need a premium Yunnan mushroom offer without a fresh-chain dependency.</p><p>The supplier lists CNY 820 per kilogram for 5-7 grade and CNY 580 per kilogram for 3-5 grade, giving buyers a clearer commercial basis for premium dried morel sourcing.</p><p>it is suitable for specialty ingredient import, gifting, and curated premium retail programs where grade and quality perception matter.</p>',
        priceMin: '580.00',
        priceMax: '820.00',
        totalStock: 420,
        specsJson: {
          productForm: 'Dried organic morel',
          availableGrades: '5-7 grade / 3-5 grade',
          referencePrice: 'CNY 820/kg 5-7; CNY 580/kg 3-5',
          targetChannels: 'Premium ingredient, gifting, and specialty pantry'
        },
        seoTitle: 'Dried Organic Morel Mushroom Supplier Program',
        seoDescription: 'Dried organic morel mushroom with grade-based brochure pricing for premium ingredient and gifting buyers.',
        coverImageUrl: commonsImage('Boletus_edulis_11.jpg')
      },
      {
        slug: 'organic-elm-yellow-retail-box',
        name: 'Organic Elm Yellow Retail Box',
        model: 'HL-RETAIL-EYM-60G',
        summary: 'A 60g organic elm yellow mushroom retail box prepared for supermarket and e-commerce channels with published wholesale and suggested retail pricing.',
        description: 'A direct-order retail elm yellow mushroom pack from Huilin for shelf review, supermarket buyers, and consumer-channel sourcing.',
        richDescription:
          '<p>Organic Elm Yellow Retail Box takes the Huilin mushroom range into a consumer-ready supermarket and e-commerce format.</p><p>The brochure lists a 60g box with a wholesale ex-factory price of CNY 17 and a suggested retail price of CNY 28, with 12-month shelf life guidance for sealed cool storage.</p><p>That makes it a useful entry SKU for buyers who need a ready-made retail product instead of a bulk ingredient line.</p>',
        priceMin: '17.00',
        priceMax: '17.00',
        totalStock: 1400,
        specsJson: {
          packFormat: '60g box',
          shelfLife: '12 months',
          storage: 'Sealed, cool, dark place',
          suggestedRetailPrice: 'CNY 28'
        },
        seoTitle: 'Organic Elm Yellow Retail Box Direct Order Program',
        seoDescription: '60g organic elm yellow retail box with published wholesale and suggested retail pricing for supermarket and e-commerce channels.',
        coverImageUrl: commonsImage('Steinpilz_2006_08_3.jpg')
      },
      {
        slug: 'organic-grey-tiger-paw-retail-box',
        name: 'Organic Grey Tiger Paw Retail Box',
        model: 'HL-RETAIL-GTP-60G',
        summary: 'A 60g organic grey tiger paw retail box prepared for premium supermarket, e-commerce, and shelf-ready gifting channels.',
        description: 'A direct-order retail tiger paw mushroom pack from Huilin with published wholesale and suggested retail pricing.',
        richDescription:
          '<p>Organic Grey Tiger Paw Retail Box carries one of Huilin&apos;s more premium-feeling mushroom lines into a compact consumer pack.</p><p>The brochure lists the 60g box at CNY 21 wholesale with a suggested retail price of CNY 35, alongside 12-month shelf-life guidance for sealed storage in a cool, dark place.</p><p>This product is intended for buyers evaluating premium retail assortment depth rather than only bulk mushroom supply.</p>',
        priceMin: '21.00',
        priceMax: '21.00',
        totalStock: 960,
        specsJson: {
          packFormat: '60g box',
          shelfLife: '12 months',
          storage: 'Sealed, cool, dark place',
          suggestedRetailPrice: 'CNY 35'
        },
        seoTitle: 'Organic Grey Tiger Paw Retail Box Direct Order Program',
        seoDescription: '60g organic grey tiger paw retail box with published wholesale and suggested retail pricing.',
        coverImageUrl: commonsImage('Boletus_edulis_11.jpg')
      },
      {
        slug: 'organic-beifeng-retail-box',
        name: 'Organic Beifeng Retail Box',
        model: 'HL-RETAIL-BFM-60G',
        summary: 'A 60g organic beifeng retail box for supermarket and e-commerce channels with published wholesale and suggested retail pricing.',
        description: 'A direct-order retail beifeng mushroom line from Huilin for buyers seeking a mid-tier packaged mushroom SKU.',
        richDescription:
          '<p>Organic Beifeng Retail Box gives buyers a consumer-ready format for one of Huilin&apos;s mid-range specialty mushrooms.</p><p>The brochure lists a 60g box at CNY 21 wholesale and CNY 35 suggested retail, with sealed cool-storage guidance and a 12-month shelf life.</p><p>It is suited to supermarket, e-commerce, and pantry-oriented retail programs that need an approachable but differentiated mushroom SKU.</p>',
        priceMin: '21.00',
        priceMax: '21.00',
        totalStock: 1180,
        specsJson: {
          packFormat: '60g box',
          shelfLife: '12 months',
          storage: 'Sealed, cool, dark place',
          suggestedRetailPrice: 'CNY 35'
        },
        seoTitle: 'Organic Beifeng Retail Box Direct Order Program',
        seoDescription: '60g organic beifeng retail box with published wholesale and suggested retail pricing for retail channels.',
        coverImageUrl: commonsImage('Steinpilz_2006_08_3.jpg')
      },
      {
        slug: 'organic-red-pine-retail-box',
        name: 'Organic Red Pine Retail Box',
        model: 'HL-RETAIL-RPM-60G',
        summary: 'A 60g organic red pine retail box for packaged retail, gifting, and e-commerce programs with published wholesale and suggested retail pricing.',
        description: 'A direct-order retail red pine mushroom pack from Huilin for buyers wanting a firmer-texture premium packaged SKU.',
        richDescription:
          '<p>Organic Red Pine Retail Box takes one of Huilin&apos;s more premium mushroom types into a shelf-ready packaged product.</p><p>The brochure lists the 60g box at CNY 27 wholesale and CNY 40 suggested retail, with 12-month shelf-life guidance and sealed cool storage conditions.</p><p>This makes it suitable for buyers developing premium retail ranges, seasonal gifting, or more curated consumer mushroom assortments.</p>',
        priceMin: '27.00',
        priceMax: '27.00',
        totalStock: 880,
        specsJson: {
          packFormat: '60g box',
          shelfLife: '12 months',
          storage: 'Sealed, cool, dark place',
          suggestedRetailPrice: 'CNY 40'
        },
        seoTitle: 'Organic Red Pine Retail Box Direct Order Program',
        seoDescription: '60g organic red pine retail box with published wholesale and suggested retail pricing for premium retail channels.',
        coverImageUrl: commonsImage('Boletus_edulis_11.jpg')
      },
      {
        slug: 'organic-yunjizong-retail-box',
        name: 'Organic Yunjizong Retail Box',
        model: 'HL-RETAIL-YJZ-60G',
        summary: 'A 60g organic yunjizong retail box positioned for premium retail and gifting programs with published wholesale and suggested retail pricing.',
        description: 'A direct-order yunjizong retail pack from Huilin for buyers needing a more premium packaged mushroom SKU.',
        richDescription:
          '<p>Organic Yunjizong Retail Box translates a higher-value mushroom type into a consumer-ready packaged product.</p><p>The Huilin brochure lists the 60g box at CNY 32 wholesale and CNY 50 suggested retail, with sealed cool-storage handling and a published 12-month shelf life.</p><p>For the platform, it is one of the more premium packaged SKUs in the Huilin retail range.</p>',
        priceMin: '32.00',
        priceMax: '32.00',
        totalStock: 760,
        specsJson: {
          packFormat: '60g box',
          shelfLife: '12 months',
          storage: 'Sealed, cool, dark place',
          suggestedRetailPrice: 'CNY 50'
        },
        seoTitle: 'Organic Yunjizong Retail Box Direct Order Program',
        seoDescription: '60g organic yunjizong retail box with published wholesale and suggested retail pricing.',
        coverImageUrl: commonsImage('Steinpilz_2006_08_3.jpg')
      },
      {
        slug: 'organic-white-matsutake-retail-box',
        name: 'Organic White Matsutake Retail Box',
        model: 'HL-RETAIL-WMT-60G',
        summary: 'A 60g organic white matsutake retail box for premium retail and gifting channels with published wholesale and suggested retail pricing.',
        description: 'A direct-order white matsutake retail pack from Huilin for higher-end consumer mushroom assortments.',
        richDescription:
          '<p>Organic White Matsutake Retail Box adds a premium consumer-facing SKU to the Huilin packaged mushroom range.</p><p>The brochure lists the 60g box at CNY 29 wholesale and CNY 60 suggested retail, putting it among the higher-priced retail SKUs in the current lineup.</p><p>It is suited to more premium retail shelves, gifting assortments, and curated e-commerce mushroom collections.</p>',
        priceMin: '29.00',
        priceMax: '29.00',
        totalStock: 620,
        specsJson: {
          packFormat: '60g box',
          shelfLife: '12 months',
          storage: 'Sealed, cool, dark place',
          suggestedRetailPrice: 'CNY 60'
        },
        seoTitle: 'Organic White Matsutake Retail Box Direct Order Program',
        seoDescription: '60g organic white matsutake retail box with published wholesale and suggested retail pricing.',
        coverImageUrl: commonsImage('Boletus_edulis_11.jpg')
      },
      {
        slug: 'organic-dried-mushroom-soup-pack',
        name: 'Organic Dried Mushroom Soup Pack',
        model: 'HL-RETAIL-SOUP-60G',
        summary: 'A 60g organic dried mushroom soup pack prepared for supermarket, pantry, and e-commerce channels with published wholesale and suggested retail pricing.',
        description: 'A direct-order dried soup pack from Huilin for consumer retail channels that want a convenient mushroom-based meal accessory SKU.',
        richDescription:
          '<p>Organic Dried Mushroom Soup Pack packages the Huilin mushroom range into a more convenient retail-ready soup format.</p><p>The supplier brochure lists the 60g box at CNY 20 wholesale with a suggested retail price of CNY 30, plus 12-month shelf-life guidance for sealed cool storage.</p><p>This gives buyers a packaged pantry SKU that can complement the single-mushroom retail boxes with a more usage-driven consumer proposition.</p>',
        priceMin: '20.00',
        priceMax: '20.00',
        totalStock: 1540,
        specsJson: {
          packFormat: '60g box',
          shelfLife: '12 months',
          storage: 'Sealed, cool, dark place',
          suggestedRetailPrice: 'CNY 30'
        },
        seoTitle: 'Organic Dried Mushroom Soup Pack Direct Order Program',
        seoDescription: '60g organic dried mushroom soup pack with published wholesale and suggested retail pricing.',
        coverImageUrl: commonsImage('Steinpilz_2006_08_3.jpg')
      },
      {
        slug: 'organic-seasonal-fresh-mushroom-soup-pack',
        name: 'Organic Seasonal Fresh Mushroom Soup Pack',
        model: 'HL-RETAIL-FRESH-SOUP-1KG',
        summary: 'A seasonal 1kg fresh mushroom soup pack shipped in foam box and ice bag format for premium fresh retail and gifting programs with published wholesale pricing.',
        description: 'A direct-order seasonal fresh mushroom soup pack from Huilin for buyers evaluating chilled consumer packs and seasonal fresh gifting formats.',
        richDescription:
          '<p>Organic Seasonal Fresh Mushroom Soup Pack is the most perishable consumer-format item in the Huilin brochure, built around seasonal fresh mushroom assortment rather than dried shelf-stable ingredients.</p><p>The published format is a 1kg foam box with ice bag at CNY 120 wholesale and CNY 188 suggested retail, with storage guidance of 1-2 days at ambient temperature or 3-5 days chilled.</p><p>The brochure also notes a MOQ of 100 boxes, making the line better suited to organized retail, seasonal campaigns, and premium gifting programs than to ad hoc sampling.</p>',
        priceMin: '120.00',
        priceMax: '120.00',
        totalStock: 540,
        specsJson: {
          packFormat: '1kg foam box with ice bag',
          storageWindow: '1-2 days ambient / 3-5 days chilled',
          suggestedRetailPrice: 'CNY 188',
          minOrderQty: '100 boxes'
        },
        seoTitle: 'Organic Seasonal Fresh Mushroom Soup Pack Direct Order Program',
        seoDescription: 'Seasonal 1kg fresh mushroom soup pack with published wholesale and suggested retail pricing for premium fresh retail programs.',
        coverImageUrl: commonsImage('Boletus_edulis_11.jpg')
      }
    ].map((line, index) =>
      upsertProductLine({
        supplierId: yunnanSupplier.id,
        categoryId: fungiCategory.id,
        brand: 'Huilin Organic',
        tradeMode: TradeMode.DIRECT_PURCHASE,
        currency: 'CNY',
        hasVariants: false,
        publishedAt: minutesEarlier(now, 4 + index),
        ...line
      })
    )
  );

  const westLakeLongjing = await upsertProductLine({
    supplierId: westLakeSupplier.id,
    categoryId: teaCategory.id,
    slug: 'west-lake-longjing-tea',
    name: 'West Lake Longjing Tea',
    brand: 'West Lake Reserve',
    model: 'WLT-SPRING-250',
    summary: 'Pre-Qingming spring-picked West Lake Longjing tea from Meijiawu, Hangzhou. Premium leaf grade, available in 250 g nitrogen-flushed tin or 1 kg foodservice pouch. Direct-order with published pricing for retail, hospitality, and gifting.',
    description: 'Origin-verified Longjing (Dragon Well) green tea from the West Lake core production area. Spring harvest, pan-fired, flat-pressed. Direct-order line with two commercial formats.',
    richDescription:
      '<p>West Lake Longjing is China&apos;s most recognized green tea, protected by geographical indication and defined by four characteristics: flat, smooth leaves; pale green-yellow liquor; chestnut-like aroma; and a clean, lingering sweetness. This program sources from tea gardens in Meijiawu village, within the designated West Lake core production zone in Hangzhou.</p><p>Leaves are hand-picked during the pre-Qingming spring window, when amino acid concentration is highest and astringency lowest. Processing follows traditional pan-firing and flat-pressing technique. The finished leaf is graded as premium spring grade.</p><p>Two commercial formats are available: a 250 g nitrogen-flushed tin at USD 72 and a 1 kg foodservice pouch at USD 118. Both are direct-order products with published reference pricing, origin documentation, and sample availability for qualified buyers.</p>',
    tradeMode: TradeMode.DIRECT_PURCHASE,
    priceMin: '72.00',
    priceMax: '118.00',
    hasVariants: true,
    totalStock: 520,
    specsJson: {
      originEstate: 'Meijiawu, Hangzhou',
      harvestSeason: 'Pre-Qingming spring lot',
      packFormats: ['250g nitrogen-flushed tin', '1kg foodservice pouch'],
      grade: 'Premium spring leaf'
    },
    seoTitle: 'West Lake Longjing Tea Direct Order Program',
    seoDescription: 'Origin-led West Lake Longjing tea program with premium gifting, retail, and hospitality pack formats.',
    coverImageUrl: commonsImage('Longjing_Tea_field,_Dragon_Well_area,_Meijiawu_China.jpg'),
    publishedAt: minutesEarlier(now, 2)
  });

  const freshJiaobai = await upsertProductLine({
    supplierId: jiangnanSupplier.id,
    categoryId: vegetablesCategory.id,
    slug: 'fresh-jiaobai-stems',
    name: 'Fresh Jiaobai Stems',
    brand: 'Jiangnan Fresh',
    model: 'JFE-JIAOBAI-5KG',
    summary: 'Fresh water bamboo shoots (Jiaobai) from Suzhou and Huzhou waterfield bases. Seasonal harvest, pre-cooled within 6 hours. Packed in 5 kg chilled cartons for specialty retail, Asian produce distribution, and premium menu use.',
    description: 'Zizania latifolia stems — a seasonal aquatic vegetable cultivated in the lower Yangtze region. Delicate texture, mild sweetness. Pre-cooled and packed for chilled export within harvest window.',
    richDescription:
      '<p>Jiaobai (Zizania latifolia), also known as water bamboo or wild rice stem, is a traditional Jiangnan-region vegetable with a mild, slightly sweet flavor and a crisp-tender texture prized in Chinese and pan-Asian cuisine. Cultivation takes place in managed waterfields around Suzhou and Huzhou, where controlled flooding supports the swollen stem formation that defines commercial-grade Jiaobai.</p><p>Harvest is seasonal. Stems are pre-cooled to below 4°C within six hours of cutting to preserve texture and prevent oxidation. Standard export format is a 5 kg chilled carton with perforated lining for humidity control. Retail tray-pack options are also available for destination-market repacking.</p><p>Buyers typically confirm harvest window, pre-cooling protocol, carton configuration, and destination cold-chain routing before first shipment. This is an inquiry-led product — each order is structured around the buyer&apos;s market window and transit time requirements.</p>',
    tradeMode: TradeMode.INQUIRY_ONLY,
    priceMin: '2.80',
    priceMax: '4.50',
    hasVariants: false,
    totalStock: 2800,
    specsJson: {
      originRegion: 'Suzhou and Huzhou waterfield bases',
      harvestWindow: 'Seasonal fresh harvest',
      packFormats: ['5kg chilled carton', 'Retail tray pack'],
      coldChain: 'Pre-cooling within 6 hours of harvest'
    },
    seoTitle: 'Fresh Jiaobai Export Program',
    seoDescription: 'Fresh Jiaobai stems prepared for chilled export, specialty retail, and premium menu development.',
    coverImageUrl: commonsImage('Zizania_latifolia_in_cultivation.jpg'),
    publishedAt: minutesEarlier(now, 3)
  });

  const greenAsparagus = await upsertProductLine({
    supplierId: greenShootsSupplier.id,
    categoryId: vegetablesCategory.id,
    slug: 'green-asparagus-spears',
    name: 'Green Asparagus Spears',
    brand: 'Green Shoots',
    model: 'GSP-ASP-11LB',
    summary: 'Straight green asparagus spears from Shandong coastal bases. Hydro-cooled, sized 16–22 mm, packed in 11 lb export cartons. Suitable for chilled retail, foodservice, and fresh-produce import programs with reefer logistics support.',
    description: 'Fresh green asparagus (Asparagus officinalis) for chilled export, retail distribution, and foodservice supply. Grown in Shandong greenhouse and field operations with post-harvest hydro-cooling within 4 hours.',
    richDescription:
      '<p>Green asparagus from Shandong coastal operations is grown under greenhouse and open-field protocols that prioritize spear straightness, tip tightness, and uniform sizing. Post-harvest, spears are hydro-cooled to remove field heat, graded to 16–22 mm diameter, and packed into standard 11 lb export cartons with moisture-retention lining.</p><p>The line is supported by reefer-container logistics planning, with departure from Qingdao or Shanghai ports depending on destination and shipping schedule. Buyers receive packing specifications, cold-chain temperature logs, and phytosanitary documentation as part of the export file.</p><p>Common commercial discussion points include sizing tolerance, pack configuration, departure scheduling, destination inspection requirements, and volume commitments. The program is positioned as an inquiry-led line so that market-specific parameters are confirmed before first shipment.</p>',
    tradeMode: TradeMode.INQUIRY_ONLY,
    priceMin: '3.20',
    priceMax: '5.80',
    hasVariants: false,
    totalStock: 4600,
    specsJson: {
      originRegion: 'Shandong coastal greenhouse and field bases',
      sizing: '16-22 mm',
      packFormats: ['11lb export carton', 'Retail bundle'],
      coldChain: 'Hydro-cooling and reefer export support'
    },
    seoTitle: 'Green Asparagus Export Program',
    seoDescription: 'Green asparagus export line for chilled retail, foodservice distribution, and fresh-produce import programs.',
    coverImageUrl: commonsImage('Green_Asparagus_New_York_11_May_2006.jpg'),
    publishedAt: minutesEarlier(now, 4)
  });

  const halalReadyMeal = await upsertProductLine({
    supplierId: eurasiaSupplier.id,
    categoryId: halalCategory.id,
    slug: 'halal-curry-chicken-ready-meal',
    name: 'Halal Curry Chicken Ready Meal',
    brand: 'Eurasia Halal',
    model: 'EHF-CURRY-320',
    summary: 'Halal-certified curry chicken ready meal. 320 g tray, 12-month ambient shelf life. Two case-pack formats: 12 × 320 g (export) and 24 × 250 g (retail shelf). Private-label and bilingual labeling support available.',
    description: 'A direct-order halal prepared food line from Dezhou, Shandong. Certified production line. Suitable for Gulf retail, Southeast Asian distribution, airline catering, and institutional foodservice.',
    richDescription:
      '<p>This halal-certified curry chicken ready meal is produced on a dedicated halal line in Dezhou, Shandong — a city with established halal food processing capability serving both domestic and export markets. The product is formulated for ambient shelf stability (12 months), making it suitable for containerized export without cold-chain dependency.</p><p>Two commercial case-pack options are published: a 12 × 320 g export case at USD 46 and a 24 × 250 g retail shelf case at USD 52. Both formats support bilingual (English/Arabic) labeling. The product can be supplied under the Eurasia Halal brand or developed as a private-label SKU subject to volume and market discussion.</p><p>Export documentation includes halal certification, certificate of origin, health certificate, packing list, and commercial invoice. Buyers typically confirm case-pack selection, labeling language, private-label scope, and destination regulatory review before first order.</p>',
    tradeMode: TradeMode.DIRECT_PURCHASE,
    priceMin: '46.00',
    priceMax: '52.00',
    hasVariants: true,
    totalStock: 1540,
    specsJson: {
      halalCertification: 'Halal production line available',
      casePack: '12 x 320g trays',
      shelfLife: '12 months ambient',
      exportSupport: 'Label review, customs file, and pallet planning'
    },
    seoTitle: 'Halal Curry Chicken Ready Meal Export Program',
    seoDescription: 'Halal curry chicken ready meal export line with direct-order pack formats, labeling support, and delivery coordination.',
    coverImageUrl: commonsImage('Aesthetic_Chicken_Curry.jpg'),
    publishedAt: minutesEarlier(now, 5)
  });

  await prisma.productImage.deleteMany({
    where: {
      productId: {
        in: [
          chineseMittenCrab.id,
          organicOysterMushroom.id,
          organicMorelMushroom.id,
          organicMorelRetailBox.id,
          westLakeLongjing.id,
          freshJiaobai.id,
          greenAsparagus.id,
          halalReadyMeal.id
        ]
      }
    }
  });

  await prisma.productImage.createMany({
    data: [
      {
        productId: chineseMittenCrab.id,
        url: commonsImage('HK SW 上環 Sheung Wan 永樂街 120 Wing Lok Street shop 成隆行 Shing Lung Hong 大閘蟹 live Chinese mitten crabs water tank December 2021 SS2 03.jpg'),
        altText: 'Live Chinese mitten crab export presentation image',
        type: ProductImageType.MAIN,
        sortOrder: 0,
        isPrimary: true
      },
      {
        productId: chineseMittenCrab.id,
        url: commonsImage('阳澄湖大闸蟹 生 蒸前.jpg'),
        altText: 'Chinese mitten crab live product detail before steaming',
        type: ProductImageType.DETAIL,
        sortOrder: 1,
        isPrimary: false
      },
      {
        productId: westLakeLongjing.id,
        url: commonsImage('Longjing_Tea_field,_Dragon_Well_area,_Meijiawu_China.jpg'),
        altText: 'West Lake Longjing tea origin field view',
        type: ProductImageType.MAIN,
        sortOrder: 0,
        isPrimary: true
      },
      {
        productId: westLakeLongjing.id,
        url: commonsImage('Longjing_tea_17.jpg'),
        altText: 'West Lake Longjing tea leaf presentation',
        type: ProductImageType.DETAIL,
        sortOrder: 1,
        isPrimary: false
      },
      {
        productId: freshJiaobai.id,
        url: commonsImage('Zizania_latifolia_in_cultivation.jpg'),
        altText: 'Fresh Jiaobai stems export presentation image',
        type: ProductImageType.MAIN,
        sortOrder: 0,
        isPrimary: true
      },
      {
        productId: freshJiaobai.id,
        url: commonsImage('Wild_rice_stems.jpg'),
        altText: 'Fresh Jiaobai harvest and product detail',
        type: ProductImageType.DETAIL,
        sortOrder: 1,
        isPrimary: false
      },
      {
        productId: greenAsparagus.id,
        url: commonsImage('Green_Asparagus_New_York_11_May_2006.jpg'),
        altText: 'Green asparagus spears export presentation image',
        type: ProductImageType.MAIN,
        sortOrder: 0,
        isPrimary: true
      },
      {
        productId: greenAsparagus.id,
        url: commonsImage('Asparagus_Tip.jpg'),
        altText: 'Green asparagus premium tip detail',
        type: ProductImageType.DETAIL,
        sortOrder: 1,
        isPrimary: false
      },
      {
        productId: halalReadyMeal.id,
        url: commonsImage('Aesthetic_Chicken_Curry.jpg'),
        altText: 'Halal curry chicken ready meal export presentation image',
        type: ProductImageType.MAIN,
        sortOrder: 0,
        isPrimary: true
      },
      {
        productId: halalReadyMeal.id,
        url: commonsImage('IndianChickenCurry.jpg'),
        altText: 'Halal curry chicken prepared meal serving detail',
        type: ProductImageType.DETAIL,
        sortOrder: 1,
        isPrimary: false
      }
    ]
  });

  const teaRetailVariant = await prisma.productVariant.upsert({
    where: { sku: 'WLT-SPRING-250G-TIN' },
    update: {
      productId: westLakeLongjing.id,
      optionValues: {
        packaging: '250g tin',
        grade: 'Premium spring leaf'
      },
      price: '72.00',
      currency: 'USD',
      stockQty: 320,
      weightKg: '0.250',
      imageUrl: commonsImage('Longjing_tea_17.jpg'),
      isActive: true,
      sortOrder: 0
    },
    create: {
      productId: westLakeLongjing.id,
      sku: 'WLT-SPRING-250G-TIN',
      optionValues: {
        packaging: '250g tin',
        grade: 'Premium spring leaf'
      },
      price: '72.00',
      currency: 'USD',
      stockQty: 320,
      weightKg: '0.250',
      imageUrl: commonsImage('Longjing_tea_17.jpg'),
      isActive: true,
      sortOrder: 0
    }
  });

  await prisma.productVariant.upsert({
    where: { sku: 'WLT-SPRING-1KG-POUCH' },
    update: {
      productId: westLakeLongjing.id,
      optionValues: {
        packaging: '1kg pouch',
        grade: 'Foodservice export lot'
      },
      price: '118.00',
      currency: 'USD',
      stockQty: 200,
      weightKg: '1.000',
      imageUrl: commonsImage('Longjing_Tea_field,_Dragon_Well_area,_Meijiawu_China.jpg'),
      isActive: true,
      sortOrder: 1
    },
    create: {
      productId: westLakeLongjing.id,
      sku: 'WLT-SPRING-1KG-POUCH',
      optionValues: {
        packaging: '1kg pouch',
        grade: 'Foodservice export lot'
      },
      price: '118.00',
      currency: 'USD',
      stockQty: 200,
      weightKg: '1.000',
      imageUrl: commonsImage('Longjing_Tea_field,_Dragon_Well_area,_Meijiawu_China.jpg'),
      isActive: true,
      sortOrder: 1
    }
  });

  await prisma.productVariant.upsert({
    where: { sku: 'HL-MOREL-30G-POUCH' },
    update: {
      productId: organicMorelRetailBox.id,
      optionValues: {
        packaging: '30g pouch',
        shelfLife: '12 months'
      },
      price: '31.00',
      currency: 'CNY',
      stockQty: 960,
      weightKg: '0.030',
      imageUrl: commonsImage('Boletus_edulis_11.jpg'),
      isActive: true,
      sortOrder: 0
    },
    create: {
      productId: organicMorelRetailBox.id,
      sku: 'HL-MOREL-30G-POUCH',
      optionValues: {
        packaging: '30g pouch',
        shelfLife: '12 months'
      },
      price: '31.00',
      currency: 'CNY',
      stockQty: 960,
      weightKg: '0.030',
      imageUrl: commonsImage('Boletus_edulis_11.jpg'),
      isActive: true,
      sortOrder: 0
    }
  });

  await prisma.productVariant.upsert({
    where: { sku: 'HL-MOREL-50G-BOX' },
    update: {
      productId: organicMorelRetailBox.id,
      optionValues: {
        packaging: '50g box',
        shelfLife: '12 months'
      },
      price: '48.00',
      currency: 'CNY',
      stockQty: 840,
      weightKg: '0.050',
      imageUrl: commonsImage('Steinpilz_2006_08_3.jpg'),
      isActive: true,
      sortOrder: 1
    },
    create: {
      productId: organicMorelRetailBox.id,
      sku: 'HL-MOREL-50G-BOX',
      optionValues: {
        packaging: '50g box',
        shelfLife: '12 months'
      },
      price: '48.00',
      currency: 'CNY',
      stockQty: 840,
      weightKg: '0.050',
      imageUrl: commonsImage('Steinpilz_2006_08_3.jpg'),
      isActive: true,
      sortOrder: 1
    }
  });

  const halalMealCaseVariant = await prisma.productVariant.upsert({
    where: { sku: 'EHF-CURRY-12X320' },
    update: {
      productId: halalReadyMeal.id,
      optionValues: {
        casePack: '12 x 320g trays',
        label: 'English / Arabic export pack'
      },
      price: '46.00',
      currency: 'USD',
      stockQty: 900,
      weightKg: '3.840',
      imageUrl: commonsImage('Aesthetic_Chicken_Curry.jpg'),
      isActive: true,
      sortOrder: 0
    },
    create: {
      productId: halalReadyMeal.id,
      sku: 'EHF-CURRY-12X320',
      optionValues: {
        casePack: '12 x 320g trays',
        label: 'English / Arabic export pack'
      },
      price: '46.00',
      currency: 'USD',
      stockQty: 900,
      weightKg: '3.840',
      imageUrl: commonsImage('Aesthetic_Chicken_Curry.jpg'),
      isActive: true,
      sortOrder: 0
    }
  });

  await prisma.productVariant.upsert({
    where: { sku: 'EHF-CURRY-24X250' },
    update: {
      productId: halalReadyMeal.id,
      optionValues: {
        casePack: '24 x 250g trays',
        label: 'Retail shelf export pack'
      },
      price: '52.00',
      currency: 'USD',
      stockQty: 640,
      weightKg: '6.000',
      imageUrl: commonsImage('IndianChickenCurry.jpg'),
      isActive: true,
      sortOrder: 1
    },
    create: {
      productId: halalReadyMeal.id,
      sku: 'EHF-CURRY-24X250',
      optionValues: {
        casePack: '24 x 250g trays',
        label: 'Retail shelf export pack'
      },
      price: '52.00',
      currency: 'USD',
      stockQty: 640,
      weightKg: '6.000',
      imageUrl: commonsImage('IndianChickenCurry.jpg'),
      isActive: true,
      sortOrder: 1
    }
  });

  const aboutPage = await prisma.cmsPage.upsert({
    where: {
      slug_locale: {
        slug: 'about',
        locale: 'en'
      }
    },
    update: {
      title: 'How farmetra organizes agricultural sourcing and cross-border sales delivery',
      excerpt:
        'farmetra is organized as a buyer-facing agricultural sales platform, connecting vetted Chinese supply programs with qualification, supplier coordination, and cross-border delivery support.',
      content:
        '<p>farmetra is designed to present vetted Chinese agricultural supply programs in a format suitable for formal buyer meetings, institutional review, and trade-promotion use, rather than as a high-volume generic marketplace.</p><p>The portfolio is organized around clear export families including aquatic products, Yunnan mushrooms, Chinese tea, specialty vegetables, and halal prepared foods, allowing visitors to understand both category breadth and the distinct regional strengths behind each line.</p><p>Each product is paired with origin context, specification highlights, pack formats, and a visible commercial route so buyers can judge not only what the product is, but how it can move from farm or factory into a credible export program.</p><p>Sourcing qualification, customs coordination, documentation handling, cold-chain planning, and buyer inquiry follow-up are treated as part of the same commercial story, helping the platform communicate delivery capability alongside product presentation.</p>',
      status: PageStatus.PUBLISHED,
      seoTitle: 'About farmetra Agricultural Sales Platform',
      seoDescription: 'Overview of farmetra sourcing qualification, supplier coordination, and cross-border agricultural delivery approach.',
      publishedAt: now
    },
    create: {
      slug: 'about',
      locale: 'en',
      title: 'How farmetra organizes agricultural sourcing and cross-border sales delivery',
      excerpt:
        'farmetra is organized as a buyer-facing agricultural sales platform, connecting vetted Chinese supply programs with qualification, supplier coordination, and cross-border delivery support.',
      content:
        '<p>farmetra is designed to present vetted Chinese agricultural supply programs in a format suitable for formal buyer meetings, institutional review, and trade-promotion use, rather than as a high-volume generic marketplace.</p><p>The portfolio is organized around clear export families including aquatic products, Yunnan mushrooms, Chinese tea, specialty vegetables, and halal prepared foods, allowing visitors to understand both category breadth and the distinct regional strengths behind each line.</p><p>Each product is paired with origin context, specification highlights, pack formats, and a visible commercial route so buyers can judge not only what the product is, but how it can move from farm or factory into a credible export program.</p><p>Sourcing qualification, customs coordination, documentation handling, cold-chain planning, and buyer inquiry follow-up are treated as part of the same commercial story, helping the platform communicate delivery capability alongside product presentation.</p>',
      status: PageStatus.PUBLISHED,
      seoTitle: 'About farmetra Agricultural Sales Platform',
      seoDescription: 'Overview of farmetra sourcing qualification, supplier coordination, and cross-border agricultural delivery approach.',
      publishedAt: now
    }
  });

  await prisma.faqItem.deleteMany({
    where: {
      OR: [
        { pageId: aboutPage.id },
        {
          productId: {
            in: [
              chineseMittenCrab.id,
              organicOysterMushroom.id,
              organicMorelMushroom.id,
              organicMorelRetailBox.id,
              westLakeLongjing.id,
              halalReadyMeal.id
            ]
          }
        }
      ]
    }
  });

  await prisma.faqItem.createMany({
    data: [
      {
        question: 'Do you support direct farm sourcing or packhouse coordination?',
        answer:
          'Yes. The platform is built to support direct farm and origin-based sourcing conversations, including harvest planning, packhouse handling, and export readiness review from the early stages of buyer engagement.',
        locale: 'en',
        sortOrder: 1,
        pageId: aboutPage.id,
        isPublished: true
      },
      {
        question: 'Can buyers request customs, cold chain, and export handling support?',
        answer:
          'Yes. Export documentation, customs coordination, cold-chain planning, and destination-market delivery preparation are all part of the service narrative presented for qualified buyer inquiries.',
        locale: 'en',
        sortOrder: 2,
        pageId: aboutPage.id,
        isPublished: true
      },
      {
        question: 'Is the platform structured for trade-promotion and government presentation use?',
        answer:
          'Yes. The catalog, supplier programs, and product presentation are curated to read as a mature agricultural export platform suitable for trade-promotion, delegation meetings, and demonstration use.',
        locale: 'en',
        sortOrder: 3,
        pageId: aboutPage.id,
        isPublished: true
      },
      {
        question: 'Is Chinese Mitten Crab a seasonal program?',
        answer:
          'Yes. The core commercial season is presented from September through December, and buyers normally confirm harvest timing, cold-chain routing, and presentation format through inquiry before final scheduling.',
        locale: 'en',
        sortOrder: 1,
        productId: chineseMittenCrab.id,
        isPublished: true
      },
      {
        question: 'Can the Longjing tea line move directly into sample review or order discussion?',
        answer:
          'Yes. This tea program is published as a direct-order line, with reference pricing, origin detail, and pack options already visible for buyers evaluating samples or opening a first order discussion.',
        locale: 'en',
        sortOrder: 1,
        productId: westLakeLongjing.id,
        isPublished: true
      },
      {
        question: 'Is the oyster mushroom price quoted on fresh bulk weight?',
        answer:
          'Yes. The current supplier brochure presents organic oyster mushrooms at a reference price of CNY 11 per kilogram for the fresh line. Final pack format and route are aligned through inquiry.',
        locale: 'en',
        sortOrder: 1,
        productId: organicOysterMushroom.id,
        isPublished: true
      },
      {
        question: 'How is the organic morel line positioned commercially?',
        answer:
          'The fresh organic morel program is shown as a premium inquiry-led line with a brochure reference range of CNY 125 to 160 per kilogram, suitable for hospitality, gifting, and specialty ingredient sourcing.',
        locale: 'en',
        sortOrder: 1,
        productId: organicMorelMushroom.id,
        isPublished: true
      },
      {
        question: 'What retail formats and MOQ are available for the organic morel packs?',
        answer:
          'The current published retail formats are a 30g pouch at CNY 31 and a 50g box at CNY 48. Both list a 12-month shelf life with sealed cool-storage guidance, and the supplier brochure notes a MOQ of 100 boxes.',
        locale: 'en',
        sortOrder: 1,
        productId: organicMorelRetailBox.id,
        isPublished: true
      },
      {
        question: 'What documentation can be aligned for the halal ready meal line?',
        answer:
          'The line is presented with halal production support, label review, carton configuration, shelf-life visibility, and export document coordination aligned to the destination market.',
        locale: 'en',
        sortOrder: 1,
        productId: halalReadyMeal.id,
        isPublished: true
      }
    ]
  });

  const inquiry = await prisma.inquiry.upsert({
    where: { inquiryNumber: 'INQ-20260519-001' },
    update: {
      productId: chineseMittenCrab.id,
      supplierId: jiangnanSupplier.id,
      buyerUserId: buyerUser.id,
      customerName: 'Amelia Harper',
      customerEmail: 'buyer@nongyechuhai.local',
      customerCompany: 'Harbor Foods Trading',
      customerCountry: 'Singapore',
      quantityRequested: 1200,
      targetPrice: '31.50',
      currency: 'USD',
      requirements:
        'Need a seasonal Chinese mitten crab program for Singapore festive retail, with oxygenated export crates, bilingual labels, and cold-chain transit planning.',
      sourcePageUrl: '/products/chinese-mitten-crab'
    },
    create: {
      inquiryNumber: 'INQ-20260519-001',
      productId: chineseMittenCrab.id,
      supplierId: jiangnanSupplier.id,
      buyerUserId: buyerUser.id,
      customerName: 'Amelia Harper',
      customerEmail: 'buyer@nongyechuhai.local',
      customerPhone: '+65-0000-0000',
      customerCompany: 'Harbor Foods Trading',
      customerCountry: 'Singapore',
      quantityRequested: 1200,
      targetPrice: '31.50',
      currency: 'USD',
      requirements:
        'Need a seasonal Chinese mitten crab program for Singapore festive retail, with oxygenated export crates, bilingual labels, and cold-chain transit planning.',
      sourcePageUrl: '/products/chinese-mitten-crab'
    }
  });

  await prisma.quote.upsert({
    where: { quoteNumber: 'QUO-20260519-001' },
    update: {
      inquiryId: inquiry.id,
      supplierId: jiangnanSupplier.id,
      currency: 'USD',
      totalAmount: '3780.00',
      minOrderQty: 800,
      leadTimeDays: 7,
      validUntil: daysLater(now, 7),
      notes: 'FOB Shanghai. Live oxygenated transport or reefer plan available subject to buyer route confirmation.',
      sentAt: now
    },
    create: {
      quoteNumber: 'QUO-20260519-001',
      inquiryId: inquiry.id,
      supplierId: jiangnanSupplier.id,
      currency: 'USD',
      totalAmount: '3780.00',
      minOrderQty: 800,
      leadTimeDays: 7,
      validUntil: daysLater(now, 7),
      notes: 'FOB Shanghai. Live oxygenated transport or reefer plan available subject to buyer route confirmation.',
      sentAt: now
    }
  });

  const order = await prisma.order.upsert({
    where: { orderNumber: 'ORD-20260519-001' },
    update: {
      buyerUserId: buyerUser.id,
      supplierId: eurasiaSupplier.id,
      currency: 'USD',
      subtotalAmount: '828.00',
      shippingAmount: '120.00',
      taxAmount: '0.00',
      discountAmount: '0.00',
      totalAmount: '948.00',
      customerName: 'Amelia Harper',
      customerEmail: 'buyer@nongyechuhai.local',
      customerPhone: '+971-0000-0000',
      shippingAddressJson: {
        country: 'United Arab Emirates',
        city: 'Dubai',
        addressLine1: 'Dubai South Logistics District'
      },
      notes: 'Direct order for halal prepared meal export — Dubai South Logistics District delivery.',
      placedAt: now
    },
    create: {
      orderNumber: 'ORD-20260519-001',
      buyerUserId: buyerUser.id,
      supplierId: eurasiaSupplier.id,
      currency: 'USD',
      subtotalAmount: '828.00',
      shippingAmount: '120.00',
      taxAmount: '0.00',
      discountAmount: '0.00',
      totalAmount: '948.00',
      customerName: 'Amelia Harper',
      customerEmail: 'buyer@nongyechuhai.local',
      customerPhone: '+971-0000-0000',
      shippingAddressJson: {
        country: 'United Arab Emirates',
        city: 'Dubai',
        addressLine1: 'Dubai South Logistics District'
      },
      notes: 'Direct order for halal prepared meal export — Dubai South Logistics District delivery.',
      placedAt: now
    }
  });

  await prisma.orderItem.deleteMany({
    where: { orderId: order.id }
  });

  await prisma.payment.deleteMany({
    where: { orderId: order.id }
  });

  await prisma.orderItem.create({
    data: {
      orderId: order.id,
      productId: halalReadyMeal.id,
      productVariantId: halalMealCaseVariant.id,
      supplierId: eurasiaSupplier.id,
      productNameSnapshot: 'Halal Curry Chicken Ready Meal',
      skuSnapshot: 'EHF-CURRY-12X320',
      imageUrlSnapshot: commonsImage('Aesthetic_Chicken_Curry.jpg'),
      unitPrice: '46.00',
      quantity: 18,
      lineTotal: '828.00',
      attributesJson: {
        casePack: '12 x 320g trays',
        label: 'English / Arabic export pack'
      }
    }
  });

  await prisma.payment.create({
    data: {
      orderId: order.id,
      provider: PaymentProvider.QUOTE,
      status: PaymentStatus.PENDING,
      amount: '948.00',
      currency: 'USD',
      clientToken: 'mock-payment-token'
    }
  });

  process.stdout.write('Seed completed.\n');
  process.stdout.write('Admin: admin@nongyechuhai.local\n');
  process.stdout.write('Supplier: supplier@nongyechuhai.local\n');
  process.stdout.write('Buyer: buyer@nongyechuhai.local\n');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
