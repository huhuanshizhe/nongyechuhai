import { NextRequest, NextResponse } from 'next/server';
import { generateInquirySummary } from '@nongyechuhai/ai';
import { prisma } from '@nongyechuhai/db';
import { createAppAuth } from '@nongyechuhai/auth';

const { auth } = createAppAuth();

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { inquiryId } = body;

    if (!inquiryId) {
      return NextResponse.json({ error: 'Inquiry ID required' }, { status: 400 });
    }

    // Get inquiry details
    const inquiry = await prisma.inquiry.findUnique({
      where: { id: inquiryId },
      include: {
        product: { select: { name: true } }
      }
    });

    if (!inquiry) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    // Generate inquiry summary
    const result = await generateInquirySummary({
      inquiryNumber: inquiry.inquiryNumber,
      customerName: inquiry.customerName,
      customerCompany: inquiry.customerCompany ?? undefined,
      customerCountry: inquiry.customerCountry ?? undefined,
      productName: inquiry.product?.name,
      quantity: inquiry.quantityRequested ?? undefined,
      targetPrice: inquiry.targetPrice ? parseFloat(inquiry.targetPrice.toString()) : undefined,
      currency: inquiry.currency ?? undefined,
      requirements: inquiry.requirements ?? undefined
    });

    // Log AI usage
    await prisma.aiLog.create({
      data: {
        purpose: 'INQUIRY_SUMMARY',
        status: 'SUCCESS',
        provider: 'openai-compatible',
        model: process.env.AI_MODEL ?? 'unknown',
        entityType: 'inquiry',
        entityId: inquiryId,
        inputSummary: `Inquiry: ${inquiry.inquiryNumber}, Customer: ${inquiry.customerName}`,
        outputSummary: `Generated summary with ${result.keyPoints.length} key points, urgency: ${result.urgencyLevel}`,
        createdByUserId: session.user.id
      }
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('AI inquiry summary error:', error);
    return NextResponse.json(
      { error: 'Failed to generate inquiry summary' },
      { status: 500 }
    );
  }
}