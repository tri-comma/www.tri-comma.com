import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import ReCaptchaProvider from "@/components/ReCaptchaProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tri-Comma | Enterprise Quality, Personal Agility",
  description: "大規模システムの堅牢さと、個人開発ならではのスピード感を両立し、お客様のビジネス課題を技術で解決します。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <GoogleAnalytics />
        <ReCaptchaProvider>
          {children}
        </ReCaptchaProvider>
      </body>
    </html>
  );
}
