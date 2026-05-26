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

function readAgentConversation(formData: FormData) {
  const raw = readField(formData, 'agentConversation');

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function buildRedirectUrl(locale: string, sourceProductSlug: string | null, error?: string, reference?: string) {
  const params = new URLSearchParams();

  if (sourceProductSlug) {
    params.set('product', sourceProductSlug);
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
  
  const sourceProductSlug = readField(formData, 'sourceProductSlug') || null;
  const customerName = readField(formData, 'customerName');
  const customerCompany = readField(formData, 'customerCompany') || null;
  const customerEmail = readField(formData, 'customerEmail');
  const customerPhone = readField(formData, 'customerPhone') || null;
  const customerCountry = readField(formData, 'customerCountry');
  const quantityRequested = readField(formData, 'quantityRequested');
  const targetPrice = readField(formData, 'targetPrice');
  const currency = readField(formData, 'currency') || null;
  const requirements = readField(formData, 'requirements');
  const agentConversation = readAgentConversation(formData);

  if (!customerName || !customerEmail || !customerCountry || !requirements) {
    redirect(buildRedirectUrl(locale, sourceProductSlug, 'missing-fields'));
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
    redirect(buildRedirectUrl(locale, sourceProductSlug, 'invalid-email'));
  }

  const fallbackSupplier = await prisma.supplier.findFirst({
    where: {
      status: 'APPROVED'
    },
    select: {
      id: true
    }
  });

  const supplierId = fallbackSupplier?.id;

  if (!supplierId) {
    redirect(buildRedirectUrl(locale, sourceProductSlug, 'no-supplier'));
  }

  const inquiryNumber = `INQ-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${randomUUID().slice(0, 6).toUpperCase()}`;

  await prisma.inquiry.create({
    data: {
      inquiryNumber,
      productId: null,
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
      attachmentsJson: agentConversation
        ? {
            inquiryAgent: agentConversation
          }
        : undefined,
      sourcePageUrl: sourceProductSlug ? `/products/${sourceProductSlug}` : '/rfq'
    }
  });

  revalidatePath('/rfq');
  revalidatePath('/products');
  revalidatePath('/account');

  if (sourceProductSlug) {
    revalidatePath(`/products/${sourceProductSlug}`);
  }

  redirect(buildRedirectUrl(locale, sourceProductSlug, undefined, inquiryNumber));
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