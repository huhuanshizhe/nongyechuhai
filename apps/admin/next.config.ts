import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@nongyechuhai/auth', '@nongyechuhai/ui']
};

export default nextConfig;
