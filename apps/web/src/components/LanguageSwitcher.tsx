'use client';

import { usePathname, useRouter } from '../i18n/routing';
import { useParams } from 'next/navigation';

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const currentLocale = params.locale as string;

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="language-switcher">
      {currentLocale === 'zh' ? (
        <button
          className="header-link"
          onClick={() => switchLocale('en')}
          aria-label="Switch to English"
        >
          <svg className="language-switcher__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
          EN
        </button>
      ) : (
        <button
          className="header-link"
          onClick={() => switchLocale('zh')}
          aria-label="切换到中文"
        >
          <svg className="language-switcher__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
          中文
        </button>
      )}
    </div>
  );
}