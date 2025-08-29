import "./globals.css";
import { Inter } from "next/font/google";
import type React from "react";
import { ThemeProvider } from "@/providers/theme-provider";
import { AppProvider } from "@/contexts/app-context";
import { ClerkProvider } from "@clerk/nextjs";
import { UserProvider } from "@/contexts/userContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Bluecrest doc System ",
  description: "This is the official file management system of the Bluecrest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AppProvider>
              <UserProvider>{children} </UserProvider>
            </AppProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
