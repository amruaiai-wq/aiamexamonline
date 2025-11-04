// src/app/page.tsx
import Link from "next/link";
import TestimonialCard from "../components/testimonials/TestimonialCard";
import TestimonialForm from "../components/testimonials/TestimonialForm";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const examCategories = [
  {
    title: "TOEIC",
    description: "แบบทดสอบภาษาอังกฤษเพื่อการสื่อสารสากล",
    link: "/categories/toeic",
    icon: "🇬🇧",
    gradient: "from-blue-500 to-cyan-500",
    stats: "90 ชุด | 1,440+ ข้อ"
  },
  {
    title: "ข้อสอบ ภาค ก. (ก.พ.)",
    description: "ความรู้ทั่วไป คณิตศาสตร์ และกฎหมาย เพื่อเตรียมสอบราชการ",
    link: "/categories/pak-kor",
    icon: "📋",
    gradient: "from-purple-500 to-pink-500",
    stats: "กำลังเพิ่มข้อสอบ"
  },
  {
    title: "ข้อสอบ ม.6 (A-Level)",
    description: "แบบทดสอบวิชาสามัญสำหรับนักเรียนชั้นมัธยมศึกษาปีที่ 6",
    link: "/categories/a-level",
    icon: "🎓",
    gradient: "from-green-500 to-emerald-500",
    stats: "กำลังเพิ่มข้อสอบ"
  },
  {
    title: "นักวิชาการกรมศุลกากร",
    description: "ข้อสอบนักวิชาการศุลกากร ความรู้เฉพาะตำแหน่งและความรู้ทั่วไป",
    link: "/categories/customs",
    icon: "🏛️",
    gradient: "from-orange-500 to-red-500",
    stats: "กำลังเพิ่มข้อสอบ"
  },
];

const features = [
  {
    icon: "🤖",
    title: "เฉลยละเอียด",
    description: "คำอธิบายที่เข้าใจง่าย ทั้งภาษาไทยและอังกฤษ"
  },
  {
    icon: "📊",
    title: "ติดตามความคืบหน้า",
    description: "ดูสถิติคะแนนและวิเคราะห์จุดอ่อนของคุณ"
  },
  {
    icon: "⚡",
    title: "ฝึกฝนได้ทุกที่ทุกเวลา",
    description: "เข้าถึงได้ง่าย ทำงานได้บนทุกอุปกรณ์"
  }
];

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();

  // ดึง Testimonials ที่ approved แล้ว
  const { data: testimonials } = await supabase
    .from('Testimonial')
    .select('*')
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
    .limit(6);

  // นับจำนวนจริงจาก Database
  const { count: totalTests } = await supabase
    .from('Tests')
    .select('*', { count: 'exact', head: true });

  const { count: totalAttempts } = await supabase
    .from('TestAttempt')
    .select('*', { count: 'exact', head: true });

  const { data: totalQuestions } = await supabase
    .from('TestAttempt')
    .select('total_questions');

  const sumQuestions = totalQuestions?.reduce((sum, item) => sum + (item.total_questions || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 dark:bg-indigo-900 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative container mx-auto px-6 py-20 md:py-32 text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-full mb-8 animate-fade-in-up">
            <span className="text-indigo-600 dark:text-indigo-300 font-semibold text-sm">✨ ระบบฝึกข้อสอบออนไลน์ที่ดีที่สุด</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight animate-fade-in-up animation-delay-200">
            พิชิตทุกสนามสอบไทย
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto animate-fade-in-up animation-delay-400">
            รวมข้อสอบสำคัญ พร้อมเฉลยละเอียดและเก็บสถิติ <br className="hidden sm:block" />
            เพื่อฝึกฝนและพัฒนาศักยภาพของคุณ
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-600">
            <Link
              href="#categories"
              className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              เริ่มฝึกฝนทันที
              <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg border-2 border-indigo-200 dark:border-indigo-700 hover:border-indigo-300 dark:hover:border-indigo-600 transform hover:-translate-y-1 transition-all duration-300"
            >
              ดูสถิติของฉัน
            </Link>
          </div>

          {/* Stats - อัพเดทด้วยข้อมูลจริง */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-16 animate-fade-in-up animation-delay-800">
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                {totalTests || 90}+
              </div>
              <div className="text-gray-600 dark:text-gray-400">ชุดข้อสอบ</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {sumQuestions || 1800}+
              </div>
              <div className="text-gray-600 dark:text-gray-400">คำถาม</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-pink-600 dark:text-pink-400 mb-2">
                {totalAttempts || 0}+
              </div>
              <div className="text-gray-600 dark:text-gray-400">ครั้งที่ทำ</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section - ปรับเป็น 2 คอลัมน์ */}
      <section id="categories" className="py-20 px-6">
        <div className="container mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              เลือกหมวดข้อสอบที่ต้องการฝึกฝน
            </h2>
            <div className="h-1 w-32 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
          </div>

          {/* Category Cards - เปลี่ยนเป็น 2 คอลัมน์ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {examCategories.map((exam, index) => (
              <Link
                key={exam.title}
                href={exam.link}
                className="group relative animate-fade-in-up"
                style={{
                  animationDelay: `${index * 150}ms`,
                  animationFillMode: 'both'
                }}
              >
                <div className="relative h-full bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-transparent hover:border-indigo-300 dark:hover:border-indigo-700 transform hover:-translate-y-3 hover:scale-105">
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${exam.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  
                  {/* Icon Badge */}
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-700/80 dark:to-gray-700/40 rounded-full flex items-center justify-center transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
                    <span className="text-5xl transform -rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-transform duration-500">{exam.icon}</span>
                  </div>

                  {/* Content */}
                  <div className="relative p-8 pt-12">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {exam.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed min-h-[3rem]">
                      {exam.description}
                    </p>

                    {/* Stats Badge */}
                    <div className="inline-flex items-center px-4 py-2 bg-indigo-50 dark:bg-indigo-900/50 rounded-full text-sm font-semibold text-indigo-600 dark:text-indigo-300 mb-4">
                      {exam.stats}
                    </div>

                    {/* Arrow */}
                    <div className="flex items-center text-indigo-600 dark:text-indigo-400 font-semibold group-hover:text-indigo-700 dark:group-hover:text-indigo-300">
                      <span className="mr-2">เริ่มต้นฝึกฝน</span>
                      <svg 
                        className="w-5 h-5 transform group-hover:translate-x-3 transition-transform duration-300" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>

                  {/* Shine Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white/50 dark:bg-gray-800/50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="text-center p-8 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm animate-fade-in-up hover:shadow-lg transition-shadow duration-300"
                style={{
                  animationDelay: `${index * 150}ms`,
                  animationFillMode: 'both'
                }}
              >
                <div className="text-6xl mb-4 transform hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials && testimonials.length > 0 && (
        <section className="py-20 px-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                ความคิดเห็นจากผู้ใช้ 💬
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                ดูว่าผู้ใช้งานท่านอื่นพูดถึงเราอย่างไร
              </p>
              <div className="h-1 w-32 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full mt-6"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <TestimonialCard
                  key={testimonial.id}
                  name={testimonial.user_name}
                  avatar={testimonial.user_avatar}
                  rating={testimonial.rating}
                  comment={testimonial.comment}
                  category={testimonial.test_category}
                  date={testimonial.created_at}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-700 dark:via-purple-700 dark:to-pink-700 rounded-3xl p-12 text-center overflow-hidden shadow-2xl">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px'}}></div>
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                พร้อมที่จะเริ่มต้นแล้วหรือยัง? 🚀
              </h2>
              <p className="text-xl text-indigo-100 dark:text-indigo-200 mb-8 max-w-2xl mx-auto">
                สมัครสมาชิกฟรี เข้าถึงข้อสอบทั้งหมด และติดตามความคืบหน้าของคุณ
              </p>
              <Link
                href="/register"
                className="inline-flex items-center px-8 py-4 text-lg font-bold text-indigo-600 dark:text-indigo-700 bg-white rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                สมัครสมาชิกฟรี
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Form (Floating Button) */}
      <TestimonialForm />
    </div>
  );
}