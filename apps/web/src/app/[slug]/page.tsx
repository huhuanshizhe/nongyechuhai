import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '../../components/JsonLd';
import {
  buildBreadcrumbJsonLd,
  buildCmsPageJsonLd,
  buildFaqJsonLd
} from '../../lib/structured-data';
import { getCmsPageBySlug } from '../../lib/storefront';

type CmsPageRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const revalidate = 300;

export async function generateMetadata({ params }: CmsPageRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getCmsPageBySlug(slug);

  if (!page) {
    return {
      title: 'Page not found'
    };
  }

  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription || page.excerpt
  };
}

export default async function CmsPageRoute({ params }: CmsPageRouteProps) {
  const { slug } = await params;
  const page = await getCmsPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <main className="page-shell">
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: page.title, path: `/${page.slug}` }
          ]),
          buildCmsPageJsonLd(page),
          ...(page.faqItems.length > 0 ? [buildFaqJsonLd(page.faqItems)] : [])
        ]}
      />

      <section className="section-block content-hero" data-rise="true">
        <div className="page-head">
          <span className="section-kicker">Editorial page</span>
          <h1 className="section-title">{page.title}</h1>
          <p className="catalog-intro">{page.excerpt}</p>
        </div>
        <div className="account-mini-meta">
          <span className="catalog-chip">Published {page.publishedAtLabel}</span>
          <div className="button-row">
            <Link className="button button--ghost" href="/products">
              Browse products
            </Link>
            <Link className="button" href="/rfq">
              Open RFQ desk
            </Link>
          </div>
        </div>
      </section>

      <section className="content-layout" data-rise="true">
        <article className="section-block content-prose">
          <div className="breadcrumb-row">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>{page.title}</span>
          </div>
          <div className="rich-copy" dangerouslySetInnerHTML={{ __html: page.contentHtml }} />
        </article>

        {page.faqItems.length > 0 ? (
          <aside className="section-block">
            <div className="section-head">
              <span className="section-kicker">Page FAQ</span>
              <h2 className="section-title">Supporting answers</h2>
            </div>
            <ul className="detail-faq">
              {page.faqItems.map((item) => (
                <li className="detail-spec-card" key={item.question}>
                  <strong>{item.question}</strong>
                  <span>{item.answer}</span>
                </li>
              ))}
            </ul>
          </aside>
        ) : null}
      </section>
    </main>
  );
}