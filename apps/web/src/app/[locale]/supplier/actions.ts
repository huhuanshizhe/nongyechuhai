'use server';

import { prisma } from '@nongyechuhai/db';
import { auth } from '../../../auth';
import { revalidatePath } from 'next/cache';
import type { InquiryStatus, ProductStatus } from '@prisma/client';

// Get supplier profile for current user (with organization data)
export async function getSupplierProfile() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const membership = await prisma.organizationMember.findFirst({
    where: { userId: session.user.id },
    include: {
      organization: {
        include: {
          supplier: true
        }
      }
    }
  });

  const supplier = membership?.organization?.supplier;
  if (!supplier) return null;

  // Return supplier with organization attached
  return {
    ...supplier,
    organization: membership.organization
  };
}

// Update supplier profile
export async function updateSupplierProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const supplier = await getSupplierProfile();
  if (!supplier) throw new Error('Supplier not found');

  const description = formData.get('description') as string | null;
  const contactName = formData.get('contactName') as string | null;
  const contactEmail = formData.get('contactEmail') as string | null;
  const contactPhone = formData.get('contactPhone') as string | null;
  const logoUrl = formData.get('logoUrl') as string | null;

  await prisma.supplier.update({
    where: { id: supplier.id },
    data: {
      description: description ?? undefined,
      contactName: contactName ?? undefined,
      contactEmail: contactEmail ?? undefined,
      contactPhone: contactPhone ?? undefined,
      logoUrl: logoUrl ?? undefined
    }
  });

  revalidatePath('/supplier/profile');
}

// Get supplier's products
export async function getSupplierProducts(status?: ProductStatus) {
  const session = await auth();
  if (!session?.user?.id) return [];

  const supplier = await getSupplierProfile();
  if (!supplier) return [];

  return prisma.product.findMany({
    where: {
      supplierId: supplier.id,
      status: status ?? undefined,
      deletedAt: null
    },
    include: {
      category: { select: { name: true, slug: true } },
      images: { select: { url: true, isPrimary: true }, orderBy: { sortOrder: 'asc' } }
    },
    orderBy: { updatedAt: 'desc' }
  });
}

// Create new product
export async function createProduct(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const supplier = await getSupplierProfile();
  if (!supplier) throw new Error('Supplier not found');

  const name = formData.get('name') as string;
  const categoryId = formData.get('categoryId') as string;
  const summary = formData.get('summary') as string | null;
  const description = formData.get('description') as string | null;
  const brand = formData.get('brand') as string | null;
  const model = formData.get('model') as string | null;
  const priceMin = formData.get('priceMin') as string | null;
  const priceMax = formData.get('priceMax') as string | null;
  const currency = formData.get('currency') as string || 'USD';

  // Generate slug from name
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

  // Check slug uniqueness
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) {
    throw new Error('Product name already exists');
  }

  const product = await prisma.product.create({
    data: {
      supplierId: supplier.id,
      categoryId,
      name,
      slug,
      summary,
      description,
      brand,
      model,
      priceMin: priceMin ? parseFloat(priceMin) : null,
      priceMax: priceMax ? parseFloat(priceMax) : null,
      currency,
      status: 'DRAFT'
    }
  });

  revalidatePath('/supplier/products');
  return product;
}

// Update product
export async function updateProduct(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const supplier = await getSupplierProfile();
  if (!supplier) throw new Error('Supplier not found');

  const productId = formData.get('productId') as string;
  const name = formData.get('name') as string;
  const categoryId = formData.get('categoryId') as string;
  const summary = formData.get('summary') as string | null;
  const description = formData.get('description') as string | null;
  const brand = formData.get('brand') as string | null;
  const model = formData.get('model') as string | null;
  const priceMin = formData.get('priceMin') as string | null;
  const priceMax = formData.get('priceMax') as string | null;
  const status = formData.get('status') as ProductStatus | null;

  // Verify product belongs to supplier
  const product = await prisma.product.findFirst({
    where: { id: productId, supplierId: supplier.id }
  });
  if (!product) throw new Error('Product not found');

  await prisma.product.update({
    where: { id: productId },
    data: {
      name,
      categoryId,
      summary: summary ?? undefined,
      description: description ?? undefined,
      brand: brand ?? undefined,
      model: model ?? undefined,
      priceMin: priceMin ? parseFloat(priceMin) : null,
      priceMax: priceMax ? parseFloat(priceMax) : null,
      status: status ?? undefined
    }
  });

  revalidatePath('/supplier/products');
}

// Submit product for review
export async function submitProductForReview(productId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const supplier = await getSupplierProfile();
  if (!supplier) throw new Error('Supplier not found');

  const product = await prisma.product.findFirst({
    where: { id: productId, supplierId: supplier.id, status: 'DRAFT' }
  });
  if (!product) throw new Error('Product not found or not in draft status');

  await prisma.product.update({
    where: { id: productId },
    data: { status: 'PENDING_REVIEW' }
  });

  revalidatePath('/supplier/products');
}

// Delete product (soft delete)
export async function deleteProduct(productId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const supplier = await getSupplierProfile();
  if (!supplier) throw new Error('Supplier not found');

  const product = await prisma.product.findFirst({
    where: { id: productId, supplierId: supplier.id }
  });
  if (!product) throw new Error('Product not found');

  await prisma.product.update({
    where: { id: productId },
    data: { deletedAt: new Date() }
  });

  revalidatePath('/supplier/products');
}

// Get supplier's inquiries
export async function getSupplierInquiries(status?: InquiryStatus) {
  const session = await auth();
  if (!session?.user?.id) return [];

  const supplier = await getSupplierProfile();
  if (!supplier) return [];

  return prisma.inquiry.findMany({
    where: {
      supplierId: supplier.id,
      status: status ?? undefined
    },
    include: {
      product: { select: { name: true, slug: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
}

// Get product categories for form
export async function getProductCategories() {
  return prisma.productCategory.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    select: { id: true, name: true, slug: true }
  });
}

// Get single product for editing
export async function getProductForEdit(productId: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const supplier = await getSupplierProfile();
  if (!supplier) return null;

  return prisma.product.findFirst({
    where: { id: productId, supplierId: supplier.id, deletedAt: null },
    include: {
      category: true,
      images: { orderBy: { sortOrder: 'asc' } }
    }
  });
}