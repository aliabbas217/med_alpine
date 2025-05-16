import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images:{
    dangerouslyAllowSVG: true,
    domains: ["lh3.googleusercontent.com"],

  }
};

export default nextConfig;
