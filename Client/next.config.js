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
        ],
    },
}

module.exports = nextConfig
