import "@uploadthing/react/styles.css";
import type { Metadata } from "next";
import "./globals.css";

import { GeistSans } from "geist/font/sans";
import { Toaster } from "sonner";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "QuillHub",
  description: "Unfold Your Imagination, Share Your Universe",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${GeistSans.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
      <Toaster richColors closeButton />
    </html>
  );
}
