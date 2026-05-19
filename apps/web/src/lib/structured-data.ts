import { PROJECT_NAME } from '@nongyechuhai/config';
import type { CmsPageContent, StorefrontProductDetail } from './storefront';

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:4000';
}

function absoluteUrl(path: string) {
  return new URL(path, getSiteUrl()).toString();
}

export function buildWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: PROJECT_NAME,
    url: getSiteUrl(),
    description:
      'Direct sourcing of premium Chinese agricultural products with buyer inquiry support, origin visibility, and end-to-end export delivery coordination.'
  };
}

export function buildOrganizationJsonLd(contactEmail: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: PROJECT_NAME,
    url: getSiteUrl(),
    email: contactEmail,
    description:
      'China agricultural export organization profile covering direct farm sourcing, supplier presentation, and coordinated export delivery support.'
  };
}

export function buildBreadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path)
    }))
  };
}

export function buildFaqJsonLd(faqItems: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  };
}

export function buildProductJsonLd(product: StorefrontProductDetail) {
  const offer = product.priceMinValue
    ? {
        '@type': 'AggregateOffer',
        lowPrice: product.priceMinValue,
        highPrice: product.priceMaxValue ?? product.priceMinValue,
        priceCurrency: product.currency,
        availability: 'https://schema.org/InStock',
        url: absoluteUrl(`/products/${product.slug}`)
      }
    : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.gallery.map((image) => image.url),
    description: product.summary,
    sku: product.model || product.slug,
    category: product.categoryName,
    brand: {
      '@type': 'Brand',
      name: product.supplierName
    },
    manufacturer: {
      '@type': 'Organization',
      name: product.supplierName,
      address: product.supplierLocation
    },
    additionalProperty: product.specHighlights.map((item) => ({
      '@type': 'PropertyValue',
      name: item.label,
      value: item.value
    })),
    offers: offer
  };
}

export function buildCmsPageJsonLd(page: CmsPageContent) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: page.title,
    url: absoluteUrl(`/${page.slug}`),
    description: page.excerpt,
    datePublished: page.publishedAtIso,
    inLanguage: page.locale
  };
}