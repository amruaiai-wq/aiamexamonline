// src/components/TestInterface.tsx
'use client';

import { useState, useEffect } from 'react';
import Timer from './Timer';
import QuestionNavigation from './QuestionNavigation';

interface Question {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation?: string;
}

interface TestInterfaceProps {
  examTitle: string;
  questions: Question[];
  timeLimit: number; // เวลาในหน่วยนาที
  onSubmit: (answers: Record<string, string>, timeUsed: number) => void;
}

export default function TestInterface({
  examTitle,
  questions,
  timeLimit,
  onSubmit
}: TestInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60); // แปลงเป็นวินาที
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false); // แสดงเฉลยหรือไม่
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<string, boolean>>({}); // เก็บข้อที่ส่งแล้ว

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const isCurrentAnswered = !!answers[currentQuestion.id];
  const isCurrentSubmitted = !!submittedAnswers[currentQuestion.id];

  // ตรวจสอบว่าตอบข้อนี้แล้วหรือยัง
  const isAnswered = (questionId: string) => !!answers[questionId];

  // จำนวนข้อที่ตอบแล้ว
  const answeredCount = Object.keys(answers).length;

  // เลือกคำตอบ
  const handleSelectAnswer = (answer: string) => {
    if (isCurrentSubmitted) return; // ถ้าส่งแล้วห้ามเปลี่ยน
    
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));
    setShowExplanation(false); // ซ่อนเฉลยเมื่อเปลี่ยนคำตอบ
  };

  // ส่งคำตอบข้อปัจจุบัน
  const handleSubmitCurrentAnswer = () => {
    if (!isCurrentAnswered) {
      alert('กรุณาเลือกคำตอบก่อนส่ง');
      return;
    }

    setSubmittedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: true
    }));
    setShowExplanation(true);
  };

  // ไปข้อถัดไป
  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowExplanation(false); // ซ่อนเฉลยเมื่อไปข้อใหม่
    }
  };

  // ย้อนกลับข้อก่อนหน้า
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowExplanation(false); // ซ่อนเฉลยเมื่อย้อนกลับ
    }
  };

  // กระโดดไปข้อที่เลือก
  const handleJumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    setShowExplanation(false); // ซ่อนเฉลยเมื่อกระโดดข้อ
  };

  // ส่งคำตอบ
  const handleSubmit = async () => {
    if (answeredCount < totalQuestions) {
      const confirmSubmit = window.confirm(
        `คุณทำได้เพียง ${answeredCount}/${totalQuestions} ข้อ\nต้องการส่งคำตอบหรือไม่?`
      );
      if (!confirmSubmit) return;
    }

    setIsSubmitting(true);
    const timeUsed = timeLimit * 60 - timeRemaining;
    await onSubmit(answers, timeUsed);
  };

  // เมื่อหมดเวลา
  const handleTimeUp = () => {
    alert('หมดเวลา! ระบบจะส่งคำตอบอัตโนมัติ');
    handleSubmit();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                {examTitle}
              </h1>
              <p className="text-gray-600">
                ข้อ {currentQuestionIndex + 1} จาก {totalQuestions} | 
                ตอบแล้ว <span className="font-semibold text-green-600">{answeredCount}</span> ข้อ
              </p>
            </div>
            
            {/* Timer */}
            <Timer 
              timeRemaining={timeRemaining}
              setTimeRemaining={setTimeRemaining}
              onTimeUp={handleTimeUp}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Main Content - คำถามและตัวเลือก */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              
              {/* คำถาม */}
              <div className="mb-8">
                <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  ข้อที่ {currentQuestionIndex + 1}
                </div>
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {currentQuestion.question_text}
                </h2>
              </div>

              {/* ตัวเลือก */}
              <div className="space-y-3 mb-8">
                {['A', 'B', 'C', 'D'].map((option) => {
                  const optionKey = `option_${option.toLowerCase()}` as keyof Question;
                  const optionText = currentQuestion[optionKey] as string;
                  const isSelected = answers[currentQuestion.id] === option;
                  const isCorrect = option === currentQuestion.correct_answer;
                  
                  // ถ้าส่งคำตอบแล้ว แสดงสี
                  let buttonClass = '';
                  if (isCurrentSubmitted && showExplanation) {
                    if (isCorrect) {
                      buttonClass = 'border-green-500 bg-green-50'; // คำตอบที่ถูก
                    } else if (isSelected && !isCorrect) {
                      buttonClass = 'border-red-500 bg-red-50'; // คำตอบที่เลือกผิด
                    } else {
                      buttonClass = 'border-gray-200 bg-gray-50 opacity-60';
                    }
                  } else {
                    buttonClass = isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50';
                  }
                  
                  return (
                    <button
                      key={option}
                      onClick={() => handleSelectAnswer(option)}
                      disabled={isCurrentSubmitted}
                      className={`w-full text-left p-4 md:p-5 rounded-xl border-2 transition-all duration-200 ${buttonClass} ${
                        isCurrentSubmitted ? 'cursor-not-allowed' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          isCurrentSubmitted && showExplanation
                            ? isCorrect
                              ? 'bg-green-500 text-white'
                              : isSelected && !isCorrect
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-300 text-gray-600'
                            : isSelected
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}>
                          {option}
                        </span>
                        <span className="text-gray-800 leading-relaxed flex-1">
                          {optionText}
                        </span>
                        {/* แสดงไอคอน ✓ หรือ ✗ */}
                        {isCurrentSubmitted && showExplanation && (
                          <span className="flex-shrink-0 text-xl">
                            {isCorrect ? '✓' : isSelected && !isCorrect ? '✗' : ''}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* แสดงเฉลย */}
              {isCurrentSubmitted && showExplanation && (
                <div className={`mb-6 p-5 rounded-xl border-2 ${
                  answers[currentQuestion.id] === currentQuestion.correct_answer
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                }`}>
                  <div className="flex items-start gap-3 mb-3">
                    <span className={`text-2xl ${
                      answers[currentQuestion.id] === currentQuestion.correct_answer
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}>
                      {answers[currentQuestion.id] === currentQuestion.correct_answer ? '✓' : '✗'}
                    </span>
                    <div className="flex-1">
                      <p className={`font-bold text-lg mb-2 ${
                        answers[currentQuestion.id] === currentQuestion.correct_answer
                          ? 'text-green-700'
                          : 'text-red-700'
                      }`}>
                        {answers[currentQuestion.id] === currentQuestion.correct_answer
                          ? 'ถูกต้อง! 🎉'
                          : 'ผิด! 😔'}
                      </p>
                      <p className="text-gray-700 mb-2">
                        <strong>คำตอบที่ถูกต้อง:</strong> ตัวเลือก {currentQuestion.correct_answer}
                      </p>
                      {currentQuestion.explanation && (
                        <div className="mt-3 pt-3 border-t border-gray-300">
                          <p className="font-semibold text-gray-800 mb-1">📖 คำอธิบาย:</p>
                          <p className="text-gray-700 leading-relaxed">
                            {currentQuestion.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ปุ่มส่งคำตอบข้อนี้ */}
              {!isCurrentSubmitted && (
                <div className="mb-6">
                  <button
                    onClick={handleSubmitCurrentAnswer}
                    disabled={!isCurrentAnswered}
                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ส่งคำตอบข้อนี้
                  </button>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className="flex-1 px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                >
                  ← ข้อก่อนหน้า
                </button>
                
                {currentQuestionIndex === totalQuestions - 1 ? (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'กำลังส่ง...' : '✓ ส่งคำตอบ'}
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    ข้อถัดไป →
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Question Navigation */}
          <div className="lg:col-span-1">
            <QuestionNavigation
              totalQuestions={totalQuestions}
              currentQuestion={currentQuestionIndex}
              answeredQuestions={Object.keys(answers).map(id => 
                questions.findIndex(q => q.id === id)
              )}
              onSelectQuestion={handleJumpToQuestion}
            />
            
            {/* Submit Button - Mobile */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full mt-4 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'กำลังส่ง...' : '✓ ส่งคำตอบทั้งหมด'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}