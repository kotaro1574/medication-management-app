/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "patient-faces.s3.ap-northeast-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "patient-drugs.s3.ap-northeast-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "patient-faces-stg.s3.ap-northeast-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "patient-drugs-stg.s3.ap-northeast-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "patient-faces-dev.s3.ap-northeast-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "patient-drugs-dev.s3.ap-northeast-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "user-faces-main.s3.ap-northeast-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "user-faces-stg.s3.ap-northeast-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "user-faces-dev.s3.ap-northeast-1.amazonaws.com",
      },
    ],
  },
}

export default nextConfig
