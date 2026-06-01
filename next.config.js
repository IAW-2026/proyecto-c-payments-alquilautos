/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  productionBrowserSourceMaps: true,
};

module.exports = nextConfig;