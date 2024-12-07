import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // experimental: {
  //   ppr: 'incremental',
  // },
  images: {
    domains: ['images.unsplash.com'], // 允许从 Unsplash 加载图片
  },
};

export default nextConfig;
