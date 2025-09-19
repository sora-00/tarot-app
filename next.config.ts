import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // public ディレクトリ配下のローカル画像を最適化対象に
    // remotePatterns を使う場合はここに追記
  },
  // production ビルド時の最適化
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
