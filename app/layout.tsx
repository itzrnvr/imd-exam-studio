import type { Metadata } from "next";
import { headers } from "next/headers";
import { StudyShell } from "./components/StudyShell";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto")?.split(",")[0] ?? (host.includes("localhost") ? "http" : "https");
  const metadataBase = new URL(`${protocol}://${host}`);
  const description = "A complete, interactive Intelligent Model Design exam guide with visual numerical labs, practice questions, mock papers, and symbol-by-symbol explanations.";

  return {
    metadataBase,
    title: {
      default: "IMD Exam Studio",
      template: "%s | IMD Exam Studio",
    },
    description,
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      title: "IMD Exam Studio",
      description,
      type: "website",
      images: [{ url: "/og.png", width: 1536, height: 1024, alt: "IMD Exam Studio interactive learning diagrams" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "IMD Exam Studio",
      description,
      images: ["/og.png"],
    },
  };
}

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
