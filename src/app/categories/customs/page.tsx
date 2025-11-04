// src/app/categories/customs/page.tsx
import Link from 'next/link'

const subcategories = [
  {
    name: 'ความรู้ทั่วไป',
    slug: 'general-knowledge',
    icon: '📚',
    description: 'ความรู้ทั่วไปเกี่ยวกับครอบครัวศุลกากรและเหตุการณ์ปัจจุบัน',
    stats: 'กำลังเพิ่มข้อสอบ',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'กฎหมายศุลกากร',
    slug: 'customs-law',
    icon: '⚖️',
    description: 'พระราชบัญญัติศุลกากร และกฎหมายที่เกี่ยวข้อง',
    stats: 'กำลังเพิ่มข้อสอบ',
    color: 'from-purple-500 to-pink-500',
  },
  {
    name: 'การคิดเชิงวิเคราะห์',
    slug: 'analytical-thinking',
    icon: '📊',
    description: 'Analytical Thinking',
    stats: 'กำลังเพิ่มข้อสอบ',
    color: 'from-green-500 to-emerald-500',
  },
  {
    name: 'ภาษาอังกฤษ',
    slug: 'english',
    icon: '🇬🇧',
    description: 'Reading Comprehension และ Grammar',
    stats: 'กำลังเพิ่มข้อสอบ',
    color: 'from-indigo-500 to-blue-500',
  },
  {
    name: 'จรรยาบรรณของราชการ',
    slug: 'moral-knowledge',
    icon: '☀️',
    description: 'ความรู้เกี่ยวกับวิธี จรรยาบรรณและจรรยาบรรณข้อราชการ',
    stats: 'กำลังเพิ่มข้อสอบ',
    color: 'from-orange-500 to-red-500',
  },
]

export default function CustomsCategoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-orange-900">
      <div className="container mx-auto px-6 py-16">
        {/* Back Button */}
        <Link 
          href="/" 
          className="inline-flex items-center text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 font-medium mb-8 transition-colors group"
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
          <span className="text-7xl mb-6 inline-block animate-bounce">🏛️</span>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            นักวิชาการกรมศุลกากร
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
            ข้อสอบนักวิชาการศุลกากร ครอบคลุมทุกวิชาที่ต้องสอบ พร้อมเฉลยละเอียด
          </p>
          <div className="h-1 w-32 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-6xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center transform hover:scale-105 transition-transform">
            <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">5</div>
            <div className="text-gray-600 dark:text-gray-300">วิชา</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center transform hover:scale-105 transition-transform">
            <div className="text-4xl font-bold text-red-600 dark:text-red-400 mb-2">200</div>
            <div className="text-gray-600 dark:text-gray-300">ข้อต่อชุด</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center transform hover:scale-105 transition-transform">
            <div className="text-4xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">240</div>
            <div className="text-gray-600 dark:text-gray-300">นาที</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center transform hover:scale-105 transition-transform">
            <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">100%</div>
            <div className="text-gray-600 dark:text-gray-300">ฟรี</div>
          </div>
        </div>

        {/* Subcategories Section */}
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          เลือกวิชาที่ต้องการฝึก
        </h2>
        
        {/* Grid with centered last row */}
        <div className="max-w-7xl mx-auto">
          {/* แถวแรก - 3 การ์ด */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {subcategories.slice(0, 3).map((sub, index) => (
              <Link
                key={sub.slug}
                href={`/categories/customs/${sub.slug}`}
                className="group animate-fade-in-up"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-orange-400 dark:hover:border-orange-600 transform hover:-translate-y-2 h-full">
                  {/* Icon */}
                  <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform text-center">
                    {sub.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 text-center group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {sub.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 text-center line-clamp-2 min-h-[2.5rem]">
                    {sub.description}
                  </p>

                  {/* Stats Badge */}
                  <div className="text-center">
                    <span className="inline-flex items-center px-3 py-1 bg-orange-50 dark:bg-orange-900/50 rounded-full text-xs font-semibold text-orange-600 dark:text-orange-300">
                      {sub.stats}
                    </span>
                  </div>

                  {/* Gradient Background on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${sub.color} opacity-0 group-hover:opacity-5 transition-opacity rounded-2xl pointer-events-none`}></div>
                </div>
              </Link>
            ))}
          </div>

          {/* แถวที่สอง - 2 การ์ดกึ่งกลาง */}
          <div className="flex justify-center gap-8">
            <div className="w-full md:w-1/2 lg:w-1/3">
              {subcategories.slice(3, 4).map((sub, index) => (
                <Link
                  key={sub.slug}
                  href={`/categories/customs/${sub.slug}`}
                  className="group animate-fade-in-up block"
                  style={{
                    animationDelay: `${(index + 3) * 100}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-orange-400 dark:hover:border-orange-600 transform hover:-translate-y-2 h-full">
                    <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform text-center">
                      {sub.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 text-center group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      {sub.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 text-center line-clamp-2 min-h-[2.5rem]">
                      {sub.description}
                    </p>
                    <div className="text-center">
                      <span className="inline-flex items-center px-3 py-1 bg-orange-50 dark:bg-orange-900/50 rounded-full text-xs font-semibold text-orange-600 dark:text-orange-300">
                        {sub.stats}
                      </span>
                    </div>
                    <div className={`absolute inset-0 bg-gradient-to-br ${sub.color} opacity-0 group-hover:opacity-5 transition-opacity rounded-2xl pointer-events-none`}></div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="w-full md:w-1/2 lg:w-1/3">
              {subcategories.slice(4, 5).map((sub, index) => (
                <Link
                  key={sub.slug}
                  href={`/categories/customs/${sub.slug}`}
                  className="group animate-fade-in-up block"
                  style={{
                    animationDelay: `${(index + 4) * 100}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-orange-400 dark:hover:border-orange-600 transform hover:-translate-y-2 h-full">
                    <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform text-center">
                      {sub.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 text-center group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      {sub.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 text-center line-clamp-2 min-h-[2.5rem]">
                      {sub.description}
                    </p>
                    <div className="text-center">
                      <span className="inline-flex items-center px-3 py-1 bg-orange-50 dark:bg-orange-900/50 rounded-full text-xs font-semibold text-orange-600 dark:text-orange-300">
                        {sub.stats}
                      </span>
                    </div>
                    <div className={`absolute inset-0 bg-gradient-to-br ${sub.color} opacity-0 group-hover:opacity-5 transition-opacity rounded-2xl pointer-events-none`}></div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Exam Structure Info */}
        <div className="mt-16 max-w-5xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            📋 โครงสร้างการสอบ
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Part 1 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
                📚 ความรู้ความสามารถทั่วไป (100 ข้อ)
              </h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-center">
                  <span className="mr-2">📚</span> ความรู้ทั่วไป (40 ข้อ)
                </li>
                <li className="flex items-center">
                  <span className="mr-2">🇬🇧</span> ภาษาอังกฤษ (30 ข้อ)
                </li>
                <li className="flex items-center">
                  <span className="mr-2">📊</span> การคิดเชิงวิเคราะห์ (30 ข้อ)
                </li>
              </ul>
            </div>

            {/* Part 2 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
                🎯 ความรู้เฉพาะตำแหน่ง (100 ข้อ)
              </h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-center">
                  <span className="mr-2">⚖️</span> กฎหมายศุลกากร (60 ข้อ)
                </li>
                <li className="flex items-center">
                  <span className="mr-2">☀️</span> จรรยาบรรณราชการ (40 ข้อ)
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl p-8 text-white text-center shadow-xl max-w-5xl mx-auto">
          <h3 className="text-2xl font-bold mb-3">🎯 พร้อมสอบนักวิชาการศุลกากร!</h3>
          <p className="text-orange-100 text-lg max-w-3xl mx-auto">
            ฝึกทำข้อสอบครบทุกวิชา พร้อมเฉลยละเอียดและเทคนิคการทำข้อสอบจากผู้เชี่ยวชาญ
          </p>
        </div>
      </div>
    </div>
  )
}