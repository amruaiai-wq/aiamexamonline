// ✅ src/app/test-theme/layout.tsx
"use client";

import { ThemeProvider } from "@/lib/theme-provider";
import ThemeToggle from "@/components/ThemeToggle";

export default function TestThemeLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300 flex flex-col items-center justify-center gap-8"
      >
        {/* ✅ ครอบทุกหน้าในโหมดทดสอบ */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem forcedTheme={undefined}>
          <main className="flex flex-col items-center justify-center text-center gap-6">
            <h1 className="text-4xl font-bold">🎨 Dark Mode Debug Test</h1>

            <p className="text-gray-600 dark:text-gray-300">
              ลองกดปุ่มด้านล่างเพื่อเปลี่ยนธีม แล้วเปิด DevTools → Elements → ดูว่า{" "}
              <code className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm">html</code>{" "}
              มี <code>class="dark"</code> หรือไม่
            </p>

            {/* ปุ่มเปลี่ยนธีม */}
            <ThemeToggle />

            {/* ตัวอย่างการเปลี่ยนสี */}
            <div className="mt-10 flex gap-4">
              <div className="w-40 h-40 rounded-2xl bg-indigo-200 dark:bg-indigo-800 flex items-center justify-center font-bold">
                Box 1
              </div>
              <div className="w-40 h-40 rounded-2xl bg-pink-200 dark:bg-pink-800 flex items-center justify-center font-bold">
                Box 2
              </div>
              <div className="w-40 h-40 rounded-2xl bg-emerald-200 dark:bg-emerald-800 flex items-center justify-center font-bold">
                Box 3
              </div>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-10">
              ถ้าเปลี่ยนธีมแล้วพื้นหลัง + กล่องเปลี่ยนสี = ระบบทำงานสมบูรณ์ ✅
            </p>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
