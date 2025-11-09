// src/components/Timer.tsx
'use client';

import { useEffect } from 'react';

interface TimerProps {
  timeRemaining: number; // เวลาที่เหลือในหน่วยวินาที
  setTimeRemaining: (time: number | ((prev: number) => number)) => void;
  onTimeUp: () => void;
}

export default function Timer({ timeRemaining, setTimeRemaining, onTimeUp }: TimerProps) {
  
  useEffect(() => {
    if (timeRemaining <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, onTimeUp, setTimeRemaining]);

  // แปลงวินาทีเป็น นาที:วินาที
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  // สีเตือน
  const getColorClass = () => {
    if (timeRemaining <= 60) return 'text-red-600 animate-pulse'; // น้อยกว่า 1 นาที
    if (timeRemaining <= 300) return 'text-orange-600'; // น้อยกว่า 5 นาที
    return 'text-blue-600';
  };

  const getBackgroundClass = () => {
    if (timeRemaining <= 60) return 'bg-red-50 border-red-300';
    if (timeRemaining <= 300) return 'bg-orange-50 border-orange-300';
    return 'bg-blue-50 border-blue-300';
  };

  return (
    <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 ${getBackgroundClass()}`}>
      <svg
        className={`w-6 h-6 ${getColorClass()}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <div className={`text-xl font-bold font-mono ${getColorClass()}`}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
    </div>
  );
}