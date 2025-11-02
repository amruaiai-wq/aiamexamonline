'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // สร้าง QueryClient instance
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // ข้อมูลถือว่าเก่าหลังจาก 1 นาที
            staleTime: 60 * 1000,
            
            // เก็บข้อมูลใน cache ไว้ 5 นาที
            gcTime: 5 * 60 * 1000,
            
            // ลองใหม่ 2 ครั้งถ้า request ล้มเหลว
            retry: 2,
            
            // Refetch อัตโนมัติเมื่อ window focus กลับมา
            refetchOnWindowFocus: false,
            
            // Refetch อัตโนมัติเมื่อเชื่อมต่อ network กลับมา
            refetchOnReconnect: true,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools จะแสดงเฉพาะใน development mode */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}