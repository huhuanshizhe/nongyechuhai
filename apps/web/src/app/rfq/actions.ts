'use server';

import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@nongyechuhai/db';
import { auth } from '../../auth';

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

function buildRedirectUrl(baseProductSlug: string | null, error?: string, reference?: string) {
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
  return query ? `/rfq?${query}` : '/rfq';
}

export async function submitInquiryAction(formData: FormData) {
  const session = await auth();
  const buyerUserId = (session?.user as { id?: string } | undefined)?.id ?? null;
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
  const agentConversation = readAgentConversation(formData);

  if (!customerName || !customerEmail || !customerCountry || !requirements) {
    redirect(buildRedirectUrl(productSlug, 'missing-fields'));
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
    redirect(buildRedirectUrl(productSlug, 'invalid-email'));
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
    redirect(buildRedirectUrl(productSlug, 'no-supplier'));
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
      attachmentsJson: agentConversation
        ? {
            inquiryAgent: agentConversation
          }
        : undefined,
      sourcePageUrl: productSlug ? `/products/${productSlug}` : '/rfq'
    }
  });

  revalidatePath('/rfq');
  revalidatePath('/products');
  revalidatePath('/account');

  if (productSlug) {
    revalidatePath(`/products/${productSlug}`);
  }

  redirect(buildRedirectUrl(productSlug, undefined, inquiryNumber));
}