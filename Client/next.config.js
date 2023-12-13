/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'api.skinformation.site',
                port: '',
                pathname: '/images/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '5100',
                pathname: '/images/**',
            },
        ],
    },
}

module.exports = nextConfig
