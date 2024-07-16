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
  };
  
export default nextConfig;