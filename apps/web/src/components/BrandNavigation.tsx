'use client';
import { useState } from 'react';
import { Link, usePathname } from '../i18n/routing';
import { BrandSignature } from './BrandSignature';
import { LanguageSwitcher } from './LanguageSwitcher';
export function BrandNavigation({ locale }: { locale: string }) {
  const zh = locale === 'zh';
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const links = [
    ['/collections', zh ? '高原产品' : 'Our products'],
    ['/about', zh ? '产地故事' : 'Our origins'],
    ['/services', zh ? '服务与支持' : 'How we help'],
    ['/partners', zh ? '合作伙伴' : 'Our partners'],
    ['/buying-guide', zh ? '采购指南' : 'Buying guide'],
  ];
  return (
    <header className="ft-header">
      <div className="ft-container ft-header__inner">
        <Link
          href="/"
          aria-label="Farmetra home"
          className="ft-logo"
          onClick={() => setOpen(false)}
        >
          <BrandSignature locale={locale} />
        </Link>
        <button
          className="ft-menu"
          type="button"
          aria-expanded={open}
          aria-controls="brand-navigation"
          aria-label={zh ? '展开导航' : 'Toggle navigation'}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
        </button>
        <nav
          id="brand-navigation"
          className={`ft-nav ${open ? 'is-open' : ''}`}
          aria-label={zh ? '主要导航' : 'Main navigation'}
        >
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname.startsWith(href) ? 'page' : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="ft-header__actions">
          <LanguageSwitcher />
          <Link className="ft-button ft-button--compact" href="/sourcing">
            {zh ? '联系我们' : 'Let’s talk'}
          </Link>
        </div>
      </div>
    </header>
  );
}
