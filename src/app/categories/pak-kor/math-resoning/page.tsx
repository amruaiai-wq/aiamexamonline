// src/app/categories/pak-kor/math-reasoning/page.tsx
import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function MathReasoningPage() {
  const supabase = await createSupabaseServerClient()

  const { data: tests, error } = await supabase
    .from('Tests')
    .select('id, title, description, difficulty, created_at')
    .eq('category', 'pak-kor')
    .eq('subcategory', 'math-reasoning')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900">
      <div className="container mx-auto px-6 py-16">
        <Link 
          href="/categories/pak-kor" 
          className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium mb-8 transition-colors group"
        >
          <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          กลับไป ภาค ก.
        </Link>

        <div className="text-center mb-16">
          <span className="text-7xl mb-6 inline-block">🧮</span>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            คณิตศาสตร์และเหตุผล
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
            ความสามารถในการคิดวิเคราะห์ แก้ปัญหา และเหตุผลเชิงตรรกะ
          </p>
          <div className="h-1 w-32 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
        </div>

        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            ชุดข้อสอบทั้งหมด ({tests?.length || 0})
          </h2>

          {error ? (
            <div className="text-center py-20 bg-red-50 dark:bg-red-900/20 rounded-3xl">
              <span className="text-6xl mb-4 inline-block">⚠️</span>
              <p className="text-red-600 dark:text-red-400 text-lg">เกิดข้อผิดพลาด</p>
            </div>
          ) : tests && tests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tests.map((test: any, index: number) => (
                <Link key={test.id} href={`/test/${test.id}`} className="group">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-purple-400 dark:hover:border-purple-600 transform hover:-translate-y-2">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 rounded-full text-sm font-bold">
                        ชุดที่ {index + 1}
                      </span>
                      {test.difficulty && <DifficultyBadge level={test.difficulty} />}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                      {test.title || `ข้อสอบชุดที่ ${index + 1}`}
                    </h3>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-gray-500 dark:text-gray-400">150 คำถาม</span>
                      <span className="text-purple-600 dark:text-purple-400 font-semibold text-sm">เริ่มทำข้อสอบ →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl">
              <span className="text-6xl mb-4 inline-block">📭</span>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">ยังไม่มีข้อสอบ</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DifficultyBadge({ level }: { level: string }) {
  const configs: any = {
    easy: { label: 'ง่าย', icon: '🟢', className: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' },
    medium: { label: 'ปานกลาง', icon: '🟡', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' },
    hard: { label: 'ยาก', icon: '🔴', className: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' }
  }
  const config = configs[level] || configs.medium
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${config.className}`}>
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </span>
  )
}