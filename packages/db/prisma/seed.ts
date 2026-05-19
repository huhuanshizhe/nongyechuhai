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
      name: 'Demo Supplier Owner',
      role: UserRole.SUPPLIER,
      status: UserStatus.ACTIVE,
      passwordHash: supplierPasswordHash,
      passwordAlgo: PasswordAlgo.BCRYPT
    },
    create: {
      email: 'supplier@nongyechuhai.local',
      name: 'Demo Supplier Owner',
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

  const supplierOrganization = await prisma.organization.upsert({
    where: { slug: 'greenfield-agro' },
    update: {
      type: OrganizationType.SUPPLIER,
      name: 'Greenfield Agro Export',
      legalName: 'Greenfield Agro Export Co., Ltd.',
      email: 'sales@greenfield-agro.example',
      website: 'https://greenfield-agro.example',
      country: 'China',
      city: 'Qingdao'
    },
    create: {
      type: OrganizationType.SUPPLIER,
      name: 'Greenfield Agro Export',
      legalName: 'Greenfield Agro Export Co., Ltd.',
      slug: 'greenfield-agro',
      email: 'sales@greenfield-agro.example',
      phone: '+86-532-0000-0000',
      website: 'https://greenfield-agro.example',
      country: 'China',
      city: 'Qingdao',
      addressLine1: 'No. 18 Harbor Trade Road',
      postalCode: '266000'
    }
  });

  await prisma.organizationMember.upsert({
    where: {
      organizationId_userId: {
        organizationId: supplierOrganization.id,
        userId: supplierUser.id
      }
    },
    update: {
      role: OrganizationMemberRole.OWNER,
      isPrimary: true
    },
    create: {
      organizationId: supplierOrganization.id,
      userId: supplierUser.id,
      role: OrganizationMemberRole.OWNER,
      isPrimary: true
    }
  });

  const supplier = await prisma.supplier.upsert({
    where: { organizationId: supplierOrganization.id },
    update: {
      status: SupplierStatus.APPROVED,
      description: 'Demo export supplier covering spices, dehydrated vegetables, and RFQ workflows.',
      contactName: 'Liu Mei',
      contactEmail: 'sales@greenfield-agro.example',
      contactPhone: '+86-532-0000-0000',
      isVerified: true,
      approvedAt: now
    },
    create: {
      organizationId: supplierOrganization.id,
      status: SupplierStatus.APPROVED,
      description: 'Demo export supplier covering spices, dehydrated vegetables, and RFQ workflows.',
      contactName: 'Liu Mei',
      contactEmail: 'sales@greenfield-agro.example',
      contactPhone: '+86-532-0000-0000',
      isVerified: true,
      approvedAt: now
    }
  });

  const rootCategory = await prisma.productCategory.upsert({
    where: { slug: 'agricultural-products' },
    update: {
      name: 'Agricultural Products',
      description: 'Top-level catalog for export-ready agriculture products.'
    },
    create: {
      name: 'Agricultural Products',
      slug: 'agricultural-products',
      description: 'Top-level catalog for export-ready agriculture products.',
      sortOrder: 1,
      isActive: true
    }
  });

  const spicesCategory = await prisma.productCategory.upsert({
    where: { slug: 'spices-seasonings' },
    update: {
      parentId: rootCategory.id,
      name: 'Spices & Seasonings',
      description: 'Bulk export spices and seasoning ingredients.'
    },
    create: {
      parentId: rootCategory.id,
      name: 'Spices & Seasonings',
      slug: 'spices-seasonings',
      description: 'Bulk export spices and seasoning ingredients.',
      sortOrder: 1,
      isActive: true
    }
  });

  const vegetablesCategory = await prisma.productCategory.upsert({
    where: { slug: 'dehydrated-vegetables' },
    update: {
      parentId: rootCategory.id,
      name: 'Dehydrated Vegetables',
      description: 'Shelf-stable dehydrated vegetables for wholesale buyers.'
    },
    create: {
      parentId: rootCategory.id,
      name: 'Dehydrated Vegetables',
      slug: 'dehydrated-vegetables',
      description: 'Shelf-stable dehydrated vegetables for wholesale buyers.',
      sortOrder: 2,
      isActive: true
    }
  });

  const chiliProduct = await prisma.product.upsert({
    where: { slug: 'premium-dried-chili' },
    update: {
      supplierId: supplier.id,
      categoryId: spicesCategory.id,
      name: 'Premium Dried Chili',
      brand: 'Greenfield Agro',
      model: 'GF-CHILI-001',
      summary: 'High-color export-grade dried chili with customizable packaging.',
      description: 'Seeded inquiry-only product for RFQ and supplier workflow testing.',
      richDescription: '<p>Bulk dried chili for export buyers who prefer inquiry-based negotiation.</p>',
      tradeMode: TradeMode.INQUIRY_ONLY,
      status: ProductStatus.PUBLISHED,
      currency: 'USD',
      priceMin: '120.00',
      priceMax: '180.00',
      seoTitle: 'Premium Dried Chili Supplier',
      seoDescription: 'Seed data for inquiry-only export chili.',
      coverImageUrl: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&w=1200&q=80',
      publishedAt: now,
      specsJson: {
        moisture: '<12%',
        color: 'ASTA 120+',
        packaging: ['10kg carton', '25kg woven bag']
      }
    },
    create: {
      supplierId: supplier.id,
      categoryId: spicesCategory.id,
      name: 'Premium Dried Chili',
      slug: 'premium-dried-chili',
      brand: 'Greenfield Agro',
      model: 'GF-CHILI-001',
      summary: 'High-color export-grade dried chili with customizable packaging.',
      description: 'Seeded inquiry-only product for RFQ and supplier workflow testing.',
      richDescription: '<p>Bulk dried chili for export buyers who prefer inquiry-based negotiation.</p>',
      tradeMode: TradeMode.INQUIRY_ONLY,
      status: ProductStatus.PUBLISHED,
      currency: 'USD',
      priceMin: '120.00',
      priceMax: '180.00',
      hasVariants: false,
      totalStock: 5000,
      specsJson: {
        moisture: '<12%',
        color: 'ASTA 120+',
        packaging: ['10kg carton', '25kg woven bag']
      },
      seoTitle: 'Premium Dried Chili Supplier',
      seoDescription: 'Seed data for inquiry-only export chili.',
      coverImageUrl: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&w=1200&q=80',
      publishedAt: now
    }
  });

  const garlicProduct = await prisma.product.upsert({
    where: { slug: 'dehydrated-garlic-flakes' },
    update: {
      supplierId: supplier.id,
      categoryId: vegetablesCategory.id,
      name: 'Dehydrated Garlic Flakes',
      brand: 'Greenfield Agro',
      model: 'GF-GARLIC-025',
      summary: 'Shelf-stable garlic flakes prepared for B2B catalog and mock checkout flow.',
      description: 'Seeded direct-purchase product for order and payment adapter testing.',
      richDescription: '<p>Direct-purchase sample product used for seeded order and payment flows.</p>',
      tradeMode: TradeMode.DIRECT_PURCHASE,
      status: ProductStatus.PUBLISHED,
      currency: 'USD',
      priceMin: '45.00',
      priceMax: '62.00',
      hasVariants: true,
      totalStock: 1200,
      seoTitle: 'Dehydrated Garlic Flakes Wholesale',
      seoDescription: 'Seed data for direct purchase workflow testing.',
      coverImageUrl: 'https://images.unsplash.com/photo-1615485925873-6b11d9dc1d0b?auto=format&fit=crop&w=1200&q=80',
      publishedAt: now,
      specsJson: {
        mesh: '8-16 mesh',
        moisture: '<8%',
        origin: 'Shandong'
      }
    },
    create: {
      supplierId: supplier.id,
      categoryId: vegetablesCategory.id,
      name: 'Dehydrated Garlic Flakes',
      slug: 'dehydrated-garlic-flakes',
      brand: 'Greenfield Agro',
      model: 'GF-GARLIC-025',
      summary: 'Shelf-stable garlic flakes prepared for B2B catalog and mock checkout flow.',
      description: 'Seeded direct-purchase product for order and payment adapter testing.',
      richDescription: '<p>Direct-purchase sample product used for seeded order and payment flows.</p>',
      tradeMode: TradeMode.DIRECT_PURCHASE,
      status: ProductStatus.PUBLISHED,
      currency: 'USD',
      priceMin: '45.00',
      priceMax: '62.00',
      hasVariants: true,
      totalStock: 1200,
      specsJson: {
        mesh: '8-16 mesh',
        moisture: '<8%',
        origin: 'Shandong'
      },
      seoTitle: 'Dehydrated Garlic Flakes Wholesale',
      seoDescription: 'Seed data for direct purchase workflow testing.',
      coverImageUrl: 'https://images.unsplash.com/photo-1615485925873-6b11d9dc1d0b?auto=format&fit=crop&w=1200&q=80',
      publishedAt: now
    }
  });

  await prisma.productImage.deleteMany({
    where: {
      productId: {
        in: [chiliProduct.id, garlicProduct.id]
      }
    }
  });

  await prisma.productImage.createMany({
    data: [
      {
        productId: chiliProduct.id,
        url: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&w=1200&q=80',
        altText: 'Premium dried chili',
        type: ProductImageType.MAIN,
        sortOrder: 0,
        isPrimary: true
      },
      {
        productId: garlicProduct.id,
        url: 'https://images.unsplash.com/photo-1615485925873-6b11d9dc1d0b?auto=format&fit=crop&w=1200&q=80',
        altText: 'Dehydrated garlic flakes',
        type: ProductImageType.MAIN,
        sortOrder: 0,
        isPrimary: true
      }
    ]
  });

  const garlicVariant = await prisma.productVariant.upsert({
    where: { sku: 'GF-GARLIC-025-25KG' },
    update: {
      productId: garlicProduct.id,
      optionValues: {
        packaging: '25kg carton',
        grade: 'Export A'
      },
      price: '58.00',
      currency: 'USD',
      stockQty: 450,
      weightKg: '25.000',
      imageUrl: 'https://images.unsplash.com/photo-1615485925873-6b11d9dc1d0b?auto=format&fit=crop&w=1200&q=80',
      isActive: true,
      sortOrder: 0
    },
    create: {
      productId: garlicProduct.id,
      sku: 'GF-GARLIC-025-25KG',
      optionValues: {
        packaging: '25kg carton',
        grade: 'Export A'
      },
      price: '58.00',
      currency: 'USD',
      stockQty: 450,
      weightKg: '25.000',
      imageUrl: 'https://images.unsplash.com/photo-1615485925873-6b11d9dc1d0b?auto=format&fit=crop&w=1200&q=80',
      isActive: true,
      sortOrder: 0
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
      title: 'About Nongyechuhai',
      excerpt: 'Seeded CMS page for storefront and admin content workflows.',
      content: '<p>Nongyechuhai connects international buyers with export-ready agriculture suppliers.</p>',
      status: PageStatus.PUBLISHED,
      seoTitle: 'About Nongyechuhai',
      seoDescription: 'Seeded about page for content workflow testing.',
      publishedAt: now
    },
    create: {
      slug: 'about',
      locale: 'en',
      title: 'About Nongyechuhai',
      excerpt: 'Seeded CMS page for storefront and admin content workflows.',
      content: '<p>Nongyechuhai connects international buyers with export-ready agriculture suppliers.</p>',
      status: PageStatus.PUBLISHED,
      seoTitle: 'About Nongyechuhai',
      seoDescription: 'Seeded about page for content workflow testing.',
      publishedAt: now
    }
  });

  await prisma.faqItem.deleteMany({
    where: {
      OR: [{ pageId: aboutPage.id }, { productId: chiliProduct.id }]
    }
  });

  await prisma.faqItem.createMany({
    data: [
      {
        question: 'Do you support mixed-container export orders?',
        answer: 'Yes. Buyers can start with an RFQ and define the final mix after supplier confirmation.',
        locale: 'en',
        sortOrder: 1,
        pageId: aboutPage.id,
        isPublished: true
      },
      {
        question: 'Can this chili product be ordered directly online?',
        answer: 'No. This seeded chili sample is inquiry-only and is intended to test RFQ routing.',
        locale: 'en',
        sortOrder: 1,
        productId: chiliProduct.id,
        isPublished: true
      }
    ]
  });

  const inquiry = await prisma.inquiry.upsert({
    where: { inquiryNumber: 'INQ-20260519-001' },
    update: {
      productId: chiliProduct.id,
      supplierId: supplier.id,
      buyerUserId: buyerUser.id,
      customerName: 'Amelia Harper',
      customerEmail: 'buyer@nongyechuhai.local',
      customerCompany: 'Harbor Foods Trading',
      customerCountry: 'Singapore',
      quantityRequested: 2000,
      targetPrice: '135.00',
      currency: 'USD',
      requirements: 'Looking for export-grade dried chili with private label packaging.',
      sourcePageUrl: '/products/premium-dried-chili'
    },
    create: {
      inquiryNumber: 'INQ-20260519-001',
      productId: chiliProduct.id,
      supplierId: supplier.id,
      buyerUserId: buyerUser.id,
      customerName: 'Amelia Harper',
      customerEmail: 'buyer@nongyechuhai.local',
      customerPhone: '+65-0000-0000',
      customerCompany: 'Harbor Foods Trading',
      customerCountry: 'Singapore',
      quantityRequested: 2000,
      targetPrice: '135.00',
      currency: 'USD',
      requirements: 'Looking for export-grade dried chili with private label packaging.',
      sourcePageUrl: '/products/premium-dried-chili'
    }
  });

  await prisma.quote.upsert({
    where: { quoteNumber: 'QUO-20260519-001' },
    update: {
      inquiryId: inquiry.id,
      supplierId: supplier.id,
      currency: 'USD',
      totalAmount: '2800.00',
      minOrderQty: 1000,
      leadTimeDays: 18,
      validUntil: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      notes: 'FOB Qingdao. Packaging customization supported.',
      sentAt: now
    },
    create: {
      quoteNumber: 'QUO-20260519-001',
      inquiryId: inquiry.id,
      supplierId: supplier.id,
      currency: 'USD',
      totalAmount: '2800.00',
      minOrderQty: 1000,
      leadTimeDays: 18,
      validUntil: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      notes: 'FOB Qingdao. Packaging customization supported.',
      sentAt: now
    }
  });

  const order = await prisma.order.upsert({
    where: { orderNumber: 'ORD-20260519-001' },
    update: {
      buyerUserId: buyerUser.id,
      supplierId: supplier.id,
      currency: 'USD',
      subtotalAmount: '580.00',
      shippingAmount: '45.00',
      taxAmount: '0.00',
      discountAmount: '0.00',
      totalAmount: '625.00',
      customerName: 'Amelia Harper',
      customerEmail: 'buyer@nongyechuhai.local',
      customerPhone: '+65-0000-0000',
      shippingAddressJson: {
        country: 'Singapore',
        city: 'Singapore',
        addressLine1: '1 Marina Boulevard'
      },
      notes: 'Seeded direct-purchase order for mock payment testing.',
      placedAt: now
    },
    create: {
      orderNumber: 'ORD-20260519-001',
      buyerUserId: buyerUser.id,
      supplierId: supplier.id,
      currency: 'USD',
      subtotalAmount: '580.00',
      shippingAmount: '45.00',
      taxAmount: '0.00',
      discountAmount: '0.00',
      totalAmount: '625.00',
      customerName: 'Amelia Harper',
      customerEmail: 'buyer@nongyechuhai.local',
      customerPhone: '+65-0000-0000',
      shippingAddressJson: {
        country: 'Singapore',
        city: 'Singapore',
        addressLine1: '1 Marina Boulevard'
      },
      notes: 'Seeded direct-purchase order for mock payment testing.',
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
      productId: garlicProduct.id,
      productVariantId: garlicVariant.id,
      supplierId: supplier.id,
      productNameSnapshot: 'Dehydrated Garlic Flakes',
      skuSnapshot: 'GF-GARLIC-025-25KG',
      imageUrlSnapshot: 'https://images.unsplash.com/photo-1615485925873-6b11d9dc1d0b?auto=format&fit=crop&w=1200&q=80',
      unitPrice: '58.00',
      quantity: 10,
      lineTotal: '580.00',
      attributesJson: {
        packaging: '25kg carton',
        grade: 'Export A'
      }
    }
  });

  await prisma.payment.create({
    data: {
      orderId: order.id,
      provider: PaymentProvider.QUOTE,
      status: PaymentStatus.PENDING,
      amount: '625.00',
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
