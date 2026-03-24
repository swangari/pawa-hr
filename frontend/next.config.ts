import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: [
    "localhost:3000",
    "10.164.88.189",
    "10.164.88.189:3000",
    "http://10.164.88.189",
    "http://10.164.88.189:3000",
    "http://localhost:3000",
  ],
};

export default nextConfig;
