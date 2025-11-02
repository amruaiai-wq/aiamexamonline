// src/app/admin/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // ตรวจสอบว่าเป็น Admin หรือไม่
const { data: isAdmin, error: adminError } = await supabase
  .from('AdminUser')
  .select('*')
  .eq('email', user.email)
  .single()

// Debug: แสดง email ที่กำลังเช็ค
console.log('Current user email:', user.email)
console.log('Is admin?:', isAdmin)
console.log('Admin error?:', adminError)

if (!isAdmin) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl text-center max-w-md">
        <span className="text-6xl mb-4 inline-block">🚫</span>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Access Denied
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          คุณไม่มีสิทธิ์เข้าถึงหน้านี้
        </p>
        {/* Debug info */}
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-4 text-left">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Your email:</strong> {user.email}
          </p>
          <p className="text-sm text-red-600 dark:text-red-400">
            Email นี้ยังไม่ได้เพิ่มใน AdminUser table
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-semibold"
        >
          ← กลับหน้าหลัก
        </Link>
      </div>
    </div>
  )
}

  // ดึงสถิติ
  const { count: pendingTestimonials } = await supabase
    .from('Testimonial')
    .select('*', { count: 'exact', head: true })
    .eq('is_approved', false)

  const { count: totalTests } = await supabase
    .from('Tests')
    .select('*', { count: 'exact', head: true })

  const { count: totalUsers } = await supabase
    .from('TestAttempt')
    .select('user_identifier', { count: 'exact', head: true })

  const { data: recentTestimonials } = await supabase
    .from('Testimonial')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950">
      <div className="container mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
              🔧 Admin Dashboard
            </h1>
            <p className="text-xl text-indigo-600 dark:text-indigo-400">
              ยินดีต้อนรับ, <span className="font-bold">{user.email}</span>
            </p>
          </div>
          <Link
            href="/"
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition font-semibold"
          >
            ← กลับหน้าหลัก
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon="⏳"
            label="รอการอนุมัติ"
            value={pendingTestimonials || 0}
            subtext="Testimonials"
            color="yellow"
            link="/admin/testimonials"
          />
          <StatCard
            icon="📝"
            label="ชุดข้อสอบ"
            value={totalTests || 0}
            subtext="ทั้งหมด"
            color="blue"
            link="/admin/tests"
          />
          <StatCard
            icon="👥"
            label="ผู้ใช้งาน"
            value={totalUsers || 0}
            subtext="Unique Users"
            color="green"
            link="/admin/users"
          />
          <StatCard
            icon="⚙️"
            label="การตั้งค่า"
            value="—"
            subtext="Settings"
            color="purple"
            link="/admin/settings"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Recent Testimonials */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                📝 Testimonials ล่าสุด
              </h3>
              <Link
                href="/admin/testimonials"
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
              >
                ดูทั้งหมด →
              </Link>
            </div>

            {recentTestimonials && recentTestimonials.length > 0 ? (
              <div className="space-y-3">
                {recentTestimonials.map((t) => (
                  <div
                    key={t.id}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {t.user_name}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          t.is_approved
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                        }`}
                      >
                        {t.is_approved ? '✅ Approved' : '⏳ Pending'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {t.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-10">
                ยังไม่มี Testimonials
              </p>
            )}
          </div>

          {/* Quick Links */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              ⚡ Quick Actions
            </h3>
            <div className="space-y-3">
              <QuickLink
                href="/admin/testimonials"
                icon="💬"
                label="จัดการ Testimonials"
                description="อนุมัติ/ลบความคิดเห็น"
              />
              <QuickLink
                href="/admin/tests"
                icon="📋"
                label="จัดการข้อสอบ"
                description="เพิ่ม/แก้ไข/ลบข้อสอบ"
              />
              <QuickLink
                href="/admin/upload"
                icon="📤"
                label="Upload ข้อสอบ"
                description="อัพโหลดข้อสอบใหม่"
              />
              <QuickLink
                href="/admin/settings"
                icon="⚙️"
                label="การตั้งค่า"
                description="จัดการระบบ"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper Components
function StatCard({ icon, label, value, subtext, color, link }: any) {
  const colors: any = {
    yellow: 'from-yellow-500 to-orange-500',
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    purple: 'from-purple-500 to-pink-500',
  }

  return (
    <Link href={link}>
      <div
        className={`bg-gradient-to-br ${colors[color]} p-6 rounded-2xl shadow-lg text-white transform hover:scale-105 transition-transform cursor-pointer`}
      >
        <div className="text-4xl mb-2">{icon}</div>
        <div className="text-sm opacity-90 mb-1">{label}</div>
        <div className="text-3xl font-bold mb-1">{value}</div>
        <div className="text-xs opacity-75">{subtext}</div>
      </div>
    </Link>
  )
}

function QuickLink({ href, icon, label, description }: any) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition"
    >
      <span className="text-3xl">{icon}</span>
      <div>
        <div className="font-semibold text-gray-900 dark:text-white">{label}</div>
        <div className="text-sm text-gray-600 dark:text-gray-300">{description}</div>
      </div>
    </Link>
  )
}