import NextBundleAnalyzer from "@next/bundle-analyzer";
import { withBotId } from "botid/next/config";

const withBundleAnalyzer = NextBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import("next").NextConfig} */
const config = {
  // build 阶段禁止 eslint
  eslint: { ignoreDuringBuilds: true },
  // build 阶段禁止 ts 类型检查
  typescript: {
    ignoreBuildErrors: true,
  },
  // Next.js 开发模式默认会开启 React Strict Mode，会渲染2次，我们不需要
  reactStrictMode: false,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.jiachz.com",
      },
      {
        protocol: "http",
        hostname: "**.jiachz.com",
      },
      {
        protocol: "https",
        hostname: "*",
      },
      {
        protocol: "http",
        hostname: "*",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
  experimental: {
    // 解决 next build 报错: Error [ERR_REQUIRE_ESM]: require() of ES Module shiki/dist/index.mjs not supported.
    // 参考 issue: https://github.com/vercel/next.js/issues/64434#issuecomment-2082964050
    // 参考 issue: https://github.com/vercel/next.js/issues/64434#issuecomment-2084270758
    optimizePackageImports: [
      "@radix-ui/react-alert-dialog",
      "@radix-ui/react-avatar",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-collapsible",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-label",
      "@radix-ui/react-navigation-menu",
      "@radix-ui/react-popover",
      "@radix-ui/react-scroll-area",
      "@radix-ui/react-select",
      "@radix-ui/react-separator",
      "@radix-ui/react-slot",
      "@radix-ui/react-switch",
      "@radix-ui/react-tooltip",
      "gsap",
      "lodash-es",
      "lucide-react",
      "shiki",
    ],
  },
};

export default withBotId(withBundleAnalyzer(config));
