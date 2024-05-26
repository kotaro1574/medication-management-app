/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "patient-faces.s3.ap-northeast-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "drugs-dev.s3.ap-northeast-1.amazonaws.com",
      },
    ],
  },
}

export default nextConfig
