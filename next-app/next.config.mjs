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
      bodyParser: false, // Disable body parsing for metrics route
    },
  };
  
export default nextConfig;