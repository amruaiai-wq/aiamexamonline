'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ThemeProviderProps } from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"         // ✅ เพิ่มบรรทัดนี้
      defaultTheme="system"     // ✅ สอดคล้องกับ layout.tsx
      enableSystem={true}       // ✅ รองรับ system dark mode
      disableTransitionOnChange // ✅ ป้องกันจอแวบตอนเปลี่ยนธีม
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
