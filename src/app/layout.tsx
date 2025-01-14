import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/header";
import '@/globals.scss';
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Novel Nest",
  description: "Your cozy digital reading nook - discover, track and share your favorite books in a warm, welcoming community",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className + " min-h-screen flex flex-col"}>
        <ThemeProvider defaultTheme="system" attribute="class" enableSystem>
          <Header />
          <main className="flex flex-col flex-1">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
