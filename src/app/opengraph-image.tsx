// src/app/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'AiAm Exam - ระบบฝึกข้อสอบออนไลน์'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: 'bold',
            color: 'white',
            marginBottom: 20,
          }}
        >
          AiAm Exam
        </div>
        <div
          style={{
            fontSize: 40,
            color: 'rgba(255,255,255,0.9)',
            textAlign: 'center',
            maxWidth: 800,
          }}
        >
          ระบบฝึกข้อสอบออนไลน์ฟรี 100%
        </div>
        <div
          style={{
            fontSize: 30,
            color: 'rgba(255,255,255,0.8)',
            marginTop: 30,
          }}
        >
          🇬🇧 TOEIC | 📋 ภาค ก. | 🎓 A-Level | 🏛️ ศุลกากร
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}