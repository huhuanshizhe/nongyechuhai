import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '../../../i18n/routing';
import { ProductCard } from '../../../components/ProductCard';
import { getCatalogPageData } from '../../../lib/storefront';

type ProductsPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    category?: string;
    mode?: string;
  }>;
};

export const revalidate = 300;

function buildCatalogHref(category?: string, mode?: string) {
  const params = new URLSearchParams();

  if (category) {
    params.set('category', category);
  }

  if (mode) {
    params.set('mode', mode);
  }

  const query = params.toString();
  return query ? `/products?${query}` : '/products';
}

export default async function ProductsPage({ params, searchParams }: ProductsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('products');
  const isZh = locale === 'zh';

  const resolvedSearchParams = await searchParams;
  const mode = resolvedSearchParams.mode === 'direct' || resolvedSearchParams.mode === 'inquiry'
    ? resolvedSearchParams.mode
    : undefined;
  const data = await getCatalogPageData({
    category: resolvedSearchParams.category,
    mode
  });

  const activeRouteSummary = data.activeMode === 'direct'
    ? (isZh ? '当前视图聚焦已展示参考定价及订单就绪商业包的产品线。' : 'The current view is focused on lines already presented with reference pricing and order-ready commercial packs.')
    : data.activeMode === 'inquiry'
      ? (isZh ? '当前视图聚焦需要通过资质确认、市场对接及买家简报开启的产品线。' : 'The current view is focused on lines that should begin through qualification, market alignment, and buyer briefing.')
      : (isZh ? '当前视图整合询盘驱动及直采项目，买家可在筛选路线前比较品类适配。' : 'The current view combines inquiry-led and direct-order programs so buyers can compare category fit before narrowing by route.');

  return (
    <main className="page-shell page-shell--catalog">
      <section className="portfolio-stage" data-rise="true">
        <div className="portfolio-stage__intro">
          <span className="section-kicker">{t('title')}</span>
          <h1 className="section-title">{isZh
            ? '按品类及商业路线组织的正式出口产品目录。'
            : 'A formal export portfolio organized by category and commercial route.'}
          </h1>
          <p className="catalog-intro">
            {isZh
              ? '使用品类及路线筛选从系列概览进入产品出口档案。每个产品标注是否应作为询盘讨论或直采审核开启。'
              : 'Use category and route filters to move from family overview to product export profile. Each listing signals whether it should begin as an inquiry discussion or a direct order review.'}
          </p>
          <div className="portfolio-stage__metrics">
            <article className="portfolio-stage__metric">
              <span>{isZh ? '全部发布产品' : 'All published lines'}</span>
              <strong>{data.modeCounts.all}</strong>
            </article>
            <article className="portfolio-stage__metric">
              <span>{isZh ? '询盘项目' : 'Inquiry programs'}</span>
              <strong>{data.modeCounts.inquiry}</strong>
            </article>
            <article className="portfolio-stage__metric">
              <span>{isZh ? '直采项目' : 'Direct order programs'}</span>
              <strong>{data.modeCounts.direct}</strong>
            </article>
          </div>
        </div>
        <aside className="portfolio-stage__filters">
          <div className="portfolio-stage__panel">
            <span className="pill">{isZh ? '商业路线' : 'Commercial route'}</span>
            <div className="filter-pills">
              <Link className={`filter-pill ${!data.activeMode ? 'filter-pill--active' : ''}`} href={buildCatalogHref(data.activeCategory?.slug)}>
                {isZh ? `全部路线 (${data.modeCounts.all})` : `All routes (${data.modeCounts.all})`}
              </Link>
              <Link className={`filter-pill ${data.activeMode === 'inquiry' ? 'filter-pill--active' : ''}`} href={buildCatalogHref(data.activeCategory?.slug, 'inquiry')}>
                {isZh ? `询盘项目 (${data.modeCounts.inquiry})` : `Inquiry programs (${data.modeCounts.inquiry})`}
              </Link>
              <Link className={`filter-pill ${data.activeMode === 'direct' ? 'filter-pill--active' : ''}`} href={buildCatalogHref(data.activeCategory?.slug, 'direct')}>
                {isZh ? `直采项目 (${data.modeCounts.direct})` : `Direct order programs (${data.modeCounts.direct})`}
              </Link>
            </div>
          </div>
          <div className="portfolio-stage__panel">
            <span className="pill">{isZh ? '当前视图' : 'Current view'}</span>
            <h2>{data.activeCategory ? `${data.activeCategory.name} ${isZh ? '产品目录' : 'portfolio'}` : (isZh ? '已发布出口产品目录' : 'Published export portfolio')}</h2>
            <p>{activeRouteSummary}</p>
          </div>
        </aside>
      </section>

      <section className="portfolio-layout" data-rise="true">
        <aside className="portfolio-rail">
          <div className="portfolio-rail__panel">
            <span className="section-kicker">{isZh ? '品类目录' : 'Category ledger'}</span>
            <div className="portfolio-category-list">
              <Link className={`portfolio-category-list__item ${!data.activeCategory ? 'portfolio-category-list__item--active' : ''}`} href={buildCatalogHref(undefined, data.activeMode ?? undefined)}>
                <span>00</span>
                <strong>{isZh ? '全部品类' : 'All categories'}</strong>
              </Link>
              {data.categories.map((category, index) => (
                <Link
                  className={`portfolio-category-list__item ${data.activeCategory?.slug === category.slug ? 'portfolio-category-list__item--active' : ''}`}
                  href={buildCatalogHref(category.slug, data.activeMode ?? undefined)}
                  key={category.slug}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{category.name}</strong>
                </Link>
              ))}
            </div>
          </div>
          <div className="portfolio-rail__panel">
            <span className="section-kicker">{isZh ? '目录说明' : 'Portfolio note'}</span>
            <strong>
              {data.activeCategory
                ? `${data.activeCategory.name} ${isZh ? '出口线' : 'export lane'}`
                : (isZh ? '产品目录概览' : 'Portfolio overview')}
            </strong>
            <p>
              {data.activeCategory?.description ||
                (isZh
                  ? '先浏览整体，再进入符合目标市场、包装形式及商业路线的产品系列。'
                  : 'Start broad, then narrow into the product family that matches your target market, pack format, and commercial route.')}
            </p>
          </div>
          {data.supplierPrograms.length > 0 ? (
            <div className="portfolio-rail__panel">
              <span className="section-kicker">{isZh ? '代表供应商项目' : 'Representative supplier programs'}</span>
              <strong>
                {data.activeCategory
                  ? (isZh ? `认证项目：${data.activeCategory.name}` : `Vetted programs in ${data.activeCategory.name}`)
                  : (isZh ? '当前目录视图认证项目' : 'Vetted programs in the current portfolio view')}
              </strong>
              <div className="stack">
                {data.supplierPrograms.map((supplier) => (
                  <article className="stack" key={`${supplier.name}-${supplier.location}`}>
                    <div>
                      <strong>{supplier.name}</strong>
                    </div>
                    <div className="button-row">
                      <span className="catalog-chip">{supplier.location}</span>
                      <span className="catalog-chip">{supplier.lineCount} {isZh ? '个发布产品' : 'published line'}{supplier.lineCount === 1 ? '' : (isZh ? '' : 's')}</span>
                      {supplier.isVerified ? <span className="catalog-chip">{isZh ? '认证项目' : 'Verified program'}</span> : null}
                    </div>
                    <p>{supplier.description}</p>
                  </article>
                ))}
              </div>
            </div>
          ) : null}
          <div className="portfolio-rail__panel">
            <span className="section-kicker">{isZh ? '视图优化目标' : 'What this view optimizes'}</span>
            <ul className="clean">
              <li>{isZh ? '买家打开详情前有清晰的产地及品类背景。' : 'Clear origin and category context before the buyer opens detail.'}</li>
              <li>{isZh ? '明确区分询盘驱动及直采产品线。' : 'Explicit distinction between inquiry-led and direct-order lines.'}</li>
              <li>{isZh ? '从产品浏览快速进入结构化询盘。' : 'Fast routing from portfolio review into structured buyer inquiry.'}</li>
            </ul>
          </div>
        </aside>

        <div className="portfolio-results">
          <div className="portfolio-results__head">
            <div className="page-head">
              <span className="section-kicker">{data.products.length} {isZh ? '个结果' : 'result'}{data.products.length === 1 ? '' : (isZh ? '' : 's')}</span>
              <h2 className="section-title">
                {data.activeCategory ? `${data.activeCategory.name} ${isZh ? '产品目录' : 'portfolio'}` : (isZh ? '已发布出口产品目录' : 'Published export portfolio')}
              </h2>
              <p className="catalog-intro">
                {data.activeMode === 'direct'
                  ? (isZh ? '这些产品线已包含参考定价及标准商业包，可进行直采审核。' : 'These lines already include reference pricing and standard commercial packs for direct order review.')
                  : data.activeMode === 'inquiry'
                    ? (isZh ? '这些产品线建议通过询盘中心开启，以便先确认目的地市场、规格及文档要求。' : 'These lines are better opened through the inquiry desk so destination market, specification, and documentation can be aligned first.')
                    : (isZh ? '选择符合买家简报定义程度的路线。' : 'Choose the route that best matches how far your buying brief is already defined.')}
              </p>
            </div>
            <Link className="button button--ghost" href="/rfq">
              {isZh ? '打开询盘中心' : 'Open inquiry desk'}
            </Link>
          </div>
          {data.products.length > 0 ? (
            data.productGroups.length > 0 ? (
              <div className="portfolio-group-stack">
                {data.productGroups.map((group) => (
                  <section className="portfolio-group" key={group.key}>
                    <div className="portfolio-group__head">
                      <span className="section-kicker">{group.products.length} {isZh ? '个产品线' : 'line'}{group.products.length === 1 ? '' : (isZh ? '' : 's')}</span>
                      <div>
                        <h3>{group.title}</h3>
                        <p>{group.description}</p>
                      </div>
                    </div>
                    <div className="product-grid product-grid--catalog">
                      {group.products.map((product) => (
                        <ProductCard key={product.slug} product={product} locale={locale} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              <div className="product-grid product-grid--catalog">
                {data.products.map((product) => (
                  <ProductCard key={product.slug} product={product} locale={locale} />
                ))}
              </div>
            )
          ) : (
            <div className="not-found-card">
              <span className="section-kicker">{isZh ? '暂无匹配' : 'No match yet'}</span>
              <h3>{isZh ? '当前筛选条件下没有已发布产品。' : 'There are no published products for this filter combination.'}</h3>
              <p>{isZh ? '尝试扩大品类范围或切换到全部商业路线。' : 'Try widening the category or switching back to all commercial routes.'}</p>
              <div className="button-row">
                <Link className="button" href="/products">
                  {isZh ? '重置筛选' : 'Reset filters'}
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}