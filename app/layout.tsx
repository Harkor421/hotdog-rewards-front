import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const title = "COSTCO — a hot dog every five minutes";
const description =
  "Every five minutes the treasury pays $1 — one hot dog — to every wallet holding $COSTCO. The same dollar for everyone, with a transaction hash for each one.";

export const metadata: Metadata = {
  title,
  description,
  applicationName: "COSTCO",
  openGraph: { title, description, type: "website", siteName: "COSTCO" },
  twitter: { card: "summary_large_image", title, description },
  icons: {
    // An emoji favicon needs no asset pipeline and no 404 when the CDN is cold.
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌭</text></svg>",
  },
};

export const viewport: Viewport = {
  themeColor: "#08080a",
  colorScheme: "dark",
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
