// src/components/QuestionNavigation.tsx
'use client';

interface QuestionNavigationProps {
  totalQuestions: number;
  currentQuestion: number;
  answeredQuestions: number[]; // Array ของ index ที่ตอบแล้ว
  onSelectQuestion: (index: number) => void;
}

export default function QuestionNavigation({
  totalQuestions,
  currentQuestion,
  answeredQuestions,
  onSelectQuestion,
}: QuestionNavigationProps) {
  
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <svg
          className="w-5 h-5 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        ภาพรวมข้อสอบ
      </h3>
      
      <div className="mb-4 pb-4 border-b border-gray-200">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600">ทำแล้ว:</span>
          <span className="font-semibold text-green-600">
            {answeredQuestions.length}/{totalQuestions}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(answeredQuestions.length / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2 max-h-96 overflow-y-auto pr-2">
        {Array.from({ length: totalQuestions }, (_, i) => {
          const isAnswered = answeredQuestions.includes(i);
          const isCurrent = i === currentQuestion;
          
          return (
            <button
              key={i}
              onClick={() => onSelectQuestion(i)}
              className={`
                aspect-square rounded-lg font-semibold text-sm transition-all duration-200
                ${isCurrent 
                  ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-300' 
                  : isAnswered
                  ? 'bg-green-100 text-green-700 hover:bg-green-200 border-2 border-green-400'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-300'
                }
              `}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-600"></div>
          <span className="text-gray-600">ข้อปัจจุบัน</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-100 border-2 border-green-400"></div>
          <span className="text-gray-600">ตอบแล้ว</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-100 border-2 border-gray-300"></div>
          <span className="text-gray-600">ยังไม่ได้ตอบ</span>
        </div>
      </div>
    </div>
  );
}