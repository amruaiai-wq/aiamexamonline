'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface Question {
  id: string;
  question_text: string;
  choices: string[];
  correct_answer: number;
  explanation?: string;
  question_number: number; // หมายเลขข้อในเอกสาร (1-4, 5-8, 9-12)
}

interface Passage {
  text: string;
  questions: Question[];
}

export default function ToeicTextCompletionRenderer({
  testId,
  attemptId,
}: {
  testId: string;
  attemptId: string;
}) {
  const [passages, setPassages] = useState<Passage[]>([]);
  const [currentPassageIndex, setCurrentPassageIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(0);
  const router = useRouter();
  const supabase = createClient();

  // โหลดคำถาม
  useEffect(() => {
    const loadQuestions = async () => {
      const { data, error } = await supabase
        .from('Question')
        .select('*')
        .eq('test_id', testId)
        .order('id');

      if (error) {
        console.error('Load questions error:', error.message);
        setLoading(false);
        return;
      }

      // จัดกลุ่มคำถามเป็น passages (4 ข้อต่อ passage)
      const groupedPassages: Passage[] = [];
      const questionsPerPassage = 4;

      for (let i = 0; i < data.length; i += questionsPerPassage) {
        const passageQuestions = data.slice(i, i + questionsPerPassage).map((q, idx) => ({
          id: q.id,
          question_text: q.question_text,
          choices: q.choices,
          correct_answer: q.correct_answer,
          explanation: q.explanation,
          question_number: i + idx + 1,
        }));

        // ใช้คำถามแรกเป็นข้อความ passage (ปรับตามโครงสร้างข้อมูลจริง)
        groupedPassages.push({
          text: passageQuestions[0]?.question_text || '',
          questions: passageQuestions,
        });
      }

      setPassages(groupedPassages);
      setLoading(false);
    };

    loadQuestions();
  }, [testId]);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleAnswer = async (choiceIndex: number) => {
    const currentPassage = passages[currentPassageIndex];
    const currentQuestion = currentPassage.questions[currentQuestionIndex];
    const correct = currentQuestion.correct_answer === choiceIndex;

    // บันทึกคำตอบ
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: choiceIndex,
    }));

    const { error } = await supabase.from('UserAnswer').insert([
      {
        attempt_id: attemptId,
        question_id: currentQuestion.id,
        submitted_choice: choiceIndex,
        is_correct: correct,
      },
    ]);

    if (error) console.error('Insert answer error:', error.message);
  };

  const handleNext = async () => {
    const currentPassage = passages[currentPassageIndex];

    // ถ้ายังมีคำถามในชุดนี้
    if (currentQuestionIndex < currentPassage.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
    // ถ้าหมดคำถามในชุดนี้ ไปชุดถัดไป
    else if (currentPassageIndex < passages.length - 1) {
      setCurrentPassageIndex((prev) => prev + 1);
      setCurrentQuestionIndex(0);
    }
    // ถ้าหมดทุกข้อ
    else {
      await finishTest();
    }
  };

  const finishTest = async () => {
    const totalQuestions = passages.reduce((sum, p) => sum + p.questions.length, 0);
    const score = Object.entries(answers).filter(([qId, ans]) => {
      const question = passages
        .flatMap((p) => p.questions)
        .find((q) => q.id === qId);
      return question && question.correct_answer === ans;
    }).length;

    await supabase
      .from('TestAttempt')
      .update({
        score,
        total_questions: totalQuestions,
        score_percent: (score / totalQuestions) * 100,
        time_spent_secs: timer,
        end_time: new Date().toISOString(),
      })
      .eq('id', attemptId);

    router.push(`/result/${attemptId}`);
  };

  if (loading) {
    return (
      <div className="text-center text-gray-500 py-10">⏳ กำลังโหลดข้อสอบ...</div>
    );
  }

  if (passages.length === 0) {
    return (
      <div className="text-center text-red-500 py-10">❌ ไม่มีคำถามในชุดนี้</div>
    );
  }

  const currentPassage = passages[currentPassageIndex];
  const currentQuestion = currentPassage.questions[currentQuestionIndex];
  const hasAnswered = currentQuestion.id in answers;

  // คำนวณสถานะคำถามในแต่ละชุด
  const getPassageStatus = (passageIndex: number) => {
    const passage = passages[passageIndex];
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;

    passage.questions.forEach((q) => {
      if (!(q.id in answers)) {
        unanswered++;
      } else if (answers[q.id] === q.correct_answer) {
        correct++;
      } else {
        incorrect++;
      }
    });

    return { correct, incorrect, unanswered, total: passage.questions.length };
  };

  const currentStatus = getPassageStatus(currentPassageIndex);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Timer */}
      <div className="fixed top-4 right-4 bg-white shadow-lg rounded-full px-6 py-3 z-50">
        <div className="flex items-center gap-2">
          <span className="text-blue-600 text-2xl">⏱️</span>
          <span className="text-2xl font-bold text-blue-600">{formatTime(timer)}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ซ้าย: Passage */}
          <div className="bg-white rounded-xl shadow-lg p-8 sticky top-8 h-fit">
            <div className="prose max-w-none">
              <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                {currentPassage.text}
              </p>
            </div>
          </div>

          {/* ขวา: คำถาม */}
          <div className="space-y-6">
            {/* หัวข้อคำถาม */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Question {currentQuestion.question_number}.
              </h2>
              <p className="text-lg text-gray-700 mb-6">{currentQuestion.question_text}</p>

              {/* ตัวเลือก */}
              <div className="space-y-3">
                {currentQuestion.choices.map((choice, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={hasAnswered}
                    className={`w-full text-left px-6 py-4 rounded-lg border-2 transition ${
                      hasAnswered && answers[currentQuestion.id] === i
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white hover:bg-gray-50 border-gray-200'
                    } disabled:opacity-60`}
                  >
                    <span className="font-semibold">
                      ({String.fromCharCode(65 + i)})
                    </span>{' '}
                    {choice}
                  </button>
                ))}
              </div>

              {/* ปุ่มถัดไป */}
              {hasAnswered && (
                <button
                  onClick={handleNext}
                  className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-lg transition"
                >
                  {currentQuestionIndex < currentPassage.questions.length - 1
                    ? 'ข้อถัดไป →'
                    : currentPassageIndex < passages.length - 1
                    ? 'Passage ถัดไป →'
                    : 'เสร็จสิ้น ✓'}
                </button>
              )}
            </div>

            {/* สถานะคำถาม */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold text-gray-800 mb-4">
                Questions {currentPassage.questions[0].question_number}-
                {currentPassage.questions[currentPassage.questions.length - 1].question_number}
              </h3>
              <div className="flex gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  <span>{currentStatus.correct}/{currentStatus.total} Correct</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span>{currentStatus.incorrect}/{currentStatus.total} Incorrect</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-gray-300"></span>
                  <span>{currentStatus.unanswered}/{currentStatus.total} Unanswered</span>
                </div>
              </div>

              {/* ปุ่มข้ามไปข้อ */}
              <div className="flex gap-2">
                {currentPassage.questions.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`w-12 h-12 rounded-full font-bold transition ${
                      idx === currentQuestionIndex
                        ? 'bg-indigo-600 text-white ring-4 ring-indigo-200'
                        : q.id in answers
                        ? 'bg-gray-200 text-gray-700'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {q.question_number}
                  </button>
                ))}
              </div>
            </div>

            {/* ปุ่ม Restart */}
            <button
              onClick={() => router.push('/')}
              className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Restart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}