// ✅ src/app/layout.tsx
import "./globals.css";
import Link from "next/link";
import { Metadata } from "next";
import { Kanit } from "next/font/google";
import { ThemeProvider } from "@/lib/theme-provider";
import ThemeToggle from "@/components/ThemeToggle";
import AuthStatus from "@/components/AuthStatus";
import { QueryProvider } from "@/lib/query-provider";

const kanit = Kanit({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "thai"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AiAm Exam Practice | ระบบทำข้อสอบออนไลน์",
  description:
    "ระบบทำข้อสอบออนไลน์ TOEIC, ภาค ก., และ A-Level พร้อมเฉลยละเอียดและสถิติส่วนบุคคล",
  keywords: ["ข้อสอบออนไลน์", "TOEIC", "ภาค ก", "A-Level", "เตรียมสอบ", "AiAm"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={kanit.className} suppressHydrationWarning>
      {/* ✅ bg + text color จะเปลี่ยนอัตโนมัติเมื่อเปลี่ยนธีม */}
      <body
        suppressHydrationWarning
        className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300 antialiased"
      >
        {/* ✅ ThemeProvider ครอบทุกหน้า */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryProvider>
            {/* ===== HEADER ===== */}
            <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm">
              <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link
                  href="/"
                  className="text-2xl font-semibold tracking-tight text-indigo-700 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 transition-colors"
                >
                  AiAm Exam
                </Link>

                {/* Right Side */}
                <div className="flex items-center gap-3">
                  <ThemeToggle />
                  <AuthStatus />
                </div>
              </div>
            </header>

            {/* ===== MAIN CONTENT ===== */}
            <main className="min-h-[80vh] container mx-auto px-4 py-6">
              {children}
            </main>

            {/* ===== FOOTER ===== */}
            <footer className="border-t border-gray-200 dark:border-gray-800 py-6 text-center text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900">
              <p>
                © {new Date().getFullYear()}{" "}
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  AiAm Exam Practice
                </span>{" "}
                | พัฒนาโดย{" "}
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  อัม
                </span>
              </p>
            </footer>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
