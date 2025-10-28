'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import QuestionRenderer from './question-renderer';

export default function TestPage() {
  const params = useParams();
  const testId = params?.testId as string;
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [test, setTest] = useState<any>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // โหลดข้อมูลชุดข้อสอบ + สร้าง attempt ใหม่
  useEffect(() => {
    const initTest = async () => {
      if (!testId || testId === 'undefined') {
        setError('ไม่พบ Test ID');
        setLoading(false);
        return;
      }

      // ✅ โหลดข้อมูลชุดข้อสอบ
      const { data: testData, error: testError } = await supabase
        .from('Tests')
        .select('id, title')
        .eq('id', testId)
        .single();

      if (testError || !testData) {
        console.error('Error loading test:', testError?.message);
        setError('ไม่พบข้อมูลชุดข้อสอบ');
        setLoading(false);
        return;
      }

      setTest(testData);

      // ✅ ดึงข้อมูล user ที่ login อยู่
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      let userIdentifier = '';
      
      if (userData?.user?.email) {
        // ถ้า login แล้ว ใช้ email
        userIdentifier = userData.user.email;
      } else {
        // ถ้ายังไม่ login ใช้ anon
        userIdentifier = 'anon_' + Math.random().toString(36).substring(2, 8);
      }

      console.log('🔑 User Identifier:', userIdentifier);

      // ✅ สร้าง attempt ใหม่
      const { data: attempt, error: attemptError } = await supabase
        .from('TestAttempt')
        .insert([
          {
            test_id: testId,
            user_identifier: userIdentifier,
            start_time: new Date().toISOString(),
          },
        ])
        .select('id')
        .single();

      if (attemptError) {
        console.error('Error creating attempt:', attemptError.message);
        setError('ไม่สามารถสร้าง attempt ได้');
        setLoading(false);
        return;
      }

      console.log('✅ Created attempt:', attempt.id);
      setAttemptId(attempt.id);
      setLoading(false);
    };

    initTest();
  }, [testId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        ⏳ กำลังโหลดข้อสอบ...
      </div>
    );
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

  if (!attemptId || !test) {
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

      {/* ✅ Component ทำข้อสอบ */}
      <QuestionRenderer testId={testId} attemptId={attemptId} />
    </main>
  );
}