// src/app/category/[slug]/page.tsx
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Params = { slug: string };

// Icon components สำหรับแต่ละหมวด
const SubcategoryIcon = ({ name }: { name: string }) => {
  // เลือก icon ตามชื่อหมวด
  if (name.includes('คณิต') || name.includes('คิดวิเคราะห์')) {
    return <span className="text-4xl">🧮</span>;
  }
  if (name.includes('กฎหมาย') || name.includes('ข้าราชการ')) {
    return <span className="text-4xl">⚖️</span>;
  }
  if (name.includes('ภาษาอังกฤษ') || name.includes('อังกฤษ')) {
    return <span className="text-4xl">🇬🇧</span>;
  }
  if (name.includes('ความรู้ทั่วไป')) {
    return <span className="text-4xl">📚</span>;
  }
  // Default
  return <span className="text-4xl">📝</span>;
};

export default async function CategoryDetailPage({ params }: { params: Params }) {
  const supabase = createSupabaseServerClient();

  // 1) หา category จาก slug
  const { data: category, error: catErr } = await supabase
    .from("ExamCategory")
    .select("id, name, slug")
    .eq("slug", params.slug)
    .single();

  if (catErr || !category) {
    return (
      <main className="container mx-auto py-16 px-4">
        <p className="text-center text-red-600">ไม่พบหมวดนี้</p>
      </main>
    );
  }

  // 2) ดึงหมวดย่อยทั้งหมดของหมวดนี้
  const { data: subcategories, error } = await supabase
    .from("ExamSubcategory")
    .select("id, name, slug")
    .eq("category_id", category.id)
    .order("name", { ascending: true });

  if (error) {
    return (
      <main className="container mx-auto py-16 px-4">
        <p className="text-center text-red-600">
          โหลดหมวดย่อยไม่สำเร็จ: {error.message}
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto py-12 px-4">
        {/* Back Button */}
        <Link 
          href="/" 
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium mb-8 transition-colors group"
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
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            {category.name}
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-4 text-lg">
            เลือกหมวดย่อยที่ต้องการฝึกทำข้อสอบ
          </p>
        </div>

        {/* Subcategories Grid */}
        {(!subcategories || subcategories.length === 0) ? (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 inline-block">📭</span>
            <p className="text-gray-500 text-lg">ยังไม่มีหมวดย่อยในหมวดนี้</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subcategories.map((sub, index) => (
              <Link
                key={sub.id}
                href={`/subcategory/${sub.slug}`}
                className="group relative animate-fade-in-up"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                {/* Card */}
                <div className="relative h-full bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-indigo-400 group-hover:-translate-y-2">
                  {/* Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Content */}
                  <div className="relative p-8">
                    {/* Icon */}
                    <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                      <SubcategoryIcon name={sub.name} />
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-indigo-700 transition-colors">
                      {sub.name}
                    </h2>

                    {/* Arrow */}
                    <div className="flex items-center text-indigo-600 font-medium">
                      <span className="mr-2">ดูชุดข้อสอบ</span>
                      <svg 
                        className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>

                  {/* Decorative Corner */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-400/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Info Box */}
        {subcategories && subcategories.length > 0 && (
          <div className="mt-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-8 text-white text-center shadow-xl">
            <h3 className="text-2xl font-bold mb-3">🎯 พร้อมที่จะเริ่มแล้วหรือยัง?</h3>
            <p className="text-indigo-100 text-lg">
              เลือกหมวดย่อยด้านบนเพื่อเริ่มฝึกทำข้อสอบและพัฒนาความรู้ของคุณ
            </p>
          </div>
        )}
      </div>
    </main>
  );
}