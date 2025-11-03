// src/app/admin/testimonials/TestimonialActions.tsx
'use client'

import { createSupabaseClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Testimonial {
  id: string
  user_name: string
  user_email: string
  rating: number
  comment: string
  test_category: string | null
  is_approved: boolean
  created_at: string
}

interface TestimonialActionsProps {
  testimonial: Testimonial
  isPending: boolean
}

export default function TestimonialActions({ testimonial, isPending }: TestimonialActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const supabase = createSupabaseClient()

  const handleApprove = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('Testimonial')
        .update({ is_approved: true })
        .eq('id', testimonial.id)

      if (error) throw error
      alert('✅ อนุมัติสำเร็จ!')
      router.refresh()
    } catch (error) {
      console.error('Error:', error)
      alert('❌ เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async () => {
    if (!confirm('ต้องการปฏิเสธและลบ testimonial นี้?')) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('Testimonial')
        .delete()
        .eq('id', testimonial.id)

      if (error) throw error
      alert('✅ ลบสำเร็จ!')
      router.refresh()
    } catch (error) {
      console.error('Error:', error)
      alert('❌ เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  const handleUnapprove = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('Testimonial')
        .update({ is_approved: false })
        .eq('id', testimonial.id)

      if (error) throw error
      alert('✅ ยกเลิกการอนุมัติสำเร็จ!')
      router.refresh()
    } catch (error) {
      console.error('Error:', error)
      alert('❌ เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-2">
      {isPending ? (
        <>
          <button
            onClick={handleApprove}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50 text-sm"
          >
            ✅ อนุมัติ
          </button>
          <button
            onClick={handleReject}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold disabled:opacity-50 text-sm"
          >
            ❌ ปฏิเสธ
          </button>
        </>
      ) : (
        <>
          <button
            onClick={handleUnapprove}
            disabled={loading}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition font-semibold disabled:opacity-50 text-sm"
          >
            ⏳ ยกเลิก
          </button>
          <button
            onClick={handleReject}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold disabled:opacity-50 text-sm"
          >
            🗑️ ลบ
          </button>
        </>
      )}
    </div>
  )
}