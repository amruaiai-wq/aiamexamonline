// src/app/subcategory/[slug]/page.tsx
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Params = { slug: string };

export default async function SubcategoryDetailPage({ params }: { params: Params }) {
  const supabase = await createSupabaseServerClient();

  // 1) หา subcategory จาก slug
  const { data: sub, error: subErr } = await supabase
    .from("ExamSubcategory")
    .select(`
      id, 
      name, 
      slug,
      category_id,
      ExamCategory (
        id,
        name,
        slug
      )
    `)
    .eq("slug", params.slug)
    .single();

  if (subErr || !sub) {
    return (
      <main className="container mx-auto py-16 px-4">
        <p className="text-center text-red-600">ไม่พบหมวดย่อย</p>
      </main>
    );
  }

  // 2) ดึงชุดข้อสอบทั้งหมดในหมวดย่อยนี้
  const { data: tests, error } = await supabase
    .from("Tests")
    .select("id, title, difficulty, total_questions")
    .eq("subcategory_id", sub.id)
    .order("title", { ascending: true });

  if (error) {
    return (
      <main className="container mx-auto py-16 px-4">
        <p className="text-center text-red-600">โหลดชุดข้อสอบไม่สำเร็จ: {error.message}</p>
      </main>
    );
  }

  // @ts-ignore
  const categorySlug = sub.ExamCategory?.slug || '';
  // @ts-ignore
  const categoryName = sub.ExamCategory?.name || '';

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-12 px-4 max-w-5xl">
        {/* Back Button */}
        <Link
          href={`/category/${categorySlug}`}
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium mb-8 transition-colors group"
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

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {sub.name}
              </h1>
              <p className="text-gray-500 text-sm">{categoryName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
              {tests?.length || 0} ชุดข้อสอบ
            </span>
          </div>
        </div>

        {/* Tests List */}
        {(!tests || tests.length === 0) ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500 text-lg">ยังไม่มีชุดข้อสอบในหมวดย่อยนี้</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tests.map((test, index) => (
              <Link
                key={test.id}
                href={`/test/${test.id}`}
                className="group block bg-white border-l-4 border-indigo-400 rounded-xl p-6 hover:border-indigo-600 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Title */}
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-2xl mt-1">📝</span>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                          {test.title}
                        </h2>
                        <div className="flex flex-wrap items-center gap-3">
                          {/* Question Count */}
                          <div className="flex items-center gap-1.5 text-gray-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-sm font-medium">{test.total_questions || 0} ข้อ</span>
                          </div>

                          {/* Difficulty Badge */}
                          {test.difficulty && (
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                              test.difficulty === 'easy' 
                                ? 'bg-green-100 text-green-700'
                                : test.difficulty === 'medium'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {test.difficulty === 'easy' && '⭐ ง่าย'}
                              {test.difficulty === 'medium' && '⭐⭐ ปานกลาง'}
                              {test.difficulty === 'hard' && '⭐⭐⭐ ยาก'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Progress indicator */}
                    <div className="ml-11">
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-400 rounded-full w-0 group-hover:w-full transition-all duration-500"></div>
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-50 group-hover:bg-indigo-100 transition-colors">
                    <svg 
                      className="w-5 h-5 text-indigo-600 transform group-hover:translate-x-1 transition-transform" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Summary Footer */}
        {tests && tests.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 text-center border border-indigo-100">
            <p className="text-gray-700 mb-4">
              <span className="font-semibold text-indigo-600">{tests.length}</span> ชุดข้อสอบพร้อมให้คุณฝึกฝน
            </p>
            <Link
              href={`/category/${categorySlug}`}
              className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              เลือกหมวดย่อยอื่น
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}