import type { Metadata } from "next";
import "./globals.css";
import StoreProvider from "@/store/provider";
import { AuthorProvider } from "@/context/AuthorContext";
import TopNav from "@/components/TopNav";

export const metadata: Metadata = {
  title: "Blog Management System",
  description: "A full-featured blog management system built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <StoreProvider>
          <AuthorProvider>
            <TopNav />
            <main>{children}</main>
          </AuthorProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
