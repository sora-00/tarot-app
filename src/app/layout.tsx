import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const baseUrl = "https://tarot-app-kappa.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "AIタロット占い",
  description: "あなたの悩みや疑問をタロットカードに聞いてみませんか？",
  icons: { icon: "/icon.png" },
  openGraph: {
    title: "AIタロット占い",
    description: "あなたの悩みや疑問をタロットカードに聞いてみませんか？",
    type: "website",
    url: baseUrl,
    images: [{ url: "/icon.png", alt: "AIタロット占い" }],
  },
  twitter: {
    card: "summary",
    title: "AIタロット占い",
    description: "あなたの悩みや疑問をタロットカードに聞いてみませんか？",
    images: [{ url: "/icon.png", alt: "AIタロット占い" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={"bg-background text-foreground"}>
        <Providers>
          {children}
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
