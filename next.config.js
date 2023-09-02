/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async redirects() {
    return [
      {
        source: "/blog",
        destination: "https://blog.webxsid.com",
        permanent: true,
      },
    ];
  },
  images: {
    domains: ["i.ibb.co"],
  },
};

module.exports = nextConfig;
