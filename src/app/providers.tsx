'use client'

import { ThemeProvider } from "next-themes";
import { NextUIProvider } from '@nextui-org/react'

export function Providers({ children }: { children?: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" attribute="class">
      <NextUIProvider>
        {children}
      </NextUIProvider>
    </ThemeProvider>
  )
}
