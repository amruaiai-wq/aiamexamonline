// src/app/categories/components/SubjectPage.tsx
import Link from 'next/link'

interface SubjectPageProps {
  title: string
  icon: string
  description: string
  backLink: string
  backText: string
  color: 'blue' | 'purple' | 'green' | 'red' | 'orange' | 'cyan' | 'indigo' | 'pink'
  tests: any[]
  error: any
  questionCount?: number
}

const colorClasses = {
  blue: {
    gradient: 'from-blue-50 to-cyan-50',
    text: 'text-blue-600',
    hover: 'hover:text-blue-800',
    border: 'hover:border-blue-400',
    bg: 'bg-blue-100',
    textColor: 'text-blue-600',
    line: 'from-blue-500 to-cyan-500',
    button: 'from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
  },
  purple: {
    gradient: 'from-purple-50 to-pink-50',
    text: 'text-purple-600',
    hover: 'hover:text-purple-800',
    border: 'hover:border-purple-400',
    bg: 'bg-purple-100',
    textColor: 'text-purple-600',
    line: 'from-purple-500 to-pink-500',
    button: 'from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
  },
  green: {
    gradient: 'from-green-50 to-emerald-50',
    text: 'text-green-600',
    hover: 'hover:text-green-800',
    border: 'hover:border-green-400',
    bg: 'bg-green-100',
    textColor: 'text-green-600',
    line: 'from-green-500 to-emerald-500',
    button: 'from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
  },
  red: {
    gradient: 'from-red-50 to-pink-50',
    text: 'text-red-600',
    hover: 'hover:text-red-800',
    border: 'hover:border-red-400',
    bg: 'bg-red-100',
    textColor: 'text-red-600',
    line: 'from-red-500 to-pink-500',
    button: 'from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700'
  },
  orange: {
    gradient: 'from-orange-50 to-yellow-50',
    text: 'text-orange-600',
    hover: 'hover:text-orange-800',
    border: 'hover:border-orange-400',
    bg: 'bg-orange-100',
    textColor: 'text-orange-600',
    line: 'from-orange-500 to-yellow-500',
    button: 'from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700'
  },
  cyan: {
    gradient: 'from-cyan-50 to-blue-50',
    text: 'text-cyan-600',
    hover: 'hover:text-cyan-800',
    border: 'hover:border-cyan-400',
    bg: 'bg-cyan-100',
    textColor: 'text-cyan-600',
    line: 'from-cyan-500 to-blue-500',
    button: 'from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700'
  },
  indigo: {
    gradient: 'from-indigo-50 to-purple-50',
    text: 'text-indigo-600',
    hover: 'hover:text-indigo-800',
    border: 'hover:border-indigo-400',
    bg: 'bg-indigo-100',
    textColor: 'text-indigo-600',
    line: 'from-indigo-500 to-purple-500',
    button: 'from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
  },
  pink: {
    gradient: 'from-pink-50 to-rose-50',
    text: 'text-pink-600',
    hover: 'hover:text-pink-800',
    border: 'hover:border-pink-400',
    bg: 'bg-pink-100',
    textColor: 'text-pink-600',
    line: 'from-pink-500 to-rose-500',
    button: 'from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700'
  }
}

export default function SubjectPage({
  title,
  icon,
  description,
  backLink,
  backText,
  color,
  tests,
  error,
  questionCount = 60
}: SubjectPageProps) {
  const colors = colorClasses[color]

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.gradient}`}>
      <div className="container mx-auto px-6 py-16">
        {/* Back Button */}
        <Link 
          href={backLink}
          className={`inline-flex items-center ${colors.text} ${colors.hover} font-medium mb-8 transition-colors group`}
        >
          <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {backText}
        </Link>

        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-7xl mb-6 inline-block animate-bounce">{icon}</span>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            {title}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            {description}
          </p>
          <div className={`h-1 w-32 bg-gradient-to-r ${colors.line} mx-auto rounded-full`}></div>
        </div>

        {/* Tests List */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            ชุดข้อสอบทั้งหมด ({tests?.length || 0})
          </h2>

          {/* Error State */}
          {error && (
            <div className="text-center py-20 bg-red-50 rounded-3xl border-2 border-red-200">
              <span className="text-6xl mb-4 inline-block">⚠️</span>
              <h3 className="text-xl font-bold text-red-800 mb-2">เกิดข้อผิดพลาด</h3>
              <p className="text-red-600">ไม่สามารถโหลดข้อสอบได้ กรุณาลองใหม่อีกครั้ง</p>
            </div>
          )}

          {/* Empty State */}
          {!error && (!tests || tests.length === 0) && (
            <div className="text-center py-20 bg-white rounded-3xl shadow-xl">
              <span className="text-8xl mb-6 inline-block">📝</span>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">ยังไม่มีข้อสอบในส่วนนี้</h3>
              <p className="text-gray-600 mb-8">กำลังเพิ่มข้อสอบเร็ว ๆ นี้ กลับมาดูใหม่นะครับ!</p>
              <Link 
                href={backLink}
                className={`inline-flex items-center px-8 py-4 bg-gradient-to-r ${colors.button} text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300`}
              >
                ← กลับไปเลือกหมวดอื่น
              </Link>
            </div>
          )}

          {/* Tests Grid */}
          {!error && tests && tests.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tests.map((test: any, index: number) => (
                <Link 
                  key={test.id} 
                  href={`/test/${test.id}`} 
                  className="group"
                >
                  <div className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent ${colors.border} transform hover:-translate-y-2 h-full flex flex-col`}>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 ${colors.bg} ${colors.textColor} rounded-full text-sm font-bold`}>
                        ชุดที่ {index + 1}
                      </span>
                      {test.difficulty && <DifficultyBadge level={test.difficulty} />}
                    </div>

                    {/* Title */}
                    <h3 className={`text-xl font-bold text-gray-900 mb-3 group-hover:${colors.text} transition-colors line-clamp-2 min-h-[3.5rem] flex-grow`}>
                      {test.title || `${title} ชุดที่ ${index + 1}`}
                    </h3>

                    {/* Description */}
                    {test.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {test.description}
                      </p>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span>{test.total_questions || questionCount} ข้อ</span>
                        </div>
                      </div>
                      <div className={`flex items-center ${colors.text} font-semibold text-sm`}>
                        เริ่มทำ
                        <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DifficultyBadge({ level }: { level: string }) {
  const configs: any = {
    easy: { label: 'ง่าย', icon: '🟢', className: 'bg-green-100 text-green-800' },
    medium: { label: 'ปานกลาง', icon: '🟡', className: 'bg-yellow-100 text-yellow-800' },
    hard: { label: 'ยาก', icon: '🔴', className: 'bg-red-100 text-red-800' }
  }
  const config = configs[level] || configs.medium
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${config.className}`}>
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </span>
  )
}