import { Open_Sans } from 'next/font/google';
import "./globals.css";
import styles from "./page.module.css";
import type { Metadata } from "next";
import { ChatProvider } from "../context/ChatContext";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: 'creg',
  description: 'Your central hub for all course registration needs',
}

const open_sans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={open_sans.className}>
        <div className={styles.page}>
          <main>
            <ChatProvider>{children}</ChatProvider>
          </main>
        </div>
        <Analytics />
      </body>
    </html>
  )
}