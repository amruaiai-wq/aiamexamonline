import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

// ====== Type ของข้อมูลในตาราง TestAttempt ======
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
  score: number | null;
  total_questions: number | null;
  score_percent: number | null;
  time_spent_secs: number | null;
  created_at: string;
  user_identifier: string;
  Tests: Tests | null;
}

// ====== หน้าหลักของแดชบอร์ด ======
export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();

  // 1️⃣ ตรวจสอบสถานะผู้ใช้
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  // ถ้าไม่มี user ให้ไปหน้า login
  if (authError || !user) {
    redirect('/login');
  }

  const userEmail = user.email ?? '';

  // 2️⃣ ดึงข้อมูลการทำข้อสอบจากตาราง TestAttempt
  const { data: attempts, error } = await supabase
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

  if (error) {
    console.error('Dashboard Error:', error.message);
    return (
      <div className="container mx-auto p-8 text-center py-20 min-h-screen text-red-600">
        🚨 เกิดข้อผิดพลาดในการดึงข้อมูลสถิติ: {error.message}
        <br />
        (ตรวจสอบ RLS Policy ของตาราง <code>TestAttempt</code>)
      </div>
    );
  }

  // Cast ข้อมูลให้ตรง type
  const typedAttempts = (attempts as unknown as Attempt[]) || [];

  // ✅ กรองเฉพาะ attempt ที่มีข้อมูลครบ
  const validAttempts = typedAttempts.filter(
    (a) => a.score !== null && a.total_questions !== null && a.total_questions > 0
  );

  // 3️⃣ คำนวณสถิติรวม
  const totalAttempts = validAttempts.length;
  const totalCorrect = validAttempts.reduce((sum, a) => sum + (a.score || 0), 0);
  const totalQuestions = validAttempts.reduce(
    (sum, a) => sum + (a.total_questions || 0),
    0
  );
  const avgPercent =
    totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
  const uniqueTestsDone = new Set(validAttempts.map((a) => a.test_id)).size;

  // ====== แสดงผลแดชบอร์ด ======
  return (
    <div className="container mx-auto p-8 min-h-screen bg-white">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">
        ภาพรวมความคืบหน้า 📈
      </h1>
      <p className="text-xl text-indigo-600 mb-8">
        ยินดีต้อนรับกลับ, <span className="font-bold">{userEmail}</span>
      </p>

      {/* ====== สรุปข้อมูล ====== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* คะแนนเฉลี่ยรวม */}
        <div className="p-6 bg-indigo-50 rounded-lg shadow-md border-t-4 border-indigo-600">
          <p className="text-lg font-semibold text-gray-700">คะแนนเฉลี่ยรวม</p>
          <h2 className="text-4xl font-bold text-indigo-800 mt-2">
            {avgPercent.toFixed(1)}%
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            จาก {totalQuestions} ข้อที่ทำไปแล้ว
          </p>
        </div>

        {/* จำนวนข้อสอบที่ทำ */}
        <div className="p-6 bg-gray-50 rounded-lg shadow-md border-t-4 border-gray-600">
          <p className="text-lg font-semibold text-gray-700">
            ชุดข้อสอบที่ทำแล้ว
          </p>
          <h2 className="text-4xl font-bold text-gray-800 mt-2">
            {uniqueTestsDone} ชุด
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            เคยทำซ้ำ {totalAttempts - uniqueTestsDone} ครั้ง
          </p>
        </div>

        {/* จุดที่ควรทบทวน */}
        <div className="p-6 bg-red-50 rounded-lg shadow-md border-t-4 border-red-600">
          <p className="text-lg font-semibold text-gray-700">จุดที่ควรทบทวน</p>
          <h2 className="text-xl font-bold text-red-800 mt-2">
            {totalAttempts > 0 ? 'ทบทวนข้อที่ผิด' : '--'}
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            ดูรายละเอียดใน UserAnswer
          </p>
        </div>
      </div>

      {/* ====== ตารางผลลัพธ์ ====== */}
      <h3 className="text-3xl font-bold text-gray-800 mt-12 mb-6 border-b pb-2">
        ผลการทำข้อสอบล่าสุด ({totalAttempts})
      </h3>

      {totalAttempts > 0 ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ชุดข้อสอบ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  คะแนน
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  เวลา
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  วันที่ทำ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  การดำเนินการ
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {validAttempts.map((a) => (
                <tr key={a.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    <div className="font-semibold">{a.Tests?.title || 'N/A'}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {a.Tests?.ExamSubcategory?.ExamCategory?.name || ''} 
                      {a.Tests?.ExamSubcategory?.name ? ` → ${a.Tests.ExamSubcategory.name}` : ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-bold">
                    {(a.score_percent || 0).toFixed(0)}% ({a.score || 0}/{a.total_questions || 0})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {a.time_spent_secs || 0} วินาที
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(a.created_at).toLocaleDateString('th-TH')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/result/${a.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
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
        <p className="text-gray-500 mt-4 text-center">
          ยังไม่พบผลการทำข้อสอบในบัญชีของคุณ
        </p>
      )}

      {/* ====== กลับหน้าหลัก ====== */}
      <div className="mt-10 flex justify-center">
        <Link
          href="/"
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          ← กลับหน้าหลัก
        </Link>
      </div>
    </div>
  );
}