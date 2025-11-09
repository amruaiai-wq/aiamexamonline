// app/categories/pak-kor/math-reasoning/page.tsx
import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function MathReasoningPage() {
  const supabase = await createSupabaseServerClient()

  // ดึงข้อสอบจาก Database
  const { data: tests, error } = await supabase
    .from('Tests')
    .select('*')
    .eq('category', 'pak-kor')
    .eq('subcategory', 'math-reasoning')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error:', error)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <nav className="text-sm mb-4 text-gray-600 dark:text-gray-400">
            <Link href="/categories" className="hover:text-indigo-600">หมวดหมู่</Link>
            <span className="mx-2">→</span>
            <Link href="/categories/pak-kor" className="hover:text-indigo-600">ข้อสอบ ภาค ก.</Link>
            <span className="mx-2">→</span>
            <span className="text-gray-900 dark:text-white font-semibold">คณิตศาสตร์และเหตุผล</span>
          </nav>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            คณิตศาสตร์และเหตุผล
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {tests && tests.length > 0 ? `มีข้อสอบทั้งหมด ${tests.length} ชุด` : 'กำลังเตรียมข้อสอบ...'}
          </p>
        </div>

        {/* ถ้าไม่มีข้อสอบ */}
        {(!tests || tests.length === 0) && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-8 text-center">
            <p className="text-lg mb-4">😅 ยังไม่มีข้อสอบในหมวดนี้</p>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              กำลังเตรียมข้อสอบคุณภาพสูงให้คุณฝึกทำ
            </p>
            <Link
              href="/categories/pak-kor"
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
            >
              ← กลับไปเลือกหมวดอื่น
            </Link>
          </div>
        )}

        {/* Test Grid */}
        {tests && tests.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test) => (
              <Link
                key={test.id}
                href={`/test/${test.id}`}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 hover:border-indigo-500 group"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 transition">
                  {test.title}
                </h3>

                {test.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {test.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <span>📝</span>
                    <span>{test.total_questions} ข้อ</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>⏱️</span>
                    <span>{test.time_limit_minutes} นาที</span>
                  </div>
                </div>

                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  test.difficulty === 'easy' 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : test.difficulty === 'hard'
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}>
                  {test.difficulty === 'easy' ? '🟢 ง่าย' : test.difficulty === 'hard' ? '🔴 ยาก' : '🟡 ปานกลาง'}
                </span>

                <div className="mt-4">
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm group-hover:underline">
                    เริ่มทำข้อสอบ →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export const metadata = {
  title: 'คณิตศาสตร์และเหตุผล - ข้อสอบ ภาค ก. | ข้อสอบออนไลน์',
  description: 'ทำข้อสอบคณิตศาสตร์และเหตุผล ภาค ก. ฟรี พร้อมเฉลยละเอียด'
}