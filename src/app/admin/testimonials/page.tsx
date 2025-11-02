// src/app/admin/testimonials/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import TestimonialActions from './TestimonialActions'

export default async function AdminTestimonialsPage() {
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

  // ดึง Testimonials ทั้งหมด
  const { data: testimonials } = await supabase
    .from('Testimonial')
    .select('*')
    .order('created_at', { ascending: false })

  const pending = testimonials?.filter(t => !t.is_approved) || []
  const approved = testimonials?.filter(t => t.is_approved) || []

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            💬 จัดการ Testimonials
          </h1>
          <Link
            href="/admin"
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition font-semibold"
          >
            ← กลับ Dashboard
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-yellow-100 dark:bg-yellow-900/20 rounded-2xl p-6">
            <div className="text-3xl mb-2">⏳</div>
            <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-300">
              {pending.length}
            </div>
            <div className="text-yellow-700 dark:text-yellow-400">รอการอนุมัติ</div>
          </div>
          <div className="bg-green-100 dark:bg-green-900/20 rounded-2xl p-6">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold text-green-800 dark:text-green-300">
              {approved.length}
            </div>
            <div className="text-green-700 dark:text-green-400">อนุมัติแล้ว</div>
          </div>
          <div className="bg-indigo-100 dark:bg-indigo-900/20 rounded-2xl p-6">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold text-indigo-800 dark:text-indigo-300">
              {testimonials?.length || 0}
            </div>
            <div className="text-indigo-700 dark:text-indigo-400">ทั้งหมด</div>
          </div>
        </div>

        {/* Pending Testimonials */}
        {pending.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              ⏳ รอการอนุมัติ ({pending.length})
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {pending.map((t) => (
                <TestimonialCard key={t.id} testimonial={t} isPending={true} />
              ))}
            </div>
          </div>
        )}

        {/* Approved Testimonials */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            ✅ อนุมัติแล้ว ({approved.length})
          </h2>
          {approved.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {approved.map((t) => (
                <TestimonialCard key={t.id} testimonial={t} isPending={false} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-10">
              ยังไม่มี Testimonials ที่อนุมัติแล้ว
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function TestimonialCard({ testimonial, isPending }: any) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
              {testimonial.user_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">
                {testimonial.user_name}
              </h3>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={
                      i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                    }
                  >
                    ⭐
                  </span>
                ))}
              </div>
            </div>
          </div>
          {testimonial.test_category && (
            <span className="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 rounded-full text-xs font-semibold mb-2">
              {testimonial.test_category}
            </span>
          )}
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isPending
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
              : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
          }`}
        >
          {isPending ? '⏳ Pending' : '✅ Approved'}
        </span>
      </div>

      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
        "{testimonial.comment}"
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(testimonial.created_at).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
        <TestimonialActions testimonial={testimonial} isPending={isPending} />
      </div>
    </div>
  )
}