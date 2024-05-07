/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {},
  images: {
    domains: ["patient-faces.s3.ap-northeast-1.amazonaws.com"],
  },
}

export default nextConfig
