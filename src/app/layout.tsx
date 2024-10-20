import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/header";

import "./styles/globals.scss";
import "./styles/header.scss";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Novel Nest",
  description: "Cozy reading time ☕️📚",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
