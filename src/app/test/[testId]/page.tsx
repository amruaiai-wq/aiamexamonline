// src/app/result/[id]/page.tsx - แก้ไข Type Error

// ✅ แก้ไขวิธีที่ 1: เพิ่ม Type Definition ที่ถูกต้อง
type TestResult = {
  id: any;
  score: any;
  total_questions: any;
  score_percent: any;
  created_at: any;
  Tests: {
    title: string;
  } | null; // ← เปลี่ยนจาก array เป็น object เดี่ยว
};

// ในส่วนของ query (ถ้ามี .select())
const { data, error } = await supabase
  .from('Results')
  .select(`
    id,
    score,
    total_questions,
    score_percent,
    created_at,
    Tests!inner (
      title
    )
  `)
  .eq('id', params.id)
  .single();

// ใช้งาน
if (data) {
  console.log(data.Tests?.title); // ✅ ถูกต้อง
}


// ============================================
// หรือ แก้ไขวิธีที่ 2: ถ้า Tests เป็น array จริงๆ
// ============================================

type TestResult = {
  id: any;
  score: any;
  total_questions: any;
  score_percent: any;
  created_at: any;
  Tests: {
    title: string;
  }[]; // ← array ของ object
};

// ใช้งาน
if (data && data.Tests && data.Tests.length > 0) {
  console.log(data.Tests[0].title); // ✅ เข้าถึง element แรก
}


// ============================================
// แนะนำให้ใช้วิธีนี้: Define Type ที่ชัดเจน
// ============================================

interface Test {
  title: string;
}

interface Result {
  id: string;
  score: number;
  total_questions: number;
  score_percent: number;
  created_at: string;
  Tests: Test | null; // ถ้าเป็น relation หนึ่งต่อหนึ่ง
}

// หรือ
interface Result {
  id: string;
  score: number;
  total_questions: number;
  score_percent: number;
  created_at: string;
  Tests: Test[]; // ถ้าเป็น relation หนึ่งต่อหลาย
}

export default async function ResultPage({ params }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient();
  
  const { data, error } = await supabase
    .from('Results')
    .select(`
      id,
      score,
      total_questions,
      score_percent,
      created_at,
      Tests (
        title
      )
    `)
    .eq('id', params.id)
    .single();

  if (error || !data) {
    console.error('❌ Error loading result:', error?.message);
    return <div>Error loading result</div>;
  }

  // ✅ Cast type ถ้าจำเป็น
  const result = data as Result;

  return (
    <div>
      <h1>Result</h1>
      <p>Score: {result.score}</p>
      <p>Test: {result.Tests?.title || 'N/A'}</p>
    </div>
  );
}