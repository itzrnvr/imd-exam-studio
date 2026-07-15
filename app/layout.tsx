import type { Metadata } from "next";
import { StudyShell } from "./components/StudyShell";
import "./globals.css";

// Every study page is self-contained; this lets static hosts such as GitHub
// Pages pre-render the full route tree at build time.
export const dynamic = "force-static";

const description =
  "A complete, interactive Intelligent Model Design exam guide with visual numerical labs, practice questions, mock papers, and symbol-by-symbol explanations.";
const assetBasePath = process.env.NEXT_PUBLIC_ASSET_BASE_PATH ?? "";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://imd-exam-studio.akakiansoul.chatgpt.site"),
  title: {
    default: "IMD Exam Studio",
    template: "%s | IMD Exam Studio",
  },
  description,
  icons: {
    icon: `${assetBasePath}/favicon.svg`,
    shortcut: `${assetBasePath}/favicon.svg`,
  },
  openGraph: {
    title: "IMD Exam Studio",
    description,
    type: "website",
    images: [{ url: `${assetBasePath}/og.png`, width: 1536, height: 1024, alt: "IMD Exam Studio interactive learning diagrams" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "IMD Exam Studio",
    description,
    images: [`${assetBasePath}/og.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StudyShell>{children}</StudyShell>
      </body>
    </html>
  );
}
