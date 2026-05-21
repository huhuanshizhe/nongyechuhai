'use server';

import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@nongyechuhai/db';
import { auth } from '../../../auth';
import { routing } from '../../../i18n/routing';

function readField(formData: FormData, fieldName: string) {
  return String(formData.get(fieldName) ?? '').trim();
}

function buildRedirectUrl(locale: string, baseProductSlug: string | null, error?: string, reference?: string) {
  const params = new URLSearchParams();

  if (baseProductSlug) {
    params.set('product', baseProductSlug);
  }

  if (error) {
    params.set('error', error);
  }

  if (reference) {
    params.set('submitted', '1');
    params.set('reference', reference);
  }

  const query = params.toString();
  return query ? `/${locale}/rfq?${query}` : `/${locale}/rfq`;
}

export async function submitInquiryAction(formData: FormData) {
  const session = await auth();
  const buyerUserId = (session?.user as { id?: string } | undefined)?.id ?? null;
  
  // Get locale from form data for proper redirect
  const locale = readField(formData, 'locale') || routing.defaultLocale;
  
  const productSlug = readField(formData, 'productSlug') || null;
  const customerName = readField(formData, 'customerName');
  const customerCompany = readField(formData, 'customerCompany') || null;
  const customerEmail = readField(formData, 'customerEmail');
  const customerPhone = readField(formData, 'customerPhone') || null;
  const customerCountry = readField(formData, 'customerCountry');
  const quantityRequested = readField(formData, 'quantityRequested');
  const targetPrice = readField(formData, 'targetPrice');
  const currency = readField(formData, 'currency') || null;
  const requirements = readField(formData, 'requirements');

  if (!customerName || !customerEmail || !customerCountry || !requirements) {
    redirect(buildRedirectUrl(locale, productSlug, 'missing-fields'));
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
    redirect(buildRedirectUrl(locale, productSlug, 'invalid-email'));
  }

  const selectedProduct = productSlug
    ? await prisma.product.findUnique({
        where: { slug: productSlug },
        select: {
          id: true,
          slug: true,
          supplierId: true
        }
      })
    : null;

  const fallbackSupplier = selectedProduct
    ? null
    : await prisma.supplier.findFirst({
        where: {
          status: 'APPROVED'
        },
        select: {
          id: true
        }
      });

  const supplierId = selectedProduct?.supplierId ?? fallbackSupplier?.id;

  if (!supplierId) {
    redirect(buildRedirectUrl(locale, productSlug, 'no-supplier'));
  }

  const inquiryNumber = `INQ-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${randomUUID().slice(0, 6).toUpperCase()}`;

  await prisma.inquiry.create({
    data: {
      inquiryNumber,
      productId: selectedProduct?.id ?? null,
      supplierId,
      buyerUserId,
      customerName,
      customerEmail,
      customerPhone,
      customerCompany,
      customerCountry,
      quantityRequested: quantityRequested ? Number(quantityRequested) : null,
      targetPrice: targetPrice ? targetPrice : null,
      currency,
      requirements,
      sourcePageUrl: productSlug ? `/products/${productSlug}` : '/rfq'
    }
  });

  revalidatePath('/rfq');
  revalidatePath('/products');
  revalidatePath('/account');

  if (productSlug) {
    revalidatePath(`/products/${productSlug}`);
  }

  redirect(buildRedirectUrl(locale, productSlug, undefined, inquiryNumber));
}

export type InquiryDetail = NonNullable<Awaited<ReturnType<typeof getInquiryDetailsRaw>>>;

async function getInquiryDetailsRaw(inquiryNumber: string) {
  return prisma.inquiry.findUnique({
    where: { inquiryNumber },
    select: {
      id: true,
      inquiryNumber: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      customerName: true,
      customerEmail: true,
      customerPhone: true,
      customerCompany: true,
      customerCountry: true,
      quantityRequested: true,
      targetPrice: true,
      currency: true,
      requirements: true,
      product: {
        select: {
          name: true,
          slug: true,
          coverImageUrl: true,
          category: { select: { name: true } }
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
        where: { status: 'SENT' },
        select: {
          id: true,
          quoteNumber: true,
          status: true,
          currency: true,
          totalAmount: true,
          minOrderQty: true,
          leadTimeDays: true,
          validUntil: true,
          notes: true,
          sentAt: true
        },
        orderBy: { sentAt: 'desc' }
      }
    }
  });
}

export async function getInquiryDetails(inquiryNumber: string): Promise<InquiryDetail | null> {
  return getInquiryDetailsRaw(inquiryNumber);
}