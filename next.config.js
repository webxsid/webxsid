/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/blog",
        destination: "https://blog.webxsid.com",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
