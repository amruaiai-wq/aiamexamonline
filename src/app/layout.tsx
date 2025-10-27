// src/app/layout.tsx
import './globals.css';
import Link from 'next/link';
import AuthStatus from '@/components/AuthStatus';
import type { Metadata } from 'next';
import { Kanit } from 'next/font/google';

const kanit = Kanit({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin', 'thai'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AiAm Exam Practice | ระบบทำข้อสอบออนไลน์',
  description: 'ระบบทำข้อสอบออนไลน์ TOEIC, ภาค ก., และ A-Level พร้อมเฉลยละเอียดในโทนมินิมอล',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={kanit.className}>
      <body className="bg-white text-gray-800 antialiased">
        {/* ✅ Header */}
        <header className="border-b border-gray-200 bg-white">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-semibold text-indigo-700 hover:text-indigo-900 transition">
              AiAm Exam
            </Link>
            <AuthStatus />
          </div>
        </header>

        {/* ✅ Main Content */}
        <main className="min-h-[80vh] container mx-auto px-4 py-10">
          {children}
        </main>

        {/* ✅ Footer */}
        <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} AiAm Exam Practice
        </footer>
      </body>
    </html>
  );
}