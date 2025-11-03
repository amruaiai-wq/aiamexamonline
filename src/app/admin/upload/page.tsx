// src/app/admin/upload/UploadForm.tsx
'use client'

import { createSupabaseClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Question {
  question_text: string
  question_type: string
  choices: string[] | null
  correct_answer: string
  explanation: string | null
  order_num: number
}

interface TestData {
  title: string
  description?: string
  category: string
  subcategory?: string
  difficulty?: string
  time_limit_minutes?: number
  questions: Question[]
}

export default function UploadForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<TestData | null>(null)
  const supabase = createSupabaseClient()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)

    // Read and preview JSON
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string)
        setPreview(json)
      } catch (error) {
        alert('❌ ไฟล์ JSON ไม่ถูกต้อง')
        setFile(null)
        setPreview(null)
      }
    }
    reader.readAsText(selectedFile)
  }

  const handleUpload = async () => {
    if (!preview) {
      alert('❌ กรุณาเลือกไฟล์')
      return
    }

    setLoading(true)

    try {
      // Validate data
      if (!preview.title || !preview.category || !preview.questions) {
        throw new Error('ข้อมูลไม่ครบถ้วน')
      }

      // Insert Test
      const { data: test, error: testError } = await supabase
        .from('Tests')
        .insert({
          title: preview.title,
          description: preview.description || null,
          category: preview.category,
          subcategory: preview.subcategory || null,
          difficulty: preview.difficulty || 'medium',
          time_limit_minutes: preview.time_limit_minutes || null,
          total_questions: preview.questions.length,
        })
        .select()
        .single()

      if (testError) throw testError

      // Insert Questions
      const questionsToInsert = preview.questions.map((q, index) => ({
        test_id: test.id,
        question_text: q.question_text,
        question_type: q.question_type || 'multiple_choice',
        choices: q.choices || null,
        correct_answer: q.correct_answer,
        explanation: q.explanation || null,
        order_num: q.order_num || index + 1,
      }))

      const { error: questionsError } = await supabase
        .from('Question')
        .insert(questionsToInsert)

      if (questionsError) throw questionsError

      alert(`✅ Upload สำเร็จ! เพิ่มข้อสอบ ${preview.questions.length} ข้อ`)
      router.push('/admin/tests')
    } catch (error) {
      console.error('Error:', error)
      alert('❌ เกิดข้อผิดพลาด: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        เลือกไฟล์ JSON
      </h3>

      {/* File Input */}
      <div className="mb-6">
        <label className="block w-full">
          <input
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 dark:text-gray-400
              file:mr-4 file:py-3 file:px-6
              file:rounded-xl file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100
              dark:file:bg-indigo-900/50 dark:file:text-indigo-300
              dark:hover:file:bg-indigo-900
              cursor-pointer"
          />
        </label>
      </div>

      {/* Preview */}
      {preview && (
        <div className="mb-6">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            📋 Preview
          </h4>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 space-y-3">
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-300">ชื่อ:</span>{' '}
              <span className="text-gray-900 dark:text-white">{preview.title}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-300">Category:</span>{' '}
              <span className="text-gray-900 dark:text-white">{preview.category}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-300">จำนวนข้อ:</span>{' '}
              <span className="text-gray-900 dark:text-white">{preview.questions?.length || 0}</span>
            </div>
            {preview.description && (
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">คำอธิบาย:</span>{' '}
                <span className="text-gray-900 dark:text-white">{preview.description}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!preview || loading}
        className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {loading ? '🔄 กำลัง Upload...' : '📤 Upload ข้อสอบ'}
      </button>
    </div>
  )
}