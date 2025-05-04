import { ChatBot } from "@/components/ChatBot";
import { Header } from "@/components/Header";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

const openSans = Open_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'creg',
  description: 'Your central hub for all course registration needs',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={openSans.className}>
        <SessionProvider>
          <Header />
          <ChatBot />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
