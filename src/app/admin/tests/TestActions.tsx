// src/app/admin/tests/TestActions.tsx
'use client'

import { createSupabaseClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

export default function TestActions({ test }: any) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const supabase = createSupabaseClient()

  const handleDelete = async () => {
    if (!confirm(`ต้องการลบข้อสอบ "${test.title || `Test ${test.id}`}" หรือไม่?\n\n⚠️ การกระทำนี้ไม่สามารถย้อนกลับได้`)) {
      return
    }

    setLoading(true)
    try {
      // ลบ Questions ที่เกี่ยวข้องก่อน
      const { error: questionsError } = await supabase
        .from('Question')
        .delete()
        .eq('test_id', test.id)

      if (questionsError) throw questionsError

      // ลบ Test
      const { error: testError } = await supabase
        .from('Tests')
        .delete()
        .eq('id', test.id)

      if (testError) throw testError

      alert('✅ ลบข้อสอบสำเร็จ!')
      router.refresh()
    } catch (error) {
      console.error('Error:', error)
      alert('❌ เกิดข้อผิดพลาด: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-2 justify-end">
      <Link
        href={`/test/${test.id}`}
        className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900 transition text-xs font-semibold"
      >
        👁️ ดู
      </Link>
      <Link
        href={`/admin/tests/${test.id}/edit`}
        className="px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900 transition text-xs font-semibold"
      >
        ✏️ แก้ไข
      </Link>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="px-3 py-1.5 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900 transition text-xs font-semibold disabled:opacity-50"
      >
        {loading ? '...' : '🗑️ ลบ'}
      </button>
    </div>
  )
}