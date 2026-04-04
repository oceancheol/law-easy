import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "법령이지 (LawEasy) - 누구나 쉽게 찾는 대한민국 법률",
  description:
    "대한민국 법령, 판례, 신구대조를 쉽고 빠르게 검색하세요. 법제처 공식 데이터 기반 공공서비스.",
  keywords: ["법령", "법률", "판례", "신구대조", "법제처", "법령검색"],
  openGraph: {
    title: "법령이지 (LawEasy)",
    description: "누구나 쉽게 찾는 대한민국 법률",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
