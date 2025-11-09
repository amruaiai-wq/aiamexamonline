'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import QuestionRenderer from './question-renderer';

export default function TestPage() {
  const { testId } = useParams();
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [test, setTest] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // ✅ โหลดข้อมูลชุดข้อสอบเท่านั้น (ไม่สร้าง attempt ที่นี่)
  useEffect(() => {
    const initTest = async () => {
      if (!testId || testId === 'undefined') {
        setError('ไม่พบ Test ID');
        setLoading(false);
        return;
      }

      // โหลดข้อมูลชุดข้อสอบ
      const { data: testData, error: testError } = await supabase
        .from('Tests')
        .select('id, title, description')
        .eq('id', testId)
        .single();

      if (testError || !testData) {
        console.error('Error loading test:', testError?.message);
        setError('ไม่พบข้อมูลชุดข้อสอบ');
        setLoading(false);
        return;
      }

      setTest(testData);
      setLoading(false);
    };

    initTest();
  }, [testId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        ⏳ กำลังโหลดข้อสอบ...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center">
        <p className="text-red-600 text-2xl mb-4">{error}</p>
        <button
          onClick={() => router.push('/')}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          กลับหน้าหลัก
        </button>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="text-center py-20 text-gray-500">
        ⚠️ ไม่สามารถเริ่มทำข้อสอบได้
      </div>
    );
  }

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-indigo-700">
        {test.title}
      </h1>
      {test.description && (
        <p className="text-center text-gray-600 mb-8">{test.description}</p>
      )}

      {/* ✅ Component ทำข้อสอบ - ไม่ส่ง attemptId เพราะให้ QuestionRenderer สร้างเอง */}
      <QuestionRenderer testId={testId as string} />
    </main>
  );
}