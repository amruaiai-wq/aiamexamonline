// src/app/dashboard/components/WeakAreas.tsx
'use client'

interface WeakArea {
  topic: string
  wrongCount: number
  totalAttempts: number
  percentage: number
}

interface WeakAreasProps {
  areas: WeakArea[]
}

export default function WeakAreas({ areas }: WeakAreasProps) {
  if (!areas || areas.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          🎯 จุดที่ควรทบทวน
        </h3>
        <div className="text-center py-10">
          <span className="text-6xl mb-4 inline-block">✅</span>
          <p className="text-gray-600 dark:text-gray-300">
            ยังไม่พบจุดที่ควรทบทวน ทำข้อสอบเพิ่มเพื่อวิเคราะห์
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl p-6 shadow-lg">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
        <span>🎯</span>
        จุดที่ควรทบทวน
      </h3>
      
      <div className="space-y-4">
        {areas.map((area, index) => (
          <div 
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-gray-900 dark:text-white">
                {area.topic}
              </h4>
              <span className="px-3 py-1 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300 rounded-full text-sm font-semibold">
                {area.percentage.toFixed(0)}% ผิด
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-red-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${area.percentage}%` }}
              ></div>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              ตอบผิด {area.wrongCount} จาก {area.totalAttempts} ครั้ง
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          💡 <strong>คำแนะนำ:</strong> ทบทวนหัวข้อที่ตอบผิดบ่อยและลองทำข้อสอบซ้ำเพื่อปรับปรุงความเข้าใจ
        </p>
      </div>
    </div>
  )
}