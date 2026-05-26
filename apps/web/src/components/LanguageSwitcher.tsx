'use client';

import { usePathname, useRouter } from '../i18n/routing';
import { useParams } from 'next/navigation';

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const currentLocale = params.locale as string;
  const nextLocale = currentLocale === 'zh' ? 'en' : 'zh';
  const switchLabel = currentLocale === 'zh' ? 'EN' : '中文';
  const ariaLabel = currentLocale === 'zh' ? 'Switch to English' : '切换到中文';

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="language-switcher">
      <button
        type="button"
        className="header-link header-link--locale"
        onClick={() => switchLocale(nextLocale)}
        aria-label={ariaLabel}
      >
        <svg className="language-switcher__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span className="language-switcher__label">{switchLabel}</span>
      </button>
    </div>
  );
}