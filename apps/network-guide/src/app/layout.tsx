import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { RootProvider } from "fumadocs-ui/provider/next";
import { OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/seo";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "零基础出海网络与数字生活指南 | OldSea",
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "OldSea 的零基础出海指南：科学上网、注册 Google 账号、海外手机号与海外支付实操。",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: SITE_NAME,
    images: [
      { url: OG_IMAGE, width: 1200, height: 630, alt: "Old Sea / Brett Lee" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <RootProvider>
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
