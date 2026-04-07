import type { Metadata, Viewport } from "next";
import { Noto_Serif_KR } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const notoSerifKR = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-serif",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const SITE_URL = "https://law-easy-ruby.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "LawEasy - 누구나 쉽게 찾는 대한민국 법률",
    template: "%s | LawEasy",
  },
  description:
    "대한민국 법령, 판례, 신구대조를 쉽고 빠르게 검색하세요. 법제처 공식 데이터 기반 무료 법률 검색 서비스.",
  keywords: [
    "법령검색", "법률검색", "판례검색", "법령이지", "LawEasy",
    "법제처", "신구대조", "법률용어", "상황분석",
    "근로기준법", "민법", "형법", "주택임대차보호법",
    "대법원판례", "법률상담", "법률정보",
  ],
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "LawEasy - 누구나 쉽게 찾는 대한민국 법률",
    description: "법령·판례·신구대조·상황분석을 한곳에서! 법제처 공식 데이터 기반 무료 법률 검색 서비스.",
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: "LawEasy",
  },
  twitter: {
    card: "summary_large_image",
    title: "LawEasy - 누구나 쉽게 찾는 대한민국 법률",
    description: "법령·판례·신구대조·상황분석을 한곳에서! 법제처 공식 데이터 기반 무료 법률 검색 서비스.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  verification: {
    // Google Search Console 인증 후 여기에 추가
    // google: "인증코드",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`h-full antialiased ${notoSerifKR.variable}`}>
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "LawEasy",
              alternateName: "법령이지",
              url: SITE_URL,
              description: "대한민국 법령, 판례, 신구대조를 쉽고 빠르게 검색하는 무료 법률 검색 서비스",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
              publisher: {
                "@type": "Organization",
                name: "LawEasy",
                url: SITE_URL,
              },
            }),
          }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
