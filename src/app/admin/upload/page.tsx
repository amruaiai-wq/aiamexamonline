// src/app/admin/upload/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import UploadForm from './UploadForm'

export default async function AdminUploadPage() {
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            📤 Upload ข้อสอบ
          </h1>
          <Link
            href="/admin/tests"
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition font-semibold"
          >
            ← กลับรายการข้อสอบ
          </Link>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 mb-8 border-2 border-blue-200 dark:border-blue-800">
          <h3 className="text-xl font-bold text-blue-900 dark:text-blue-300 mb-4">
            📋 รูปแบบไฟล์ JSON
          </h3>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 font-mono text-sm overflow-x-auto">
            <pre className="text-gray-800 dark:text-gray-200">{`{
  "title": "TOEIC Listening Test 1",
  "description": "ทดสอบทักษะการฟัง Part 1-4",
  "category": "toeic",
  "subcategory": "listening",
  "difficulty": "medium",
  "time_limit_minutes": 45,
  "questions": [
    {
      "question_text": "What is the main topic?",
      "question_type": "multiple_choice",
      "choices": ["A", "B", "C", "D"],
      "correct_answer": "B",
      "explanation": "The answer is B because...",
      "order_num": 1
    }
  ]
}`}</pre>
          </div>
        </div>

        {/* Upload Form */}
        <UploadForm />

        {/* Tips */}
        <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-6 border-2 border-yellow-200 dark:border-yellow-800">
          <h3 className="text-lg font-bold text-yellow-900 dark:text-yellow-300 mb-3">
            💡 Tips
          </h3>
          <ul className="space-y-2 text-yellow-800 dark:text-yellow-300">
            <li>• ไฟล์ต้องเป็น JSON format ที่ถูกต้อง</li>
            <li>• category: "toeic", "pak-kor", "a-level"</li>
            <li>• question_type: "multiple_choice", "true_false", "fill_blank"</li>
            <li>• ระบบจะตรวจสอบความถูกต้องก่อน import</li>
          </ul>
        </div>
      </div>
    </div>
  )
}