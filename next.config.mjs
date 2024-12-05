/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "49.235.111.245",
        port: "19000",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
