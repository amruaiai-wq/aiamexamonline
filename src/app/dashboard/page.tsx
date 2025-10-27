'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface ExamCategory {
  name: string;
}

interface ExamSubcategory {
  name: string;
  ExamCategory: ExamCategory | null;
}

interface Tests {
  title: string;
  ExamSubcategory: ExamSubcategory | null;
}

interface Attempt {
  id: string;
  test_id: string;
  score: number;
  total_questions: number;
  score_percent: number;
  time_spent_secs: number;
  created_at: string;
  user_identifier: string;
  Tests: Tests | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState('');
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        // ตรวจสอบ user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          router.push('/login');
          return;
        }

        const userEmail = user.email ?? '';
        const name = user.user_metadata?.full_name || userEmail.split('@')[0];
        setDisplayName(name);

        // ดึงข้อมูลการทำข้อสอบ
        const { data, error: fetchError } = await supabase
          .from('TestAttempt')
          .select(`
            id,
            test_id,
            score,
            total_questions,
            score_percent,
            created_at,
            time_spent_secs,
            user_identifier,
            Tests (
              title,
              ExamSubcategory (
                name,
                ExamCategory (name)
              )
            )
          `)
          .eq('user_identifier', userEmail)
          .order('created_at', { ascending: false });

        if (fetchError) {
          setError(fetchError.message);
        } else {
          setAttempts((data as unknown as Attempt[]) || []);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  // คำนวณสถิติ
  const totalAttempts = attempts.length;
  const totalCorrect = attempts.reduce((sum, a) => sum + a.score, 0);
  const totalQuestions = attempts.reduce((sum, a) => sum + a.total_questions, 0);
  const avgPercent = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
  const uniqueTestsDone = new Set(attempts.map((a) => a.test_id)).size;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center p-8 bg-white rounded-3xl shadow-xl max-w-md">
          <span className="text-6xl mb-4 inline-block">⚠️</span>
          <h2 className="text-2xl font-bold text-red-600 mb-4">เกิดข้อผิดพลาด</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
          >
            กลับหน้าหลัก
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link 
            href="/" 
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium mb-6 transition-colors group"
          >
            <svg 
              className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            กลับหน้าหลัก
          </Link>

          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              ภาพรวมความคืบหน้า
              <span className="text-4xl">📈</span>
            </h1>
            <p className="text-xl text-indigo-600 font-semibold">
              ยินดีต้อนรับกลับ, <span className="text-purple-600">{displayName}</span> 👋
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* คะแนนเฉลี่ย */}
          <div className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-t-4 border-indigo-500 transform hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative p-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">🎯</span>
                <div className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">
                  คะแนนเฉลี่ย
                </div>
              </div>
              <h2 className="text-5xl font-bold text-indigo-600 mb-2">
                {avgPercent.toFixed(1)}%
              </h2>
              <p className="text-sm text-gray-500">
                จาก {totalQuestions} ข้อที่ทำไปแล้ว
              </p>
            </div>
          </div>

          {/* จำนวนข้อสอบ */}
          <div className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-t-4 border-purple-500 transform hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative p-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">📝</span>
                <div className="text-xs font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                  ชุดข้อสอบ
                </div>
              </div>
              <h2 className="text-5xl font-bold text-purple-600 mb-2">
                {uniqueTestsDone}
              </h2>
              <p className="text-sm text-gray-500">
                ชุดที่ทำแล้ว (ซ้ำ {totalAttempts - uniqueTestsDone} ครั้ง)
              </p>
            </div>
          </div>

          {/* ทบทวน */}
          <div className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-t-4 border-pink-500 transform hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative p-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">💡</span>
                <div className="text-xs font-semibold text-pink-600 bg-pink-100 px-3 py-1 rounded-full">
                  ทบทวน
                </div>
              </div>
              <h2 className="text-3xl font-bold text-pink-600 mb-2">
                {totalAttempts > 0 ? 'ดูข้อที่ผิด' : '--'}
              </h2>
              <p className="text-sm text-gray-500">
                ตรวจสอบใน UserAnswer
              </p>
            </div>
          </div>
        </div>

        {/* ตารางผลลัพธ์ */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <span className="text-3xl">📊</span>
              ผลการทำข้อสอบล่าสุด
            </h3>
            <span className="text-lg font-semibold text-indigo-600 bg-indigo-100 px-4 py-2 rounded-full">
              {totalAttempts} ครั้ง
            </span>
          </div>

          {totalAttempts > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase">ชุดข้อสอบ</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase">คะแนน</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase">เวลา</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase">วันที่ทำ</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase">ดูสรุป</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {attempts.map((a) => (
                    <tr key={a.id} className="hover:bg-indigo-50/50 transition-colors">
                      <td className="px-6 py-5">
                        <div className="font-semibold text-gray-900">{a.Tests?.title || 'N/A'}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {a.Tests?.ExamSubcategory?.ExamCategory?.name || ''} 
                          {a.Tests?.ExamSubcategory?.name ? ` → ${a.Tests.ExamSubcategory.name}` : ''}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700">
                          {a.score_percent.toFixed(0)}%
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          ({a.score}/{a.total_questions})
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-600">
                        {a.time_spent_secs} วินาที
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-600">
                        {new Date(a.created_at).toLocaleDateString('th-TH')}
                      </td>
                      <td className="px-6 py-5">
                        <Link
                          href={`/result/${a.id}`}
                          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-semibold"
                        >
                          ดูสรุป →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <span className="text-7xl mb-4 inline-block">📭</span>
              <p className="text-gray-500 text-lg mb-6">
                ยังไม่พบผลการทำข้อสอบในบัญชีของคุณ
              </p>
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
              >
                เริ่มทำข้อสอบ →
              </Link>
            </div>
          )}
        </div>

        {/* CTA */}
        {totalAttempts > 0 && (
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-10 text-center shadow-2xl">
            <h3 className="text-3xl font-bold text-white mb-4">
              พร้อมท้าทายตัวเองต่อไหม? 🚀
            </h3>
            <p className="text-xl text-indigo-100 mb-6">
              เลือกชุดข้อสอบใหม่เพื่อพัฒนาทักษะของคุณ
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
            >
              เลือกชุดข้อสอบ →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}