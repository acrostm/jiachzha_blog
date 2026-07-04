import React from "react";

import { type Metadata, type Viewport } from "next";

import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { NODE_ENV } from "@/config";

import { ThemeProvider } from "@/providers";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { Console } from "@/components/console";
import { Favicon } from "@/components/favicon";
import { Fingerprint } from "@/components/fingerprint";
import { FutureShell } from "@/components/future-shell";

import { ImageAssets, NICKNAME, SLOGAN, WEBSITE } from "@/constants";
import "@/styles/global.css";

const noirCompatThemeScript = `
(() => {
  try {
    const root = document.documentElement;
    const darkMedia = window.matchMedia("(prefers-color-scheme: dark)");
    const resolveScheme = () => {
      const storedTheme = window.localStorage.getItem("theme");
      if (storedTheme === "dark" || storedTheme === "light") {
        return storedTheme;
      }
      return darkMedia.matches ? "dark" : "light";
    };
    const syncScheme = () => {
      const scheme = resolveScheme();
      const isDark = scheme === "dark";
      root.dataset.colorScheme = scheme;
      root.style.colorScheme = scheme;
      root.classList.toggle("dark", isDark);
      root.classList.toggle("light", !isDark);
    };
    syncScheme();
    if (darkMedia.addEventListener) {
      darkMedia.addEventListener("change", syncScheme);
    } else {
      darkMedia.addListener?.(syncScheme);
    }
    new MutationObserver(() => {
      const scheme = root.classList.contains("dark")
        ? "dark"
        : root.classList.contains("light")
          ? "light"
          : resolveScheme();
      root.dataset.colorScheme = scheme;
      root.style.colorScheme = scheme;
    }).observe(root, { attributes: true, attributeFilter: ["class"] });
  } catch {
    document.documentElement.dataset.colorScheme = "dark";
    document.documentElement.style.colorScheme = "dark";
  }
})();
`;

export const metadata: Metadata = {
  title: {
    template: `%s - ${WEBSITE}`,
    default: `${WEBSITE}`,
  },
  description: `${SLOGAN}`,
  keywords: NICKNAME,
};

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#050506" },
    { media: "(prefers-color-scheme: light)", color: "#f7f1e8" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="zh-CN"
      data-color-scheme="dark"
      style={{ colorScheme: "dark" }}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: noirCompatThemeScript }} />
        <link rel="icon" type="image/svg+xml" href={ImageAssets.logoDark} />
        {/*TODO*/}
        {/* Google Search Console 验证 */}
        <meta
          name="google-site-verification"
          content="DTiRVawomypV2iRoz9UUw2P0wAxnPs-kffJl6MNevdM"
        />
        <script
          defer
          src="https://umami.jiachz.com/script.js"
          data-website-id="56094296-ecd7-4340-bc0b-dfc93a182c75"
        ></script>
      </head>
      <body className="font-sans" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <FutureShell>
              {children}

              <Favicon />
              <Toaster />

              <Console />

              <Fingerprint />
            </FutureShell>
          </TooltipProvider>
        </ThemeProvider>
      </body>

      {/*TODO*/}
      {/* Google Analytics  */}
      {NODE_ENV === "production" && <GoogleAnalytics gaId="G-1MVP2JY3JG" />}
      <Analytics />
      <SpeedInsights />
    </html>
  );
}
