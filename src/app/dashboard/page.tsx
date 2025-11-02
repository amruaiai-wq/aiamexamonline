// src/app/dashboard/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ScoreChart from './components/ScoreChart'
import SubjectPerformance from './components/SubjectPerformance'
import WeakAreas from './components/WeakAreas'

export default async function EnhancedDashboard() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // ดึงข้อมูลการทำข้อสอบทั้งหมด
  const { data: attempts } = await supabase
    .from('TestAttempt')
    .select(`
      id,
      test_id,
      score,
      total_questions,
      score_percent,
      time_spent_secs,
      created_at,
      user_identifier,
      Tests (
        title,
        category,
        subcategory,
        ExamSubcategory (
          name,
          ExamCategory (name)
        )
      ),
      UserAnswer (
        question_id,
        user_answer,
        is_correct
      )
    `)
    .eq('user_identifier', user.email)
    .order('created_at', { ascending: false })

  const validAttempts = attempts?.filter(
    (a: any) => a.score !== null && a.total_questions !== null && a.total_questions > 0
  ) || []

  // คำนวณสถิติรวม
  const totalAttempts = validAttempts.length
  const totalCorrect = validAttempts.reduce((sum: number, a: any) => sum + (a.score || 0), 0)
  const totalQuestions = validAttempts.reduce((sum: number, a: any) => sum + (a.total_questions || 0), 0)
  const avgPercent = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0
  const uniqueTestsDone = new Set(validAttempts.map((a: any) => a.test_id)).size

  // เตรียมข้อมูลสำหรับ Chart
  const scoreData = validAttempts
    .slice(0, 10)
    .reverse()
    .map((a: any, index: number) => ({
      name: `ครั้งที่ ${index + 1}`,
      score: a.score_percent || 0,
      date: new Date(a.created_at).toLocaleDateString('th-TH'),
    }))

  // จัดกลุ่มตามวิชา
  const subjectGroups = validAttempts.reduce((acc: any, attempt: any) => {
    const subject = attempt.Tests?.ExamSubcategory?.name || 'อื่นๆ'
    if (!acc[subject]) {
      acc[subject] = { totalScore: 0, totalQuestions: 0, attempts: 0 }
    }
    acc[subject].totalScore += attempt.score || 0
    acc[subject].totalQuestions += attempt.total_questions || 0
    acc[subject].attempts += 1
    return acc
  }, {})

  const subjectData = Object.entries(subjectGroups).map(([subject, data]: [string, any]) => ({
    subject: subject.length > 15 ? subject.substring(0, 15) + '...' : subject,
    average: data.totalQuestions > 0 ? (data.totalScore / data.totalQuestions) * 100 : 0,
    attempts: data.attempts,
  }))

  // คำนวณจุดอ่อน
  const weakAreasMap = new Map<string, { wrong: number, total: number }>()
  
  validAttempts.forEach((attempt: any) => {
    const subject = attempt.Tests?.ExamSubcategory?.name || 'อื่นๆ'
    attempt.UserAnswer?.forEach((answer: any) => {
      if (!answer.is_correct) {
        const current = weakAreasMap.get(subject) || { wrong: 0, total: 0 }
        weakAreasMap.set(subject, {
          wrong: current.wrong + 1,
          total: current.total + 1
        })
      } else {
        const current = weakAreasMap.get(subject) || { wrong: 0, total: 0 }
        weakAreasMap.set(subject, {
          wrong: current.wrong,
          total: current.total + 1
        })
      }
    })
  })

  const weakAreas = Array.from(weakAreasMap.entries())
    .map(([topic, data]) => ({
      topic,
      wrongCount: data.wrong,
      totalAttempts: data.total,
      percentage: (data.wrong / data.total) * 100
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950">
      <div className="container mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-2">
            ภาพรวมความคืบหน้า 📈
          </h1>
          <p className="text-xl text-indigo-600 dark:text-indigo-400">
            ยินดีต้อนรับกลับ, <span className="font-bold">{user.email}</span>
          </p>
        </div>

        {/* สรุปข้อมูล */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon="📊"
            label="คะแนนเฉลี่ย"
            value={`${avgPercent.toFixed(1)}%`}
            subtext={`จาก ${totalQuestions} ข้อ`}
            color="indigo"
          />
          <StatCard
            icon="📝"
            label="ชุดที่ทำแล้ว"
            value={`${uniqueTestsDone}`}
            subtext={`ทำซ้ำ ${totalAttempts - uniqueTestsDone} ครั้ง`}
            color="purple"
          />
          <StatCard
            icon="✅"
            label="ตอบถูก"
            value={`${totalCorrect}`}
            subtext={`คำถาม`}
            color="green"
          />
          <StatCard
            icon="⏱️"
            label="เวลาเฉลี่ย"
            value={`${Math.round(validAttempts.reduce((sum: number, a: any) => sum + (a.time_spent_secs || 0), 0) / totalAttempts) || 0}`}
            subtext="วินาที/ข้อสอบ"
            color="orange"
          />
        </div>

        {/* Charts */}
        {scoreData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <ScoreChart data={scoreData} />
            {subjectData.length > 0 && <SubjectPerformance data={subjectData} />}
          </div>
        )}

        {/* Weak Areas */}
        {weakAreas.length > 0 && (
          <div className="mb-8">
            <WeakAreas areas={weakAreas} />
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            กิจกรรมล่าสุด ({totalAttempts})
          </h3>

          {validAttempts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">ชุดข้อสอบ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">คะแนน</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">เวลา</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">วันที่ทำ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">การดำเนินการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {validAttempts.slice(0, 10).map((a: any) => (
                    <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900 dark:text-white">{a.Tests?.title || 'N/A'}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {a.Tests?.ExamSubcategory?.ExamCategory?.name} → {a.Tests?.ExamSubcategory?.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-bold ${getScoreColor(a.score_percent || 0)}`}>
                          {(a.score_percent || 0).toFixed(0)}%
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                          ({a.score}/{a.total_questions})
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {a.time_spent_secs || 0} วินาที
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(a.created_at).toLocaleDateString('th-TH')}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/result/${a.id}`}
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 font-medium"
                        >
                          ดูสรุป →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-10">
              ยังไม่พบผลการทำข้อสอบ
            </p>
          )}
        </div>

        {/* Back to Home */}
        <div className="mt-10 text-center">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 transition font-semibold"
          >
            ← กลับหน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  )
}

// Helper Components
function StatCard({ icon, label, value, subtext, color }: any) {
  const colors: any = {
    indigo: 'from-indigo-500 to-purple-500',
    purple: 'from-purple-500 to-pink-500',
    green: 'from-green-500 to-emerald-500',
    orange: 'from-orange-500 to-red-500',
  }

  return (
    <div className={`bg-gradient-to-br ${colors[color]} p-6 rounded-2xl shadow-lg text-white transform hover:scale-105 transition-transform`}>
      <div className="text-4xl mb-2">{icon}</div>
      <div className="text-sm opacity-90 mb-1">{label}</div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-xs opacity-75">{subtext}</div>
    </div>
  )
}

function getScoreColor(percent: number) {
  if (percent >= 80) return 'text-green-600 dark:text-green-400'
  if (percent >= 60) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-600 dark:text-red-400'
}