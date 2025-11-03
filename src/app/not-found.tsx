// src/app/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-950">
      <div className="text-center max-w-md mx-auto p-8">
        <span className="text-9xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 inline-block">
          404
        </span>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          ไม่พบหน้าที่ค้นหา
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          ขออภัย เราไม่พบหน้าที่คุณกำลังมองหา
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 font-semibold"
        >
          ← กลับหน้าหลัก
        </Link>
      </div>
    </div>
  )
}