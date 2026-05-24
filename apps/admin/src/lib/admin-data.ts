import { prisma } from '@nongyechuhai/db';

const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
  month: 'short',
  day: 'numeric'
});

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
});

function formatDate(value: Date | null | undefined) {
  if (!value) {
    return '未记录';
  }

  return dateFormatter.format(value);
}

function formatCurrency(value: { toString(): string } | null | undefined) {
  if (!value) {
    return 'TBD';
  }

  return currencyFormatter.format(Number(value.toString()));
}

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .split('_')
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(' ');
}

function getStatusTone(value: string) {
  switch (value) {
    case 'APPROVED':
    case 'PUBLISHED':
    case 'COMPLETED':
    case 'PAID':
    case 'ACTIVE':
    case 'CLOSED_WON':
    case 'AUTHORIZED':
      return 'green';
    case 'PENDING':
    case 'PENDING_REVIEW':
    case 'NEW':
    case 'IN_REVIEW':
    case 'QUOTED':
    case 'SHIPPED':
    case 'NEGOTIATING':
    case 'CONFIRMED':
    case 'PROCESSING':
      return 'amber';
    case 'REJECTED':
    case 'CANCELLED':
    case 'FAILED':
    case 'SUSPENDED':
    case 'CLOSED_LOST':
    case 'EXPIRED':
      return 'red';
    default:
      return 'slate';
  }
}

export async function getAdminDashboardData() {
  const [
    pendingSupplierCount,
    approvedSupplierCount,
    publishedProductCount,
    reviewProductCount,
    openInquiryCount,
    publishedPageCount,
    recentInquiries,
    supplierSnapshot,
    productSnapshot,
    contentSnapshot
  ] = await prisma.$transaction([
    prisma.supplier.count({
      where: {
        status: 'PENDING'
      }
    }),
    prisma.supplier.count({
      where: {
        status: 'APPROVED'
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
        status: {
          in: ['PENDING_REVIEW', 'DRAFT']
        },
        deletedAt: null
      }
    }),
    prisma.inquiry.count({
      where: {
        status: {
          notIn: ['CLOSED_WON', 'CLOSED_LOST', 'EXPIRED']
        }
      }
    }),
    prisma.cmsPage.count({
      where: {
        status: 'PUBLISHED'
      }
    }),
    prisma.inquiry.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        inquiryNumber: true,
        status: true,
        createdAt: true,
        customerName: true,
        customerCountry: true,
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
    }),
    prisma.supplier.findMany({
      take: 4,
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
      select: {
        status: true,
        isVerified: true,
        approvedAt: true,
        contactName: true,
        contactEmail: true,
        organization: {
          select: {
            name: true,
            city: true,
            country: true
          }
        },
        _count: {
          select: {
            products: true,
            inquiries: true,
            orders: true
          }
        }
      }
    }),
    prisma.product.findMany({
      take: 5,
      orderBy: [{ status: 'asc' }, { updatedAt: 'desc' }],
      where: {
        deletedAt: null
      },
      select: {
        name: true,
        status: true,
        tradeMode: true,
        updatedAt: true,
        priceMin: true,
        currency: true,
        supplier: {
          select: {
            organization: {
              select: {
                name: true
              }
            }
          }
        },
        category: {
          select: {
            name: true
          }
        }
      }
    }),
    prisma.cmsPage.findMany({
      take: 4,
      orderBy: {
        updatedAt: 'desc'
      },
      select: {
        slug: true,
        title: true,
        status: true,
        updatedAt: true,
        faqItems: {
          select: {
            id: true
          }
        }
      }
    })
  ]);

  return {
    metrics: [
      {
        label: '待审核供应商',
        value: pendingSupplierCount,
        detail: '需要资质补件或准入判断'
      },
      {
        label: '已发布商品',
        value: publishedProductCount,
        detail: '当前对买家可见的商品线'
      },
      {
        label: '开放询盘',
        value: openInquiryCount,
        detail: '仍处于跟进、报价或谈判中的需求'
      },
      {
        label: '已发布内容页',
        value: publishedPageCount,
        detail: '当前前台可用的内容信号资产'
      }
    ],
    pulse: [
      {
        label: '通过审核供应商',
        value: approvedSupplierCount
      },
      {
        label: '待处理商品池',
        value: reviewProductCount
      }
    ],
    recentInquiries: recentInquiries.map((item) => ({
      inquiryNumber: item.inquiryNumber,
      status: formatLabel(item.status),
      statusTone: getStatusTone(item.status),
      customerName: item.customerName,
      customerCountry: item.customerCountry || 'Unknown market',
      supplierName: item.supplier.organization.name,
      productName: item.product?.name || 'General sourcing request',
      quoteCount: item.quotes.length,
      createdAt: formatDate(item.createdAt)
    })),
    suppliers: supplierSnapshot.map((item) => ({
      name: item.organization.name,
      location: [item.organization.city, item.organization.country].filter(Boolean).join(', ') || 'Location pending',
      status: formatLabel(item.status),
      statusTone: getStatusTone(item.status),
      verifiedLabel: item.isVerified ? 'Verified' : 'Verification pending',
      contactName: item.contactName || 'Not assigned',
      contactEmail: item.contactEmail || 'No email',
      approvedAt: formatDate(item.approvedAt),
      productCount: item._count.products,
      inquiryCount: item._count.inquiries,
      orderCount: item._count.orders
    })),
    products: productSnapshot.map((item) => ({
      name: item.name,
      supplierName: item.supplier.organization.name,
      categoryName: item.category.name,
      tradeMode: formatLabel(item.tradeMode),
      status: formatLabel(item.status),
      statusTone: getStatusTone(item.status),
      updatedAt: formatDate(item.updatedAt),
      priceLabel: formatCurrency(item.priceMin)
    })),
    content: contentSnapshot.map((item) => ({
      title: item.title,
      slug: item.slug,
      status: formatLabel(item.status),
      statusTone: getStatusTone(item.status),
      updatedAt: formatDate(item.updatedAt),
      faqCount: item.faqItems.length
    }))
  };
}

export async function getAdminSuppliersPageData() {
  const suppliers = await prisma.supplier.findMany({
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    select: {
      status: true,
      isVerified: true,
      approvedAt: true,
      contactName: true,
      contactEmail: true,
      contactPhone: true,
      organization: {
        select: {
          name: true,
          city: true,
          country: true,
          website: true
        }
      },
      _count: {
        select: {
          products: true,
          inquiries: true,
          orders: true
        }
      }
    }
  });

  return suppliers.map((item) => ({
    name: item.organization.name,
    location: [item.organization.city, item.organization.country].filter(Boolean).join(', ') || 'Location pending',
    status: formatLabel(item.status),
    statusTone: getStatusTone(item.status),
    verifiedLabel: item.isVerified ? 'Verified' : 'Verification pending',
    contactName: item.contactName || 'Not assigned',
    contactEmail: item.contactEmail || 'No email',
    contactPhone: item.contactPhone || 'No phone',
    website: item.organization.website || 'No website',
    approvedAt: formatDate(item.approvedAt),
    productCount: item._count.products,
    inquiryCount: item._count.inquiries,
    orderCount: item._count.orders
  }));
}

export async function getAdminProductsPageData() {
  const products = await prisma.product.findMany({
    where: {
      deletedAt: null
    },
    orderBy: [{ status: 'asc' }, { updatedAt: 'desc' }],
    select: {
      name: true,
      status: true,
      tradeMode: true,
      currency: true,
      priceMin: true,
      priceMax: true,
      updatedAt: true,
      supplier: {
        select: {
          organization: {
            select: {
              name: true
            }
          }
        }
      },
      category: {
        select: {
          name: true
        }
      },
      variants: {
        select: {
          id: true
        }
      }
    }
  });

  return products.map((item) => ({
    name: item.name,
    status: formatLabel(item.status),
    statusTone: getStatusTone(item.status),
    tradeMode: formatLabel(item.tradeMode),
    supplierName: item.supplier.organization.name,
    categoryName: item.category.name,
    updatedAt: formatDate(item.updatedAt),
    variantCount: item.variants.length,
    priceLabel:
      item.priceMin && item.priceMax
        ? `${formatCurrency(item.priceMin)} - ${formatCurrency(item.priceMax)}`
        : formatCurrency(item.priceMin || item.priceMax)
  }));
}

export async function getAdminInquiriesPageData() {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    select: {
      inquiryNumber: true,
      status: true,
      customerName: true,
      customerCompany: true,
      customerCountry: true,
      quantityRequested: true,
      targetPrice: true,
      currency: true,
      createdAt: true,
      product: {
        select: {
          name: true
        }
      },
      supplier: {
        select: {
          organization: {
            select: {
              name: true
            }
          }
        }
      },
      quotes: {
        select: {
          id: true
        }
      }
    }
  });

  return inquiries.map((item) => ({
    inquiryNumber: item.inquiryNumber,
    status: formatLabel(item.status),
    statusTone: getStatusTone(item.status),
    customerName: item.customerName,
    customerCompany: item.customerCompany || 'No company',
    customerCountry: item.customerCountry || 'Unknown market',
    productName: item.product?.name || 'General sourcing request',
    supplierName: item.supplier.organization.name,
    quoteCount: item.quotes.length,
    quantityRequested: item.quantityRequested || 0,
    targetPrice: item.targetPrice ? formatCurrency(item.targetPrice) : 'TBD',
    createdAt: formatDate(item.createdAt)
  }));
}

export async function getAdminContentPageData() {
  const [pages, faqItems] = await prisma.$transaction([
    prisma.cmsPage.findMany({
      orderBy: {
        updatedAt: 'desc'
      },
      select: {
        title: true,
        slug: true,
        status: true,
        locale: true,
        updatedAt: true,
        faqItems: {
          select: {
            id: true
          }
        }
      }
    }),
    prisma.faqItem.findMany({
      take: 6,
      orderBy: [{ updatedAt: 'desc' }, { sortOrder: 'asc' }],
      select: {
        question: true,
        locale: true,
        isPublished: true,
        page: {
          select: {
            title: true
          }
        },
        product: {
          select: {
            name: true
          }
        }
      }
    })
  ]);

  return {
    pages: pages.map((item) => ({
      title: item.title,
      slug: item.slug,
      locale: item.locale,
      status: formatLabel(item.status),
      statusTone: getStatusTone(item.status),
      updatedAt: formatDate(item.updatedAt),
      faqCount: item.faqItems.length
    })),
    faqItems: faqItems.map((item) => ({
      question: item.question,
      locale: item.locale,
      publishedLabel: item.isPublished ? 'Published' : 'Draft',
      publishedTone: item.isPublished ? 'green' : 'amber',
      target: item.page?.title || item.product?.name || 'General FAQ'
    }))
  };
}