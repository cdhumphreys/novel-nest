import type { Metadata } from "next";
import { Inter } from "next/font/google";

import '@/globals.scss';
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  // title: "Novel Nest",
  // Disable indexing and following for errors pages
  robots: "noindex, nofollow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className + " min-h-screen flex flex-col"}>
        <ThemeProvider defaultTheme="system" attribute="class" enableSystem>
          <main className="flex flex-col flex-1">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
