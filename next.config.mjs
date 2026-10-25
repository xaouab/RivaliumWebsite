/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
    eslint: {
        ignoreDuringBuilds: true
    },
    // Baseline security headers (no CSP yet: Next's inline scripts would need nonces first).
    async headers() {
        return [{
            source: '/:path*',
            headers: [
                { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
                { key: 'X-Content-Type-Options', value: 'nosniff' },
                { key: 'X-Frame-Options', value: 'DENY' },
                { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
            ],
        }];
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
            { source: '/wiki/mechanics/orbs', destination: '/wiki/mechanics/elements', permanent: true },
            { source: '/privacy', destination: '/legal/privacy', permanent: true },
            { source: '/terms', destination: '/legal/terms', permanent: true },
            { source: '/cookies', destination: '/legal/privacy#7-cookies-and-tracking-technologies', permanent: false },
        ];
    },
};

export default nextConfig;
