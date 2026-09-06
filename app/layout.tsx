import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// The interval is a runtime value the backend owns, so the static title does
// not name one — it would go stale the moment ROUND_MS changes.
const title = "Hotdog Rewards";
const description =
  "Hold $HDR and the treasury sends you $1.50 every round. One hot dog each, with a transaction hash for every one of them.";

export const metadata: Metadata = {
  title,
  description,
  applicationName: "Hotdog Rewards",
  openGraph: { title, description, type: "website", siteName: "Hotdog Rewards" },
  twitter: { card: "summary_large_image", title, description },
  icons: {
    // An emoji favicon needs no asset pipeline and no 404 when the CDN is cold.
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌭</text></svg>",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
