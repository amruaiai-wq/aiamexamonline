// src/app/categories/a-level/page.tsx
import Link from 'next/link'

const subcategories = [
  {
    name: 'ภาษาไทย',
    slug: 'thai',
    icon: '🇹🇭',
    description: 'วรรณคดี วรรณกรรม และการใช้ภาษา',
    stats: 'กำลังเพิ่มข้อสอบ',
    color: 'from-red-500 to-pink-500',
  },
  {
    name: 'สังคมศึกษา',
    slug: 'social',
    icon: '🌏',
    description: 'ประวัติศาสตร์ ภูมิศาสตร์ และสังคม',
    stats: 'กำลังเพิ่มข้อสอบ',
    color: 'from-orange-500 to-yellow-500',
  },
  {
    name: 'ภาษาอังกฤษ',
    slug: 'english',
    icon: '🇬🇧',
    description: 'Reading, Writing และ Grammar',
    stats: 'กำลังเพิ่มข้อสอบ',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'คณิตศาสตร์ 1',
    slug: 'math-1',
    icon: '🔢',
    description: 'พีชคณิต เรขาคณิต และแคลคูลัส',
    stats: 'กำลังเพิ่มข้อสอบ',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    name: 'คณิตศาสตร์ 2',
    slug: 'math-2',
    icon: '📐',
    description: 'สถิติ ความน่าจะเป็น และเมทริกซ์',
    stats: 'กำลังเพิ่มข้อสอบ',
    color: 'from-purple-500 to-pink-500',
  },
  {
    name: 'ฟิสิกส์',
    slug: 'physics',
    icon: '⚛️',
    description: 'กลศาสตร์ ไฟฟ้า และคลื่น',
    stats: 'กำลังเพิ่มข้อสอบ',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    name: 'เคมี',
    slug: 'chemistry',
    icon: '🧪',
    description: 'เคมีทั่วไป เคมีอินทรีย์ และเคมีฟิสิกส์',
    stats: 'กำลังเพิ่มข้อสอบ',
    color: 'from-green-500 to-emerald-500',
  },
  {
    name: 'ชีววิทยา',
    slug: 'biology',
    icon: '🧬',
    description: 'เซลล์ พันธุกรรม และสิ่งมีชีวิต',
    stats: 'กำลังเพิ่มข้อสอบ',
    color: 'from-lime-500 to-green-500',
  },
]

export default function ALevelCategoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-green-900">
      <div className="container mx-auto px-6 py-16">
        {/* Back Button */}
        <Link 
          href="/" 
          className="inline-flex items-center text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium mb-8 transition-colors group"
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

        {/* Header Section */}
        <div className="text-center mb-16">
          <span className="text-7xl mb-6 inline-block animate-bounce">🎓</span>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            ข้อสอบ A-Level
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
            แบบทดสอบวิชาสามัญ 7 วิชา สำหรับนักเรียนชั้น ม.6 เตรียมสอบเข้ามหาวิทยาลัย
          </p>
          <div className="h-1 w-32 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full"></div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16 max-w-6xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center transform hover:scale-105 transition-transform">
            <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">8</div>
            <div className="text-gray-600 dark:text-gray-300">วิชาสามัญ</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center transform hover:scale-105 transition-transform">
            <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">60</div>
            <div className="text-gray-600 dark:text-gray-300">ข้อต่อวิชา</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center transform hover:scale-105 transition-transform">
            <div className="text-4xl font-bold text-teal-600 dark:text-teal-400 mb-2">90</div>
            <div className="text-gray-600 dark:text-gray-300">นาที</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center transform hover:scale-105 transition-transform">
            <div className="text-4xl font-bold text-lime-600 dark:text-lime-400 mb-2">300</div>
            <div className="text-gray-600 dark:text-gray-300">คะแนนเต็ม</div>
          </div>
        </div>

        {/* Subcategories Section */}
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          เลือกวิชาที่ต้องการฝึก
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {subcategories.map((sub, index) => (
            <Link
              key={sub.slug}
              href={`/categories/a-level/${sub.slug}`}
              className="group animate-fade-in-up"
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'both'
              }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-green-400 dark:hover:border-green-600 transform hover:-translate-y-2 h-full">
                {/* Icon */}
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform text-center">
                  {sub.icon}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 text-center group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  {sub.name}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 text-center line-clamp-2">
                  {sub.description}
                </p>

                {/* Stats Badge */}
                <div className="text-center">
                  <span className="inline-flex items-center px-3 py-1 bg-green-50 dark:bg-green-900/50 rounded-full text-xs font-semibold text-green-600 dark:text-green-300">
                    {sub.stats}
                  </span>
                </div>

                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${sub.color} opacity-0 group-hover:opacity-5 transition-opacity rounded-2xl pointer-events-none`}></div>
              </div>
            </Link>
          ))}
        </div>

        {/* Categories Breakdown */}
        <div className="mt-16 max-w-5xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            รายละเอียดวิชาสามัญแต่ละวิชา
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Group 1 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-4">📚 กลุ่มภาษาและสังคม</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-center">
                  <span className="mr-2">🇹🇭</span> ภาษาไทย - ความเข้าใจ วิเคราะห์
                </li>
                <li className="flex items-center">
                  <span className="mr-2">🌏</span> สังคมศึกษา - ประวัติศาสตร์ ภูมิศาสตร์
                </li>
                <li className="flex items-center">
                  <span className="mr-2">🇬🇧</span> ภาษาอังกฤษ - Reading & Grammar
                </li>
              </ul>
            </div>

            {/* Group 2 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-4">🔬 กลุ่มวิทยาศาสตร์และคณิต</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-center">
                  <span className="mr-2">🔢</span> คณิตศาสตร์ 1 - พีชคณิต แคลคูลัส
                </li>
                <li className="flex items-center">
                  <span className="mr-2">📐</span> คณิตศาสตร์ 2 - สถิติ ความน่าจะเป็น
                </li>
                <li className="flex items-center">
                  <span className="mr-2">⚛️</span> ฟิสิกส์ - กลศาสตร์ ไฟฟ้า
                </li>
                <li className="flex items-center">
                  <span className="mr-2">🧪</span> เคมี - เคมีอินทรีย์ เคมีฟิสิกส์
                </li>
                <li className="flex items-center">
                  <span className="mr-2">🧬</span> ชีววิทยา - เซลล์ พันธุกรรม
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-8 text-white text-center shadow-xl max-w-5xl mx-auto">
          <h3 className="text-2xl font-bold mb-3">🎯 เตรียมตัวสอบเข้ามหาวิทยาลัย!</h3>
          <p className="text-green-100 text-lg max-w-3xl mx-auto">
            ฝึกทำข้อสอบ A-Level ทุกวิชา เพื่อเพิ่มโอกาสเข้าเรียนในคณะที่คุณฝัน พร้อมเฉลยละเอียดทุกข้อ
          </p>
        </div>
      </div>
    </div>
  )
}