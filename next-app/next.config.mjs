/** @type {import('next').NextConfig} */
const nextConfig = {
    swcMinify: true,
    eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
