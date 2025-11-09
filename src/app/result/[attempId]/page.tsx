// src/app/result/[attemptId]/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface PageProps {
  params: {
    attemptId: string
  }
}

export default async function ResultPage({ params }: PageProps) {
  const supabase = await createSupabaseServerClient()

  console.log('🔍 Fetching attempt:', params.attemptId)

  // ดึงข้อมูลผลคะแนน
  const { data: attempt, error } = await supabase
    .from('TestAttempt')
    .select('*')
    .eq('id', params.attemptId)
    .single()

  console.log('📊 Attempt data:', attempt)
  console.log('❌ Error:', error)

  if (error) {
    console.error('Error loading attempt:', error)
  }

  if (!attempt) {
    console.error('No attempt found with ID:', params.attemptId)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            ไม่พบข้อมูลการทำข้อสอบ
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            ID: {params.attemptId}
          </p>
          <Link
            href="/categories"
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
          >
            ← กลับไปหน้าหลัก
          </Link>
        </div>
      </div>
    )
  }

  // ดึงข้อมูล Test
  const { data: test } = await supabase
    .from('Tests')
    .select('id, title, category, subcategory, total_questions')
    .eq('id', attempt.test_id)
    .single()

  console.log('📝 Test data:', test)

  // ดึงคำตอบทั้งหมด
  const { data: answers } = await supabase
    .from('UserAnswer')
    .select('*')
    .eq('attempt_id', params.attemptId)

  console.log('✍️ Answers:', answers)

  const correctCount = answers?.filter(a => a.is_correct).length || 0
  const totalQuestions = attempt.total_questions || test?.total_questions || 0
  const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0

  // คำนวณเวลาที่ใช้
  const startTime = new Date(attempt.start_time)
  const endTime = new Date(attempt.end_time || new Date())
  const timeDiff = Math.floor((endTime.getTime() - startTime.getTime()) / 1000)
  const minutes = Math.floor(timeDiff / 60)
  const seconds = timeDiff % 60

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Card หลัก */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border-t-4 border-indigo-600">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
              ผลลัพธ์การทำข้อสอบ
            </h1>
            <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
              <span className="text-2xl">🎯</span>
              <p className="text-lg font-semibold">
                {test?.title || 'ไม่ระบุชื่อข้อสอบ'}
              </p>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(attempt.start_time).toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>

          {/* คะแนน */}
          <div className="text-center mb-8 p-8 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl">
            <div className={`text-8xl font-bold mb-4 ${
              scorePercent >= 80 ? 'text-green-600' : 
              scorePercent >= 60 ? 'text-yellow-600' : 
              'text-red-600'
            }`}>
              {scorePercent}%
            </div>
            <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              ✓ ตอบถูก {correctCount}/{totalQuestions} ข้อ
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              ⏱️ ใช้เวลา {minutes > 0 ? `${minutes} นาที ` : ''}{seconds} วินาที
            </p>
          </div>

          {/* ข้อความกำลังใจ */}
          <div className="text-center mb-8 p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
            {scorePercent >= 80 ? (
              <>
                <div className="text-5xl mb-3">🎉</div>
                <h3 className="text-xl font-bold text-purple-900 dark:text-purple-300 mb-2">
                  เยี่ยมมาก!
                </h3>
                <p className="text-purple-700 dark:text-purple-400">
                  คุณทำได้ดีมาก! รักษาฟอร์มนี้ไว้นะ
                </p>
              </>
            ) : scorePercent >= 60 ? (
              <>
                <div className="text-5xl mb-3">💪</div>
                <h3 className="text-xl font-bold text-purple-900 dark:text-purple-300 mb-2">
                  ดีมาก!
                </h3>
                <p className="text-purple-700 dark:text-purple-400">
                  คุณทำได้ดี ลองทำอีกครั้งเพื่อเพิ่มคะแนน!
                </p>
              </>
            ) : (
              <>
                <div className="text-5xl mb-3">📚</div>
                <h3 className="text-xl font-bold text-purple-900 dark:text-purple-300 mb-2">
                  อย่าท้อแท้!
                </h3>
                <p className="text-purple-700 dark:text-purple-400">
                  ฝึกฝนต่อไป คุณจะทำได้ดีขึ้นแน่นอน!
                </p>
              </>
            )}
          </div>

          {/* ปุ่ม Action */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Link
              href={`/test/${attempt.test_id}`}
              className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-center hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
            >
              ทำใหม่อีกครั้ง
            </Link>
            <Link
              href={test ? `/categories/${test.category}/${test.subcategory}` : '/categories'}
              className="px-6 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold text-center hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              เลือกข้อสอบอื่น
            </Link>
          </div>

          {/* รายละเอียด */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-green-600 dark:text-green-400 font-semibold mb-1">
                  ✓ ตอบถูก
                </p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {correctCount} ข้อ
                </p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <p className="text-red-600 dark:text-red-400 font-semibold mb-1">
                  ✗ ตอบผิด
                </p>
                <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                  {totalQuestions - correctCount} ข้อ
                </p>
              </div>
            </div>
          </div>

          {/* Debug Info (ลบออกในโปรดักชั่น) */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <details className="text-xs text-gray-500">
              <summary className="cursor-pointer hover:text-gray-700">Debug Info</summary>
              <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded overflow-auto">
                {JSON.stringify({
                  attemptId: params.attemptId,
                  attempt: attempt,
                  test: test,
                  answersCount: answers?.length
                }, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      </div>
    </div>
  )
}