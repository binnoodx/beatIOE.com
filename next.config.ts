import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
   experimental: {
    // Add supported experimental options here if needed
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  /* config options here */
};

export default withFlowbiteReact(nextConfig);