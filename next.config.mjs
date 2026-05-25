/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.temanumkmkita.com",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
