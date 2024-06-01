/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
        hostname: "patient-faces-localhost.s3.ap-northeast-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "patient-drugs-localhost.s3.ap-northeast-1.amazonaws.com",
      },
    ],
  },
}

export default nextConfig
