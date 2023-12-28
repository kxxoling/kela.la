"use client"
import { Inter } from 'next/font/google'

import { Providers } from "./providers";
import './globals.css'
import { Header } from "./_components/header";

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // suppressHydrationWarning introduced by next-themes ThemeProvider
    <html suppressHydrationWarning>
      <head>
        <title>
          崩坏·星穹铁道跃迁分析
        </title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="崩坏·星穹铁道跃迁分析" />
        <meta name="author" content="kxxoling" />
        <meta name="keywords" content="崩坏,星穹铁道,跃迁分析,抽卡分析,抽卡记录,跃迁记录" />
        <meta name="theme-color" content="#000000" />
        <meta name="robots" content="index,follow" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen text-foreground bg-background">
          <Providers>
            <Header />
            <main className='p-8'>
              {children}
            </main>
          </Providers>
        </div>
      </body>
    </html>
  )
}
