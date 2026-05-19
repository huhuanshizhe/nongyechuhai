import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@nongyechuhai/config', '@nongyechuhai/db', '@nongyechuhai/ui']
};

export default nextConfig;
