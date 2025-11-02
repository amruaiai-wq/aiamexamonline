// src/app/categories/toeic/listening/page.tsx
import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function TOEICListeningPage() {
  const supabase = await createSupabaseServerClient()

  // ดึงข้อสอบ Listening จาก Database
  const { data: tests, error } = await supabase
    .from('Tests')
    .select('id, title, description, difficulty, created_at')
    .eq('category', 'toeic')
    .eq('subcategory', 'listening')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-blue-900">
      <div className="container mx-auto px-6 py-16">
        {/* Back Button */}
        <Link 
          href="/categories/toeic" 
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium mb-8 transition-colors group"
        >
          <svg 
            className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          กลับไป TOEIC
        </Link>

        {/* Header Section */}
        <div className="text-center mb-16">
          <span className="text-7xl mb-6 inline-block">🎧</span>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            TOEIC Listening
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
            ฝึกทักษะการฟังภาษาอังกฤษ Part 1-4 พร้อมเฉลยละเอียด
          </p>
          <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full"></div>
        </div>

        {/* Test Parts Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12 max-w-5xl mx-auto">
          {[
            { part: 'Part 1', name: 'Photographs', count: '6 ข้อ' },
            { part: 'Part 2', name: 'Question-Response', count: '25 ข้อ' },
            { part: 'Part 3', name: 'Conversations', count: '39 ข้อ' },
            { part: 'Part 4', name: 'Talks', count: '30 ข้อ' },
          ].map((part, index) => (
            <div 
              key={part.part}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-md transform hover:scale-105 transition-transform"
            >
              <div className="font-bold text-blue-600 dark:text-blue-400 mb-1">{part.part}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">{part.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{part.count}</div>
            </div>
          ))}
        </div>

        {/* Tests List */}
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              ชุดข้อสอบทั้งหมด ({tests?.length || 0})
            </h2>
            
            {/* Filter - จะทำในอนาคต */}
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
                ทั้งหมด
              </button>
              <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                ง่าย
              </button>
              <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                ปานกลาง
              </button>
              <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                ยาก
              </button>
            </div>
          </div>

          {/* Tests Grid */}
          {error ? (
            <div className="text-center py-20 bg-red-50 dark:bg-red-900/20 rounded-3xl">
              <span className="text-6xl mb-4 inline-block">⚠️</span>
              <p className="text-red-600 dark:text-red-400 text-lg">
                เกิดข้อผิดพลาดในการโหลดข้อสอบ
              </p>
            </div>
          ) : tests && tests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tests.map((test, index) => (
                <Link
                  key={test.id}
                  href={`/test/${test.id}`}
                  className="group"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-400 dark:hover:border-blue-600 transform hover:-translate-y-2">
                    {/* Test Number Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 rounded-full text-sm font-bold">
                        ชุดที่ {index + 1}
                      </span>
                      
                      {/* Difficulty Badge */}
                      {test.difficulty && (
                        <DifficultyBadge level={test.difficulty as 'easy' | 'medium' | 'hard'} />
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {test.title || `TOEIC Listening Test ${index + 1}`}
                    </h3>

                    {/* Description */}
                    {test.description && (
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                        {test.description}
                      </p>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        100 คำถาม
                      </span>
                      <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold text-sm">
                        เริ่มทำข้อสอบ
                        <svg 
                          className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl">
              <span className="text-6xl mb-4 inline-block">📭</span>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                ยังไม่มีข้อสอบในส่วนนี้
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                กำลังเพิ่มข้อสอบเร็ว ๆ นี้
              </p>
            </div>
          )}
        </div>

        {/* Upload Section (สำหรับ Admin - จะทำใน Phase ต่อไป) */}
        <div className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white text-center shadow-xl max-w-5xl mx-auto">
          <h3 className="text-2xl font-bold mb-3">💡 Tips สำหรับการฝึก Listening</h3>
          <p className="text-indigo-100 text-lg max-w-2xl mx-auto">
            ฟังทีละ Part แล้วทำข้อสอบทันที เพื่อความเข้าใจที่ดีที่สุด
          </p>
        </div>
      </div>
    </div>
  )
}

// Difficulty Badge Component
function DifficultyBadge({ level }: { level: 'easy' | 'medium' | 'hard' }) {
  const configs = {
    easy: {
      label: 'ง่าย',
      icon: '🟢',
      className: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
    },
    medium: {
      label: 'ปานกลาง',
      icon: '🟡',
      className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
    },
    hard: {
      label: 'ยาก',
      icon: '🔴',
      className: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
    }
  }

  const config = configs[level] || configs.medium

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${config.className}`}>
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </span>
  )
}