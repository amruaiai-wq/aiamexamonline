// src/components/testimonials/TestimonialForm.tsx
'use client'

import { useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase/client'

export default function TestimonialForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
    category: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createSupabaseClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        alert('กรุณาเข้าสู่ระบบก่อนแสดงความคิดเห็น')
        return
      }

      const { error } = await supabase
        .from('Testimonial')
        .insert({
          user_name: user.email?.split('@')[0] || 'Anonymous',
          user_email: user.email,
          rating: formData.rating,
          comment: formData.comment,
          test_category: formData.category || null,
          is_approved: false
        })

      if (error) throw error

      alert('✅ ส่งความคิดเห็นสำเร็จ! รอการอนุมัติจากแอดมิน')
      setFormData({ rating: 5, comment: '', category: '' })
      setIsOpen(false)
    } catch (error) {
      console.error('Error:', error)
      alert('❌ เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Button to open form */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 font-semibold z-50 flex items-center gap-2"
      >
        <span className="text-2xl">💬</span>
        <span>แสดงความคิดเห็น</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                แสดงความคิดเห็น
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Rating */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  ให้คะแนน
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="text-4xl transition-transform hover:scale-125"
                    >
                      {star <= formData.rating ? '⭐' : '☆'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  ประเภทข้อสอบ (ถ้ามี)
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value="">ไม่ระบุ</option>
                  <option value="TOEIC">TOEIC</option>
                  <option value="Pak Kor">ภาค ก.</option>
                  <option value="A-Level">A-Level</option>
                </select>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  ความคิดเห็น
                </label>
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  required
                  rows={4}
                  placeholder="แชร์ประสบการณ์การใช้งานของคุณ..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'กำลังส่ง...' : 'ส่งความคิดเห็น'}
              </button>

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                ความคิดเห็นจะถูกตรวจสอบก่อนแสดงบนเว็บไซต์
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  )
}