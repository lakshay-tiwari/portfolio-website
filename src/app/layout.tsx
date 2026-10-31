import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "@/index.css";
import { siteConfig } from "@/data/site";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.role}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.bio,
  applicationName: `${siteConfig.name} Portfolio`,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  keywords: [
    "Lakshya Tiwari",
    "Full-Stack Engineer",
    "AI Developer",
    "Software Engineer",
    "Next.js",
    "React",
    "TypeScript",
    "Node.js",
    "FastAPI",
    "Python",
    "Portfolio",
  ],
  alternates: {
    canonical: "./",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: `${siteConfig.name} Portfolio`,
    title: `${siteConfig.name} — ${siteConfig.role}`,
    description: siteConfig.bio,
    images: [
      {
        url: siteConfig.bannerImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — ${siteConfig.role}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.role}`,
    description: siteConfig.bio,
    creator: "@Lakshya_tiwari_",
    images: [siteConfig.bannerImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/images/profile_image.webp",
    shortcut: "/images/profile_image.webp",
    apple: "/images/profile_image.webp",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLMs.txt" />
        <link rel="alternate" type="application/json" href="/api/portfolio" title="Machine-Readable Portfolio API" />
        <link rel="alternate" type="text/markdown" href="/for-agents" title="AI Agent Portfolio" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var d="dark",s=localStorage.getItem("theme"),p=window.matchMedia("(prefers-color-scheme: dark)").matches,isDark=s==="dark"?!0:s==="light"?!1:d==="system"?p:d==="dark";document.documentElement.classList.toggle("dark",isDark)})();`,
          }}
        />
      </head>
      <body className="min-h-screen bg-white dark:bg-[#0a0a0f] text-gray-900 dark:text-gray-100 transition-colors duration-300 antialiased">
        <Navbar />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
