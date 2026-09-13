import type { ReactNode } from 'react';
import { Link } from '../../../i18n/routing';
export const metadata = { robots: { index: false, follow: false } };

export default async function LegacyInquiryLayout({
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
        <strong>
          {zh ? '原有业务询盘入口' : 'Legacy business enquiry desk'}
        </strong>
        <p>
          {zh
            ? '此入口沿用原有供应商询盘流程。青藏高原项目的新采购需求，请使用专门的高原采购入口。'
            : 'This desk uses the existing supplier enquiry workflow. Please use the dedicated plateau sourcing desk for new plateau project briefs.'}
        </p>
        <Link href="/sourcing">
          {zh ? '进入高原采购需求 →' : 'Go to plateau sourcing →'}
        </Link>
      </aside>
      {children}
    </>
  );
}
