import type { Metadata } from "next";
import "./globals.css";

import { GeistSans } from "geist/font/sans";
import { Toaster } from "sonner";
import { TokenContextProvider } from "@/providers/token";

export const metadata: Metadata = {
  title: "Quillhub",
  description: "Unfold Your Imagination, Share Your Universe",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <TokenContextProvider>
        <body className={`${GeistSans.className} antialiased`}>{children}</body>
        <Toaster richColors closeButton />
      </TokenContextProvider>
    </html>
  );
}
