// src/components/testimonials/TestimonialCard.tsx
'use client'

interface TestimonialCard {
  name: string
  avatar?: string
  rating: number
  comment: string
  category?: string
  date: string
}

export default function TestimonialCard({
  name,
  avatar,
  rating,
  comment,
  category,
  date
}: TestimonialCard) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-indigo-300 dark:hover:border-indigo-700">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
          {avatar ? (
            <img src={avatar} alt={name} className="w-12 h-12 rounded-full" />
          ) : (
            name.charAt(0).toUpperCase()
          )}
        </div>

        {/* Name & Rating */}
        <div className="flex-1">
          <h4 className="font-bold text-gray-900 dark:text-white">{name}</h4>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}>
                ⭐
              </span>
            ))}
          </div>
        </div>

        {/* Category Badge */}
        {category && (
          <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 rounded-full text-xs font-semibold">
            {category}
          </span>
        )}
      </div>

      {/* Comment */}
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
        "{comment}"
      </p>

      {/* Date */}
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {new Date(date).toLocaleDateString('th-TH', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </p>
    </div>
  )
}