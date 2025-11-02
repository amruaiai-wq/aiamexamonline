import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// ====== Function: รวม Tailwind classes ======
// ใช้สำหรับรวม classes และแก้ conflict
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ====== Function: Format วันที่เป็นภาษาไทย ======
export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// ====== Function: Format วันเวลาเป็นภาษาไทย ======
export function formatDateTime(date: string | Date) {
  return new Date(date).toLocaleString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// ====== Function: Format ระยะเวลา (วินาที → นาที:วินาที) ======
export function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  
  if (minutes === 0) {
    return `${remainingSeconds} วินาที`
  }
  
  return `${minutes} นาที ${remainingSeconds} วินาที`
}

// ====== Function: คำนวณเปอร์เซ็นต์ ======
export function calculatePercentage(score: number, total: number): number {
  if (total === 0) return 0
  return Math.round((score / total) * 100)
}

// ====== Function: แปลงเปอร์เซ็นต์เป็นเกรด ======
export function getGrade(percentage: number) {
  if (percentage >= 90) {
    return {
      grade: 'A',
      label: 'ดีเยี่ยม',
      color: 'text-green-600',
      bg: 'bg-green-100',
      darkBg: 'dark:bg-green-900',
      darkText: 'dark:text-green-200',
    }
  }
  if (percentage >= 80) {
    return {
      grade: 'B',
      label: 'ดี',
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      darkBg: 'dark:bg-blue-900',
      darkText: 'dark:text-blue-200',
    }
  }
  if (percentage >= 70) {
    return {
      grade: 'C',
      label: 'ปานกลาง',
      color: 'text-yellow-600',
      bg: 'bg-yellow-100',
      darkBg: 'dark:bg-yellow-900',
      darkText: 'dark:text-yellow-200',
    }
  }
  if (percentage >= 60) {
    return {
      grade: 'D',
      label: 'พอใช้',
      color: 'text-orange-600',
      bg: 'bg-orange-100',
      darkBg: 'dark:bg-orange-900',
      darkText: 'dark:text-orange-200',
    }
  }
  return {
    grade: 'F',
    label: 'ควรปรับปรุง',
    color: 'text-red-600',
    bg: 'bg-red-100',
    darkBg: 'dark:bg-red-900',
    darkText: 'dark:text-red-200',
  }
}

// ====== Function: สุ่มลำดับ array (Fisher-Yates shuffle) ======
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

// ====== Function: จำกัดจำนวนตัวอักษร ======
export function truncate(str: string, length: number) {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

// ====== Function: Debounce (ลดการเรียก function บ่อย) ======
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// ====== Function: Sleep (รอเวลาก่อนทำต่อ) ======
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}