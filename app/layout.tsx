import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://readme-gen-sable.vercel.app"
  ),
  title: "ReadmeGen – AI-powered README generator",
  description:
    "Generate professional README files from any GitHub repo in seconds. Paste a repo URL and get a polished README with badges, install instructions, and usage examples. Free to try.",
  keywords: [
    "readme generator",
    "ai readme",
    "github readme generator",
    "auto readme",
    "documentation generator",
    "ai documentation",
  ],
  openGraph: {
    title: "ReadmeGen – AI-powered README generator",
    description:
      "Paste a GitHub repo URL, get a professional README.md in seconds. Free to try, no signup needed.",
    type: "website",
    url: "/",
    siteName: "ReadmeGen",
  },
  twitter: {
    card: "summary_large_image",
    title: "ReadmeGen – AI-powered README generator",
    description:
      "Paste a GitHub repo URL, get a professional README.md in seconds. Free to try, no signup needed.",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "ReadmeGen",
              description:
                "AI-powered README generator. Paste a GitHub repo URL and get a professional README in seconds.",
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Web Browser",
              url: "https://readme-gen-sable.vercel.app",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              featureList: [
                "AI-generated README files",
                "GitHub repo URL input",
                "Badges and shields",
                "Install instructions",
                "Usage examples",
              ],
            }),
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
