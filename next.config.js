/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {},
  output: 'export',
  basePath: '/controle-financeiro',
  experimental: {
    optimizePackageImports: ['recharts'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'sql.js': false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
