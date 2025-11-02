export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="text-center">
        {/* Animated Spinner */}
        <div className="relative inline-flex mb-8">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">📚</span>
          </div>
        </div>
        
        {/* Loading Text */}
        <p className="text-gray-600 font-medium text-lg">กำลังโหลด...</p>
      </div>
    </div>
  )
}