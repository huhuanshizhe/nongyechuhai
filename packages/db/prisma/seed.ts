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
const legacyProductSlugs = ['premium-dried-chili', 'dehydrated-garlic-flakes'];
const legacyCategorySlugs = ['spices-seasonings', 'dehydrated-vegetables'];

function commonsImage(fileName: string) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}`;
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
};

async function upsertProductLine(line: ProductLineSeed) {
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
      currency: 'USD',
      priceMin: line.priceMin,
      priceMax: line.priceMax,
      hasVariants: line.hasVariants,
      totalStock: line.totalStock,
      specsJson: line.specsJson,
      seoTitle: line.seoTitle,
      seoDescription: line.seoDescription,
      coverImageUrl: line.coverImageUrl,
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
      currency: 'USD',
      priceMin: line.priceMin,
      priceMax: line.priceMax,
      hasVariants: line.hasVariants,
      totalStock: line.totalStock,
      specsJson: line.specsJson,
      seoTitle: line.seoTitle,
      seoDescription: line.seoDescription,
      coverImageUrl: line.coverImageUrl,
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
    name: 'Yunnan Highland Harvest Co., Ltd.',
    legalName: 'Yunnan Highland Harvest Co., Ltd.',
    email: 'sales@yunnanhighland.example',
    phone: '+86-871-0000-2780',
    website: 'https://yunnanhighland.example',
    country: 'China',
    city: 'Kunming',
    addressLine1: 'No. 88 Plateau Produce Road',
    postalCode: '650000',
    description:
      'Premium edible fungi sourcing program serving retail, ingredient, and hospitality buyers looking for Yunnan mountain origin stories.',
    contactName: 'Yang Xue',
    contactEmail: 'sales@yunnanhighland.example',
    contactPhone: '+86-871-0000-2780'
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
      description: 'Premium fungi programs from Yunnan for retail, ingredient, hospitality, and high-value specialty distribution.'
    },
    create: {
      parentId: rootCategory.id,
      name: 'Premium Mushrooms',
      slug: 'premium-mushrooms',
      description: 'Premium fungi programs from Yunnan for retail, ingredient, hospitality, and high-value specialty distribution.',
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
    summary: 'A premium seasonal hairy crab program prepared for live export, chilled gifting, and festive retail presentation.',
    description: 'An origin-led aquatic export line for importers, hospitality groups, and premium seasonal retail programs.',
    richDescription:
      '<p>Chinese Mitten Crab is one of the portfolio&apos;s signature seasonal products, positioned for premium festive retail, hospitality gifting, and destination markets that value origin-led aquatic sourcing.</p><p>The program is organized around lower Yangtze breeding resources, live oxygenated shipment planning, chilled gift-box presentation, and the export documentation needed to support a controlled cold-chain journey from farm to overseas arrival.</p><p>Buyers typically begin with harvest timing, target market entry requirements, packaging presentation, and transport format, allowing the commercial discussion to stay grounded in seasonality and delivery realism from the outset.</p>',
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
    coverImageUrl: commonsImage('Gekochte_Wollhandkrabben.jpg'),
    publishedAt: minutesEarlier(now, 0)
  });

  const yunnanBoletus = await upsertProductLine({
    supplierId: yunnanSupplier.id,
    categoryId: fungiCategory.id,
    slug: 'yunnan-wild-boletus',
    name: 'Yunnan Wild Boletus',
    brand: 'Highland Harvest',
    model: 'YHH-BOLETUS-5KG',
    summary: 'A premium Yunnan boletus selection prepared for specialty retail, ingredient sourcing, and hospitality menus.',
    description: 'A wild mushroom export line combining origin story, hand sorting, and handling notes for professional buyers.',
    richDescription:
      '<p>The Yunnan Wild Boletus program presents southwest China&apos;s premium edible fungi resources in a format suited to high-value ingredient distribution, hospitality purchasing, and specialty retail merchandising.</p><p>Rather than reading as a generic mushroom listing, the line is framed around mountain origin, hand grading, pre-cooling, carton presentation, and the practical handling steps buyers need to evaluate freshness and destination-market fit.</p><p>This makes the product particularly effective for presentations where provenance, quality discipline, and the ability to translate regional Chinese ingredients into export-ready supply are central to the story.</p>',
    tradeMode: TradeMode.INQUIRY_ONLY,
    priceMin: '18.00',
    priceMax: '32.00',
    hasVariants: false,
    totalStock: 1600,
    specsJson: {
      originRegion: 'Yunnan mountain collection zones',
      grade: 'Hand-sorted premium caps',
      packFormats: ['5kg export carton', 'Chilled or IQF option'],
      handling: 'Pre-cooling and customs coordination'
    },
    seoTitle: 'Yunnan Wild Boletus Export Program',
    seoDescription: 'Premium Yunnan boletus export line for ingredient, specialty retail, and hospitality sourcing.',
    coverImageUrl: commonsImage('Boletus_edulis_11.jpg'),
    publishedAt: minutesEarlier(now, 1)
  });

  const westLakeLongjing = await upsertProductLine({
    supplierId: westLakeSupplier.id,
    categoryId: teaCategory.id,
    slug: 'west-lake-longjing-tea',
    name: 'West Lake Longjing Tea',
    brand: 'West Lake Reserve',
    model: 'WLT-SPRING-250',
    summary: 'A spring-picked Longjing tea program prepared for premium retail, gifting, hospitality, and cultural presentation.',
    description: 'A direct-order tea line that combines origin recognition, refined pack formats, and premium spring leaf grading.',
    richDescription:
      '<p>West Lake Longjing Tea is included as a flagship cultural and commercial product, giving the portfolio a category that speaks not only to trade but also to Chinese origin identity, premium gifting, and hospitality service.</p><p>The program combines Meijiawu origin reference, spring harvest detail, retail and foodservice pack options, and the presentation discipline expected by buyers seeking a tea line that can move from display to commercial review without losing its premium narrative.</p><p>Because the product is already structured as a direct-order line, it works well for demonstrations that need to show how a polished portfolio can move from category storytelling into immediate sample and order evaluation.</p>',
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
    summary: 'Fresh Jiaobai stems prepared for chilled export, specialty retail, and menus seeking a distinctive Chinese vegetable line.',
    description: 'A seasonal specialty vegetable line combining regional identity, fresh pack planning, and chilled export handling.',
    richDescription:
      '<p>Fresh Jiaobai Stems introduce a distinctly Chinese specialty vegetable to the portfolio, helping the site move beyond standard produce and into a more curated presentation of regional agricultural identity.</p><p>The line is organized around lower Yangtze cultivation, fresh harvest timing, chilled carton configuration, and the practical cold-chain decisions required to deliver a delicate product in sound condition.</p><p>For importers, chefs, and specialty retailers, Jiaobai offers a useful example of how the platform can present lesser-known products with enough commercial and logistical clarity to support serious consideration.</p>',
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
    summary: 'Straight green asparagus spears prepared for chilled retail distribution, foodservice supply, and fresh export programs.',
    description: 'A fresh asparagus export line with sizing standards, carton formats, and reefer-handling visibility.',
    richDescription:
      '<p>Green Asparagus Spears provide the portfolio with a globally familiar fresh category that can be read immediately by retail buyers, distributors, and foodservice operators, while still demonstrating disciplined Chinese export presentation.</p><p>The line is framed through size consistency, hydro-cooling, carton selection, and reefer movement so that the buyer sees not only a vegetable but also a workable export proposition.</p><p>That makes asparagus a useful bridge product within the presentation: familiar enough to be commercially intuitive, yet structured in a way that reinforces the platform&apos;s export-delivery promise.</p>',
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
    summary: 'A halal-certified curry chicken ready meal with export carton options, labeling support, and private-label potential.',
    description: 'A direct-order prepared food line for retail, airline catering, institutional channels, and halal export distribution.',
    richDescription:
      '<p>This halal-certified curry chicken ready meal gives the portfolio a finished-food export story that complements the agricultural lines and shows how the platform can also support downstream, value-added food products.</p><p>The program is framed for Gulf markets, Southeast Asian retail, airline catering, and institutional procurement, with attention to halal suitability, case-pack structure, shelf-life, labeling review, and export documentation.</p><p>Because it is already set up as a direct-order line, the product also demonstrates how the site can present packaged food in a way that feels commercially ready rather than purely conceptual.</p>',
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
          yunnanBoletus.id,
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
        url: commonsImage('Gekochte_Wollhandkrabben.jpg'),
        altText: 'Chinese mitten crab export presentation image',
        type: ProductImageType.MAIN,
        sortOrder: 0,
        isPrimary: true
      },
      {
        productId: chineseMittenCrab.id,
        url: commonsImage('Roe_inside_steamed_female_hairy_crab.jpg'),
        altText: 'Chinese mitten crab premium product detail',
        type: ProductImageType.DETAIL,
        sortOrder: 1,
        isPrimary: false
      },
      {
        productId: yunnanBoletus.id,
        url: commonsImage('Boletus_edulis_11.jpg'),
        altText: 'Yunnan wild boletus export presentation image',
        type: ProductImageType.MAIN,
        sortOrder: 0,
        isPrimary: true
      },
      {
        productId: yunnanBoletus.id,
        url: commonsImage('Steinpilz_2006_08_3.jpg'),
        altText: 'Yunnan premium mushroom selection detail',
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
      title: 'How Nongye Chuhai organizes direct farm sourcing and export delivery',
      excerpt:
        'Nongye Chuhai is organized as a formal export presentation platform, connecting premium Chinese agricultural products with buyer inquiry, supplier coordination, and end-to-end delivery support.',
      content:
        '<p>Nongye Chuhai is designed to present premium Chinese agricultural products in a format suitable for formal buyer meetings, institutional review, and government demonstration, rather than as a high-volume generic marketplace.</p><p>The portfolio is organized around clear export families including aquatic products, Yunnan mushrooms, Chinese tea, specialty vegetables, and halal prepared foods, allowing visitors to understand both category breadth and the distinct regional strengths behind each line.</p><p>Each product is paired with origin context, specification highlights, pack formats, and a visible commercial route so buyers can judge not only what the product is, but how it can move from farm or factory into a credible export program.</p><p>Direct farm sourcing, customs coordination, documentation handling, cold-chain planning, and buyer inquiry follow-up are treated as part of the same commercial story, helping the platform communicate delivery capability alongside product presentation.</p>',
      status: PageStatus.PUBLISHED,
      seoTitle: 'About Nongye Chuhai Export Portfolio',
      seoDescription: 'Formal overview of Nongye Chuhai direct farm sourcing and export delivery approach.',
      publishedAt: now
    },
    create: {
      slug: 'about',
      locale: 'en',
      title: 'How Nongye Chuhai organizes direct farm sourcing and export delivery',
      excerpt:
        'Nongye Chuhai is organized as a formal export presentation platform, connecting premium Chinese agricultural products with buyer inquiry, supplier coordination, and end-to-end delivery support.',
      content:
        '<p>Nongye Chuhai is designed to present premium Chinese agricultural products in a format suitable for formal buyer meetings, institutional review, and government demonstration, rather than as a high-volume generic marketplace.</p><p>The portfolio is organized around clear export families including aquatic products, Yunnan mushrooms, Chinese tea, specialty vegetables, and halal prepared foods, allowing visitors to understand both category breadth and the distinct regional strengths behind each line.</p><p>Each product is paired with origin context, specification highlights, pack formats, and a visible commercial route so buyers can judge not only what the product is, but how it can move from farm or factory into a credible export program.</p><p>Direct farm sourcing, customs coordination, documentation handling, cold-chain planning, and buyer inquiry follow-up are treated as part of the same commercial story, helping the platform communicate delivery capability alongside product presentation.</p>',
      status: PageStatus.PUBLISHED,
      seoTitle: 'About Nongye Chuhai Export Portfolio',
      seoDescription: 'Formal overview of Nongye Chuhai direct farm sourcing and export delivery approach.',
      publishedAt: now
    }
  });

  await prisma.faqItem.deleteMany({
    where: {
      OR: [
        { pageId: aboutPage.id },
        {
          productId: {
            in: [chineseMittenCrab.id, westLakeLongjing.id, halalReadyMeal.id]
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
      notes: 'Seeded direct-order showcase order for halal prepared meal export review.',
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
      notes: 'Seeded direct-order showcase order for halal prepared meal export review.',
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
