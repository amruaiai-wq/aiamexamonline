// app/result/[attemptId]/CircularProgress.tsx
'use client'

import { useEffect, useState } from 'react'

interface CircularProgressProps {
  percentage: number
  correctCount: number
  totalQuestions: number
}

export default function CircularProgress({ 
  percentage, 
  correctCount, 
  totalQuestions 
}: CircularProgressProps) {
  const [displayPercentage, setDisplayPercentage] = useState(0)
  
  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayPercentage(percentage)
    }, 100)
    return () => clearTimeout(timer)
  }, [percentage])

  // SVG circle calculations
  const size = 280
  const strokeWidth = 20
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (displayPercentage / 100) * circumference

  // Color based on percentage
  const getColor = () => {
    if (percentage >= 80) return 'text-green-500'
    if (percentage >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getStrokeColor = () => {
    if (percentage >= 80) return '#10b981' // green-500
    if (percentage >= 60) return '#eab308' // yellow-500
    return '#ef4444' // red-500
  }

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* SVG Circle */}
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200 dark:text-gray-700"
        />
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getStrokeColor()}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
        {/* Tick marks */}
        {[...Array(20)].map((_, i) => {
          const angle = (i * 18) - 90 // 360/20 = 18 degrees each
          const x1 = size / 2 + (radius - 5) * Math.cos((angle * Math.PI) / 180)
          const y1 = size / 2 + (radius - 5) * Math.sin((angle * Math.PI) / 180)
          const x2 = size / 2 + (radius + 5) * Math.cos((angle * Math.PI) / 180)
          const y2 = size / 2 + (radius + 5) * Math.sin((angle * Math.PI) / 180)
          
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-300 dark:text-gray-600"
            />
          )
        })}
      </svg>

      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className={`text-6xl font-bold ${getColor()} mb-2`}>
          {displayPercentage}%
        </div>
        <div className="text-gray-600 dark:text-gray-400 font-medium text-lg">
          Correct
        </div>
        <div className="text-gray-500 dark:text-gray-500 text-sm mt-1">
          {correctCount}/{totalQuestions}
        </div>
      </div>
    </div>
  )
}