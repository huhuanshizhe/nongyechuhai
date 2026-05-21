import { NextRequest, NextResponse } from 'next/server';
import { generateProductCopy } from '@nongyechuhai/ai';
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
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    // Get product details
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: { select: { name: true } },
        supplier: { select: { organization: { select: { name: true } } } }
      }
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Generate product copy
    const result = await generateProductCopy({
      productName: product.name,
      category: product.category?.name ?? 'General',
      brand: product.brand ?? undefined,
      model: product.model ?? undefined,
      existingDescription: product.description ?? undefined
    });

    // Log AI usage
    await prisma.aiLog.create({
      data: {
        purpose: 'PRODUCT_COPY',
        status: 'SUCCESS',
        provider: 'openai-compatible',
        model: process.env.AI_MODEL ?? 'unknown',
        entityType: 'product',
        entityId: productId,
        inputSummary: `Product: ${product.name}`,
        outputSummary: `Generated summary, description, SEO content`,
        createdByUserId: session.user.id
      }
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('AI product copy error:', error);
    return NextResponse.json(
      { error: 'Failed to generate product copy' },
      { status: 500 }
    );
  }
}