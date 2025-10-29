'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

// ✅ Interface ที่ตรงกับข้อมูลจริงจาก Supabase
interface TestItem {
  title: string;
}

interface TestAttempt {
  id: string;
  score: number;
  total_questions: number;
  score_percent: number;
  created_at: string;
  Tests: TestItem[]; // 🟢 ต้องเป็น array
}

export default function ResultPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const supabase = createClient();

  const [result, setResult] = useState<TestAttempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from('TestAttempt')
        .select(
          `
          id,
          score,
          total_questions,
          score_percent,
          created_at,
          Tests ( title )
        `
        )
        .eq('id', id)
        .single();

      if (error) {
        console.error('❌ Error loading result:', error.message);
        setErrorMessage(error.message);
        setResult(null);
      } else {
        // 🟢 แปลง type ให้ TypeScript เข้าใจว่า Tests เป็น array
        const fixedData: TestAttempt = {
          ...data,
          Tests: Array.isArray(data.Tests) ? data.Tests : [data.Tests],
        };
        setResult(fixedData);
      }

      setLoading(false);
    };

    fetchResult();
  }, [id]);

  if (loading)
    return (
      <div className="text-center text-gray-500 py-20">
        กำลังโหลดผลลัพธ์...
      </div>
    );

  if (errorMessage)
    return (
      <div className="text-center text-red-500 py-20">
        <h2 className="text-2xl font-bold mb-4">🚨 โหลดข้อมูลไม่สำเร็จ</h2>
        <p>{errorMessage}</p>
        <button
          onClick={() => router.push('/')}
          className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          ← กลับหน้าหลัก
        </button>
      </div>
    );

  if (!result)
    return (
      <div className="text-center text-red-500 py-20">
        <h2 className="text-2xl font-bold mb-4">🚨 ไม่พบผลลัพธ์</h2>
        <p>ไม่พบข้อมูลชุดข้อสอบที่เลือก</p>
        <button
          onClick={() => router.push('/')}
          className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          ← กลับหน้าหลัก
        </button>
      </div>
    );

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-10 border-t-4 border-indigo-600">
      <h1 className="text-3xl font-bold text-indigo-700 mb-4">
        ผลลัพธ์การทำข้อสอบ
      </h1>

      <p className="text-lg text-gray-700 mb-2">
        🧩 ชุดข้อสอบ:{' '}
        <strong>{result.Tests?.[0]?.title || 'ไม่ระบุชื่อชุดข้อสอบ'}</strong>
      </p>

      <p className="text-lg text-gray-700 mb-2">
        ✅ คะแนนที่ได้:{' '}
        <strong>{result.score}</strong> / {result.total_questions}
      </p>

      <p className="text-lg text-gray-700 mb-2">
        📊 คิดเป็นเปอร์เซ็นต์:{' '}
        <strong>{result.score_percent.toFixed(1)}%</strong>
      </p>

      <p className="text-sm text-gray-500 mt-4">
        วันที่ทำข้อสอบ: {new Date(result.created_at).toLocaleString('th-TH')}
      </p>

      <button
        onClick={() => router.push('/dashboard')}
        className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
      >
        ดูสถิติในแดชบอร์ด →
      </button>
    </div>
  );
}
