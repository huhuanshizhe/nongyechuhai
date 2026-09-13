import type { ReactNode } from 'react';
import { Link } from '../../../i18n/routing';
export const metadata = { robots: { index: false, follow: false } };
export default async function LegacyCatalogueLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const zh = locale === 'zh';
  return (
    <>
      <aside className="hp-wrap hp-notice hp-legacy-notice">
        <strong>{zh ? '原有业务目录' : 'Legacy supply catalogue'}</strong>
        <p>
          {zh
            ? '此处保留 Farmetra 原有商品与供应信息，产品可能来自青藏高原以外地区，不代表本次高原项目已纳入或核验的供给。'
            : 'This section preserves existing Farmetra products and supplier information, including origins outside the plateau. It does not represent verified supply for the new plateau project.'}
        </p>
        <Link href="/collections">
          {zh ? '查看高原选品方向 →' : 'Explore plateau sourcing directions →'}
        </Link>
      </aside>
      {children}
    </>
  );
}
