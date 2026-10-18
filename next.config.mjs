/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
    eslint: {
        ignoreDuringBuilds: true
    },
    async redirects() {
        return [
            { source: '/home', destination: '/', permanent: true },
            { source: '/gameplay', destination: '/wiki/gameplay', permanent: true },
            { source: '/game', destination: '/wiki', permanent: false },
            { source: '/rivals', destination: '/wiki/rivals', permanent: true },
            { source: '/rivals/:id', destination: '/wiki/rivals/:id', permanent: true },
            { source: '/portal', destination: '/portal/login', permanent: false },
            { source: '/portal/reset-password', destination: '/portal/forgot', permanent: true },
            { source: '/login', destination: '/portal/login', permanent: false },
            { source: '/register', destination: '/portal/register', permanent: false },
        ];
    },
};

export default nextConfig;
