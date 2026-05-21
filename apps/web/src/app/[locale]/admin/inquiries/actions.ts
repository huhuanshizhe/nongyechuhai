'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@nongyechuhai/db';
import type { InquiryStatus } from '@prisma/client';

export async function updateInquiryStatus(formData: FormData) {
  const inquiryNumber = formData.get('inquiryNumber') as string;
  const newStatus = formData.get('status') as InquiryStatus;
  
  await prisma.inquiry.update({
    where: { inquiryNumber },
    data: { status: newStatus }
  });
  
  revalidatePath('/admin/inquiries');
  revalidatePath(`/admin/inquiries/${inquiryNumber}`);
}

export async function getAdminInquiryDetails(inquiryNumber: string) {
  const inquiry = await prisma.inquiry.findUnique({
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
      sourcePageUrl: true,
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
          id: true,
          organization: { select: { name: true } }
        }
      },
      quotes: {
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
        orderBy: { createdAt: 'desc' }
      }
    }
  });
  
  return inquiry;
}