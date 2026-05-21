import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@nongyechuhai/config', '@nongyechuhai/db', '@nongyechuhai/ui', '@nongyechuhai/ai', '@nongyechuhai/auth']
};

export default withNextIntl(nextConfig);