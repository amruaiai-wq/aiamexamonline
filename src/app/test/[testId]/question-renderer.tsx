'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface Question {
  id: string;
  question_text: string;
  choices: string[];
  correct_answer: string;
  explanation?: string;
}

export default function QuestionRenderer({
  testId,
}: {
  testId: string;
}) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [loading, setLoading] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const router = useRouter();

  const supabase = createClient();

  // โหลดคำถามและสร้าง attempt
  useEffect(() => {
    const init = async () => {
      try {
        // 1. โหลดคำถาม
        const { data: questionsData, error: questionsError } = await supabase
          .from('Question')
          .select('*')
          .eq('test_id', testId)
          .order('order_num', { ascending: true });

        if (questionsError) {
          console.error('❌ Load questions error:', questionsError);
          setLoading(false);
          return;
        }

        if (!questionsData || questionsData.length === 0) {
          console.error('❌ No questions found');
          setLoading(false);
          return;
        }

        console.log('✅ Loaded questions:', questionsData.length);
        setQuestions(questionsData);
        setAnswers(new Array(questionsData.length).fill(null));

        // 2. สร้าง TestAttempt
        const { data: attemptData, error: attemptError } = await supabase
          .from('TestAttempt')
          .insert({
            test_id: testId,
            total_questions: questionsData.length,
            start_time: new Date().toISOString(),
            is_completed: false
          })
          .select('*')
          .single();

        if (attemptError) {
          console.error('❌ Create attempt error:', attemptError);
          alert('เกิดข้อผิดพลาดในการสร้างการทำข้อสอบ: ' + attemptError.message);
          setLoading(false);
          return;
        }

        if (!attemptData || !attemptData.id) {
          console.error('❌ No attempt ID returned:', attemptData);
          alert('ไม่สามารถสร้าง ID การทำข้อสอบได้');
          setLoading(false);
          return;
        }

        console.log('✅ Attempt created with ID:', attemptData.id);
        setAttemptId(attemptData.id);
        setLoading(false);
      } catch (error) {
        console.error('❌ Init error:', error);
        setLoading(false);
      }
    };

    init();
  }, [testId]);

  const handleAnswer = async (choiceIndex: number) => {
    if (selectedAnswer !== null || !attemptId) {
      console.log('⚠️ Cannot answer:', { selectedAnswer, attemptId });
      return;
    }

    const q = questions[current];
    const correctAnswerIndex = parseInt(q.correct_answer) - 1;
    const isCorrect = choiceIndex === correctAnswerIndex;

    console.log('📝 Answering:', {
      questionId: q.id,
      attemptId,
      choiceIndex,
      correctAnswerIndex,
      isCorrect
    });

    // บันทึกคำตอบ
    const { error } = await supabase.from('UserAnswer').insert({
      attempt_id: attemptId,
      question_id: q.id,
      submitted_choice: choiceIndex,
      is_correct: isCorrect,
    });

    if (error) {
      console.error('❌ Insert answer error:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกคำตอบ: ' + error.message);
      return;
    }

    console.log('✅ Answer saved');
    const newAnswers = [...answers];
    newAnswers[current] = choiceIndex;
    setAnswers(newAnswers);
    setSelectedAnswer(choiceIndex);
    setShowExplanation(true);
  };

  const handleNext = async () => {
    console.log('🔵 handleNext called:', {
      current,
      totalQuestions: questions.length,
      isLastQuestion: current >= questions.length - 1,
      attemptId
    });

    // ถ้ายังไม่ใช่ข้อสุดท้าย → ไปข้อถัดไป
    if (current < questions.length - 1) {
      console.log('➡️ Going to next question');
      setCurrent(current + 1);
      setShowExplanation(false);
      setSelectedAnswer(null);
    } 
    // ถ้าเป็นข้อสุดท้ายแล้ว → คำนวณคะแนนและ redirect
    else {
      console.log('🏁 Last question - finishing test');
      
      if (!attemptId) {
        console.error('❌ No attemptId!');
        alert('เกิดข้อผิดพลาด: ไม่พบ Attempt ID');
        return;
      }

      // รวมข้อสุดท้ายที่เพิ่งตอบด้วย
      const allAnswers = [...answers];
      if (selectedAnswer !== null) {
        allAnswers[current] = selectedAnswer;
      }

      const correctCount = allAnswers.filter((a, i) => {
        if (a === null) return false;
        const correctIndex = parseInt(questions[i].correct_answer) - 1;
        return a === correctIndex;
      }).length;

      const scorePercent = Math.round((correctCount / questions.length) * 100);

      console.log('📊 Final score:', {
        attemptId,
        correctCount,
        total: questions.length,
        scorePercent
      });

      // อัพเดทคะแนนและเวลาสิ้นสุด
      console.log('💾 Updating score...');
      const { error: updateError } = await supabase
        .from('TestAttempt')
        .update({
          score: correctCount,
          score_percent: scorePercent,
          correct_answers: correctCount,
          is_completed: true,
          end_time: new Date().toISOString(),
        })
        .eq('id', attemptId);

      if (updateError) {
        console.error('❌ Update score error:', updateError);
        alert('เกิดข้อผิดพลาดในการบันทึกคะแนน: ' + updateError.message);
        return;
      }

      console.log('✅ Score updated successfully');
      console.log('🔄 Redirecting to: /result/' + attemptId);
      
      // ใช้ router.push แทน window.location.href
      router.push(`/result/${attemptId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">⏳ กำลังโหลดคำถาม...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-2">ไม่มีคำถาม</h2>
          <p className="text-gray-600">ไม่พบคำถามในชุดข้อสอบนี้</p>
        </div>
      </div>
    );
  }

  if (!attemptId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">เกิดข้อผิดพลาด</h2>
          <p className="text-gray-600">ไม่สามารถสร้างการทำข้อสอบได้</p>
        </div>
      </div>
    );
  }

  const q = questions[current];
  const correctAnswerIndex = parseInt(q.correct_answer) - 1;
  const isCorrect = selectedAnswer === correctAnswerIndex;
  const progress = ((current + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              ข้อที่ {current + 1} / {questions.length}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {Math.round(progress)}% เสร็จสิ้น
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border-t-4 border-indigo-600 mb-6">
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 leading-relaxed">
              {q.question_text}
            </h2>
          </div>

          {/* Choices */}
          <div className="space-y-3">
            {q.choices.map((choice, i) => {
              const isSelected = selectedAnswer === i;
              const isCorrectChoice = i === correctAnswerIndex;
              const showResult = showExplanation;

              let buttonClass = 'w-full text-left px-6 py-4 rounded-xl border-2 transition-all duration-200 ';
              
              if (!showResult) {
                buttonClass += 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-indigo-50 dark:hover:bg-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 cursor-pointer';
              } else {
                if (isCorrectChoice) {
                  buttonClass += 'bg-green-50 dark:bg-green-900/30 border-green-500 dark:border-green-600';
                } else if (isSelected) {
                  buttonClass += 'bg-red-50 dark:bg-red-900/30 border-red-500 dark:border-red-600';
                } else {
                  buttonClass += 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 opacity-60';
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={selectedAnswer !== null}
                  className={buttonClass}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      showResult && isCorrectChoice
                        ? 'bg-green-500 text-white'
                        : showResult && isSelected && !isCorrectChoice
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span className={`flex-1 ${
                      showResult && (isCorrectChoice || isSelected)
                        ? 'font-semibold text-gray-900 dark:text-white'
                        : 'text-gray-800 dark:text-gray-200'
                    }`}>
                      {choice}
                    </span>
                    {showResult && isCorrectChoice && (
                      <span className="flex-shrink-0 text-green-600 dark:text-green-400 text-xl">✓</span>
                    )}
                    {showResult && isSelected && !isCorrectChoice && (
                      <span className="flex-shrink-0 text-red-600 dark:text-red-400 text-xl">✗</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className={`rounded-2xl shadow-lg p-6 mb-6 border-l-4 ${
            isCorrect 
              ? 'bg-green-50 dark:bg-green-900/20 border-green-500 dark:border-green-600' 
              : 'bg-red-50 dark:bg-red-900/20 border-red-500 dark:border-red-600'
          }`}>
            <div className="flex items-start gap-3 mb-4">
              <div className={`text-3xl ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {isCorrect ? '✅' : '❌'}
              </div>
              <div className="flex-1">
                <h3 className={`text-xl font-bold mb-2 ${
                  isCorrect 
                    ? 'text-green-800 dark:text-green-300' 
                    : 'text-red-800 dark:text-red-300'
                }`}>
                  {isCorrect ? 'ตอบถูกต้อง!' : 'ตอบผิด'}
                </h3>
                {!isCorrect && (
                  <p className="text-red-700 dark:text-red-400 text-sm mb-3">
                    คำตอบที่ถูกต้องคือ: <strong>{q.choices[correctAnswerIndex]}</strong>
                  </p>
                )}
              </div>
            </div>
            
            {q.explanation && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">💡 คำอธิบาย:</p>
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                  {q.explanation}
                </p>
              </div>
            )}

            <button
              onClick={handleNext}
              className="mt-6 w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg"
            >
              {current >= questions.length - 1 ? '🎯 ดูผลคะแนน' : 'ข้อถัดไป →'}
            </button>
          </div>
        )}

        {!showExplanation && (
          <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
            💡 เลือกคำตอบที่คุณคิดว่าถูกต้อง
          </div>
        )}
      </div>
    </div>
  );
}