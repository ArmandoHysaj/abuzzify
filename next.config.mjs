// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
      appDir: true,
    },
    pageExtensions: ['tsx', 'ts'],
  };
  
  export default nextConfig;
  