/** @type {import('next').NextConfig} */

const nextConfig = {
	reactStrictMode: false, // can cause things to render twice
	webpack: config => {
		config.resolve.fallback = { fs: false };
		return config;
	},
};

module.exports = nextConfig;
