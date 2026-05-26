'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@nongyechuhai/db';
import type { InquiryStatus } from '@prisma/client';

type InquiryAgentSnapshot = {
  updatedAt: string | null;
  readiness: string | null;
  missingFields: string[];
  briefingSummary: string | null;
  transcript: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
};

function readInquiryAgentSnapshot(value: unknown): InquiryAgentSnapshot | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  const root = value as Record<string, unknown>;
  const rawSnapshot = root.inquiryAgent;

  if (!rawSnapshot || typeof rawSnapshot !== 'object' || Array.isArray(rawSnapshot)) {
    return null;
  }

  const snapshot = rawSnapshot as Record<string, unknown>;
  const rawTranscript = Array.isArray(snapshot.transcript) ? snapshot.transcript : [];

  return {
    updatedAt: typeof snapshot.updatedAt === 'string' ? snapshot.updatedAt : null,
    readiness: typeof snapshot.readiness === 'string' ? snapshot.readiness : null,
    missingFields: Array.isArray(snapshot.missingFields)
      ? snapshot.missingFields.filter((field): field is string => typeof field === 'string' && field.trim().length > 0)
      : [],
    briefingSummary: typeof snapshot.briefingSummary === 'string' ? snapshot.briefingSummary.trim() : null,
    transcript: rawTranscript
      .filter((item): item is { role: 'user' | 'assistant'; content: string } => {
        if (!item || typeof item !== 'object' || Array.isArray(item)) {
          return false;
        }

        const record = item as Record<string, unknown>;
        return (record.role === 'user' || record.role === 'assistant') && typeof record.content === 'string' && record.content.trim().length > 0;
      })
      .map((item) => ({
        role: item.role,
        content: item.content.trim()
      }))
  };
}

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
      attachmentsJson: true,
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

  if (!inquiry) {
    return null;
  }

  const { attachmentsJson, ...rest } = inquiry;

  return {
    ...rest,
    inquiryAgentSnapshot: readInquiryAgentSnapshot(attachmentsJson)
  };
}