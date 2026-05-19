import { prisma } from '@nongyechuhai/db';

const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
  month: 'short',
  day: 'numeric'
});

function formatDate(value: Date | null | undefined) {
  if (!value) {
    return '未记录';
  }

  return dateFormatter.format(value);
}

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .split('_')
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(' ');
}

function formatMoney(value: { toString(): string } | null | undefined, currency = 'USD') {
  if (!value) {
    return 'TBD';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(Number(value.toString()));
}

function getStatusTone(value: string) {
  switch (value) {
    case 'APPROVED':
    case 'PUBLISHED':
    case 'COMPLETED':
    case 'PAID':
      return 'green';
    case 'PENDING':
    case 'PENDING_REVIEW':
    case 'NEW':
    case 'IN_REVIEW':
      return 'amber';
    case 'REJECTED':
    case 'FAILED':
    case 'CANCELLED':
      return 'red';
    default:
      return 'slate';
  }
}

export async function getSupplierWorkspace(userId: string) {
  const supplier = await prisma.supplier.findFirst({
    where: {
      organization: {
        members: {
          some: {
            userId
          }
        }
      }
    },
    select: {
      id: true,
      status: true,
      isVerified: true,
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
  });

  if (!supplier) {
    return null;
  }

  return {
    id: supplier.id,
    organizationName: supplier.organization.name,
    location: [supplier.organization.city, supplier.organization.country].filter(Boolean).join(', ') || 'Location pending',
    status: formatLabel(supplier.status),
    statusTone: getStatusTone(supplier.status),
    verificationLabel: supplier.isVerified ? 'Verified supplier' : 'Verification pending',
    productCount: supplier._count.products,
    inquiryCount: supplier._count.inquiries,
    orderCount: supplier._count.orders
  };
}

export async function getSupplierProductsPageData(supplierId: string) {
  const [products, publishedCount, pendingCount] = await prisma.$transaction([
    prisma.product.findMany({
      where: {
        supplierId,
        deletedAt: null
      },
      orderBy: [{ status: 'asc' }, { updatedAt: 'desc' }],
      select: {
        name: true,
        status: true,
        tradeMode: true,
        priceMin: true,
        priceMax: true,
        currency: true,
        updatedAt: true,
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
    }),
    prisma.product.count({
      where: {
        supplierId,
        status: 'PUBLISHED',
        deletedAt: null
      }
    }),
    prisma.product.count({
      where: {
        supplierId,
        status: {
          in: ['DRAFT', 'PENDING_REVIEW']
        },
        deletedAt: null
      }
    })
  ]);

  return {
    summary: {
      publishedCount,
      pendingCount,
      totalCount: products.length
    },
    products: products.map((item) => ({
      name: item.name,
      categoryName: item.category.name,
      tradeMode: formatLabel(item.tradeMode),
      status: formatLabel(item.status),
      statusTone: getStatusTone(item.status),
      updatedAt: formatDate(item.updatedAt),
      variantCount: item.variants.length,
      priceLabel:
        item.priceMin && item.priceMax
          ? `${formatMoney(item.priceMin, item.currency)} - ${formatMoney(item.priceMax, item.currency)}`
          : formatMoney(item.priceMin || item.priceMax, item.currency)
    }))
  };
}

export async function getSupplierInquiriesPageData(supplierId: string) {
  const inquiries = await prisma.inquiry.findMany({
    where: {
      supplierId
    },
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
    quantityRequested: item.quantityRequested || 0,
    targetPrice: item.targetPrice ? formatMoney(item.targetPrice, item.currency || 'USD') : 'TBD',
    quoteCount: item.quotes.length,
    createdAt: formatDate(item.createdAt)
  }));
}

export async function getSupplierOrdersPageData(supplierId: string) {
  const [orders, openOrderCount] = await prisma.$transaction([
    prisma.order.findMany({
      where: {
        supplierId
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        orderNumber: true,
        status: true,
        paymentStatus: true,
        totalAmount: true,
        currency: true,
        customerName: true,
        customerEmail: true,
        createdAt: true,
        items: {
          select: {
            id: true
          }
        }
      }
    }),
    prisma.order.count({
      where: {
        supplierId,
        status: {
          in: ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED']
        }
      }
    })
  ]);

  return {
    summary: {
      totalCount: orders.length,
      openOrderCount
    },
    orders: orders.map((item) => ({
      orderNumber: item.orderNumber,
      status: formatLabel(item.status),
      statusTone: getStatusTone(item.status),
      paymentStatus: formatLabel(item.paymentStatus),
      paymentTone: getStatusTone(item.paymentStatus),
      totalAmount: formatMoney(item.totalAmount, item.currency),
      customerName: item.customerName,
      customerEmail: item.customerEmail,
      itemCount: item.items.length,
      createdAt: formatDate(item.createdAt)
    }))
  };
}