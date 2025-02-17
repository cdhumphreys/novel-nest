import { Inter } from "next/font/google";
import { Nav } from "./components/nav";
import '@/globals.scss';
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className + " min-h-screen flex flex-col"}>
        <SidebarProvider>
          <ThemeProvider defaultTheme="system" attribute="class" enableSystem>
            <Nav />
            <main className="flex flex-col flex-1">
              <SidebarTrigger />
              {children}
            </main>
          </ThemeProvider>
        </SidebarProvider>
      </body>
    </html>
  );
}
