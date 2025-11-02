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
    gradient: 'from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-blue-900',
    text: 'text-blue-600 dark:text-blue-400',
    hover: 'hover:text-blue-800 dark:hover:text-blue-300',
    border: 'hover:border-blue-400 dark:hover:border-blue-600',
    bg: 'bg-blue-100 dark:bg-blue-900/50',
    textColor: 'text-blue-600 dark:text-blue-300',
    line: 'from-blue-500 to-cyan-500'
  },
  purple: {
    gradient: 'from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900',
    text: 'text-purple-600 dark:text-purple-400',
    hover: 'hover:text-purple-800 dark:hover:text-purple-300',
    border: 'hover:border-purple-400 dark:hover:border-purple-600',
    bg: 'bg-purple-100 dark:bg-purple-900/50',
    textColor: 'text-purple-600 dark:text-purple-300',
    line: 'from-purple-500 to-pink-500'
  },
  green: {
    gradient: 'from-green-50 to-emerald-50 dark:from-gray-900 dark:to-green-900',
    text: 'text-green-600 dark:text-green-400',
    hover: 'hover:text-green-800 dark:hover:text-green-300',
    border: 'hover:border-green-400 dark:hover:border-green-600',
    bg: 'bg-green-100 dark:bg-green-900/50',
    textColor: 'text-green-600 dark:text-green-300',
    line: 'from-green-500 to-emerald-500'
  },
  red: {
    gradient: 'from-red-50 to-pink-50 dark:from-gray-900 dark:to-red-900',
    text: 'text-red-600 dark:text-red-400',
    hover: 'hover:text-red-800 dark:hover:text-red-300',
    border: 'hover:border-red-400 dark:hover:border-red-600',
    bg: 'bg-red-100 dark:bg-red-900/50',
    textColor: 'text-red-600 dark:text-red-300',
    line: 'from-red-500 to-pink-500'
  },
  orange: {
    gradient: 'from-orange-50 to-yellow-50 dark:from-gray-900 dark:to-orange-900',
    text: 'text-orange-600 dark:text-orange-400',
    hover: 'hover:text-orange-800 dark:hover:text-orange-300',
    border: 'hover:border-orange-400 dark:hover:border-orange-600',
    bg: 'bg-orange-100 dark:bg-orange-900/50',
    textColor: 'text-orange-600 dark:text-orange-300',
    line: 'from-orange-500 to-yellow-500'
  },
  cyan: {
    gradient: 'from-cyan-50 to-blue-50 dark:from-gray-900 dark:to-cyan-900',
    text: 'text-cyan-600 dark:text-cyan-400',
    hover: 'hover:text-cyan-800 dark:hover:text-cyan-300',
    border: 'hover:border-cyan-400 dark:hover:border-cyan-600',
    bg: 'bg-cyan-100 dark:bg-cyan-900/50',
    textColor: 'text-cyan-600 dark:text-cyan-300',
    line: 'from-cyan-500 to-blue-500'
  },
  indigo: {
    gradient: 'from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-900',
    text: 'text-indigo-600 dark:text-indigo-400',
    hover: 'hover:text-indigo-800 dark:hover:text-indigo-300',
    border: 'hover:border-indigo-400 dark:hover:border-indigo-600',
    bg: 'bg-indigo-100 dark:bg-indigo-900/50',
    textColor: 'text-indigo-600 dark:text-indigo-300',
    line: 'from-indigo-500 to-purple-500'
  },
  pink: {
    gradient: 'from-pink-50 to-rose-50 dark:from-gray-900 dark:to-pink-900',
    text: 'text-pink-600 dark:text-pink-400',
    hover: 'hover:text-pink-800 dark:hover:text-pink-300',
    border: 'hover:border-pink-400 dark:hover:border-pink-600',
    bg: 'bg-pink-100 dark:bg-pink-900/50',
    textColor: 'text-pink-600 dark:text-pink-300',
    line: 'from-pink-500 to-rose-500'
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
          <span className="text-7xl mb-6 inline-block">{icon}</span>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            {title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
            {description}
          </p>
          <div className={`h-1 w-32 bg-gradient-to-r ${colors.line} mx-auto rounded-full`}></div>
        </div>

        {/* Tests List */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            ชุดข้อสอบทั้งหมด ({tests?.length || 0})
          </h2>

          {error ? (
            <div className="text-center py-20 bg-red-50 dark:bg-red-900/20 rounded-3xl">
              <span className="text-6xl mb-4 inline-block">⚠️</span>
              <p className="text-red-600 dark:text-red-400 text-lg">เกิดข้อผิดพลาดในการโหลดข้อสอบ</p>
            </div>
          ) : tests && tests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tests.map((test: any, index: number) => (
                <Link key={test.id} href={`/test/${test.id}`} className="group">
                  <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent ${colors.border} transform hover:-translate-y-2`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 ${colors.bg} ${colors.textColor} rounded-full text-sm font-bold`}>
                        ชุดที่ {index + 1}
                      </span>
                      {test.difficulty && <DifficultyBadge level={test.difficulty} />}
                    </div>
                    <h3 className={`text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:${colors.text} transition-colors`}>
                      {test.title || `${title} ชุดที่ ${index + 1}`}
                    </h3>
                    {test.description && (
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{test.description}</p>
                    )}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{questionCount} คำถาม</span>
                      <div className={`flex items-center ${colors.text} font-semibold text-sm`}>
                        เริ่มทำข้อสอบ
                        <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl">
              <span className="text-6xl mb-4 inline-block">📭</span>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">ยังไม่มีข้อสอบในส่วนนี้</h3>
              <p className="text-gray-600 dark:text-gray-300">กำลังเพิ่มข้อสอบเร็ว ๆ นี้</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DifficultyBadge({ level }: { level: string }) {
  const configs: any = {
    easy: { label: 'ง่าย', icon: '🟢', className: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' },
    medium: { label: 'ปานกลาง', icon: '🟡', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' },
    hard: { label: 'ยาก', icon: '🔴', className: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' }
  }
  const config = configs[level] || configs.medium
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${config.className}`}>
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </span>
  )
}