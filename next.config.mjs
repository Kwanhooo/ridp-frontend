/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: "http",
                hostname: "49.235.111.245",
                port: "24672",
                pathname: "/**",
            },
        ],
    },
};

export default nextConfig;
