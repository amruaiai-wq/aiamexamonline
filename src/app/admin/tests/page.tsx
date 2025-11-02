// src/app/admin/tests/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import TestActions from './TestActions'

export default async function AdminTestsPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // ตรวจสอบ Admin
  const { data: isAdmin } = await supabase
    .from('AdminUser')
    .select('*')
    .eq('email', user.email)
    .single()

  if (!isAdmin) redirect('/')

  // ดึงข้อสอบทั้งหมด
  const { data: tests } = await supabase
    .from('Tests')
    .select('*')
    .order('created_at', { ascending: false })

  // นับตาม category
  const toeicTests = tests?.filter(t => t.category === 'toeic').length || 0
  const pakKorTests = tests?.filter(t => t.category === 'pak-kor').length || 0
  const aLevelTests = tests?.filter(t => t.category === 'a-level').length || 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            📝 จัดการข้อสอบ
          </h1>
          <div className="flex gap-4">
            <Link
              href="/admin/upload"
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-semibold"
            >
              📤 Upload ข้อสอบใหม่
            </Link>
            <Link
              href="/admin"
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition font-semibold"
            >
              ← กลับ Dashboard
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
            <div className="text-3xl mb-2">🇬🇧</div>
            <div className="text-2xl font-bold">{toeicTests}</div>
            <div className="opacity-90">TOEIC Tests</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
            <div className="text-3xl mb-2">📋</div>
            <div className="text-2xl font-bold">{pakKorTests}</div>
            <div className="opacity-90">Pak Kor Tests</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
            <div className="text-3xl mb-2">🎓</div>
            <div className="text-2xl font-bold">{aLevelTests}</div>
            <div className="opacity-90">A-Level Tests</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold">{tests?.length || 0}</div>
            <div className="opacity-90">Total Tests</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-lg">
          <div className="flex gap-2 flex-wrap">
            <FilterButton label="ทั้งหมด" count={tests?.length || 0} active />
            <FilterButton label="TOEIC" count={toeicTests} />
            <FilterButton label="ภาค ก." count={pakKorTests} />
            <FilterButton label="A-Level" count={aLevelTests} />
          </div>
        </div>

        {/* Tests List */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    ชื่อข้อสอบ
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Subcategory
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    คำถาม
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    วันที่สร้าง
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {tests && tests.length > 0 ? (
                  tests.map((test) => (
                    <tr key={test.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        #{test.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          {test.title || `Test ${test.id}`}
                        </div>
                        {test.description && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                            {test.description}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <CategoryBadge category={test.category} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {test.subcategory || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300 rounded-full text-xs font-semibold">
                          {test.total_questions || 0} ข้อ
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(test.created_at).toLocaleDateString('th-TH')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <TestActions test={test} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center">
                      <span className="text-6xl mb-4 inline-block">📭</span>
                      <p className="text-gray-500 dark:text-gray-400 text-lg">
                        ยังไม่มีข้อสอบในระบบ
                      </p>
                      <Link
                        href="/admin/upload"
                        className="inline-flex items-center px-6 py-3 mt-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-semibold"
                      >
                        📤 Upload ข้อสอบแรก
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper Components
function FilterButton({ label, count, active = false }: any) {
  return (
    <button
      className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
        active
          ? 'bg-indigo-600 text-white'
          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
      }`}
    >
      {label} {count !== undefined && `(${count})`}
    </button>
  )
}

function CategoryBadge({ category }: any) {
  const configs: any = {
    'toeic': { label: 'TOEIC', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' },
    'pak-kor': { label: 'ภาค ก.', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300' },
    'a-level': { label: 'A-Level', color: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' },
  }

  const config = configs[category] || { label: category, color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
      {config.label}
    </span>
  )
}