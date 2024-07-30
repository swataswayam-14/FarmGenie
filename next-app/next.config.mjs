/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'standalone',
  experimental: {
    outputStandalone: true,
  },
  api: {
    bodyParser: false, 
  },
  images: {
    domains: ['m.media-amazon.com'], 
  },
};

export default nextConfig;