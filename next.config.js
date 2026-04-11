/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  serverExternalPackages: ['pdf-parse'],

  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig