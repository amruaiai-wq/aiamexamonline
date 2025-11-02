// src/app/dashboard/components/SubjectPerformance.tsx
'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface SubjectPerformanceProps {
  data: Array<{
    subject: string
    average: number
    attempts: number
  }>
}

export default function SubjectPerformance({ data }: SubjectPerformanceProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        ผลการทำข้อสอบแยกตามวิชา
      </h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
          <XAxis 
            dataKey="subject" 
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
            domain={[0, 100]}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1F2937',
              border: 'none',
              borderRadius: '8px',
              color: '#fff'
            }}
          />
          <Legend />
          <Bar 
            dataKey="average" 
            fill="#8B5CF6" 
            radius={[8, 8, 0, 0]}
            name="คะแนนเฉลี่ย (%)"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}