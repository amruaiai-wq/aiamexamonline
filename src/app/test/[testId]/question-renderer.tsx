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
}

export default function QuestionRenderer({
  testId,
  attemptId,
}: {
  testId: string;
  attemptId: string;
}) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const router = useRouter();

  // ✅ ใช้ client ที่เข้ากับไฟล์ของคุณ
  const supabase = createClient();

  // โหลดคำถาม
  useEffect(() => {
    const loadQuestions = async () => {
      const { data, error } = await supabase
        .from('Question')
        .select('*')
        .eq('test_id', testId);

      if (error) console.error('Load questions error:', error.message);
      setQuestions(data || []);
      setAnswers(new Array(data?.length || 0).fill(-1));
      setLoading(false);
    };

    loadQuestions();
  }, [testId]);

  const handleAnswer = async (choiceIndex: number) => {
    const q = questions[current];
    const correct = q.correct_answer === choiceIndex;

    // ✅ บันทึกคำตอบ
    const { error } = await supabase.from('UserAnswer').insert([
      {
        attempt_id: attemptId,
        question_id: q.id,
        submitted_choice: choiceIndex,
        is_correct: correct,
      },
    ]);

    if (error) console.error('Insert answer error:', error.message);

    const newAnswers = [...answers];
    newAnswers[current] = choiceIndex;
    setAnswers(newAnswers);
    setIsCorrect(correct);
    setShowExplanation(true);
  };

  const handleNext = async () => {
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setShowExplanation(false);
      setIsCorrect(null);
    } else {
      // ✅ คำนวณคะแนนเมื่อทำครบ
      const score = answers.filter((a, i) => questions[i].correct_answer === a).length;

      const { error } = await supabase
        .from('TestAttempt')
        .update({
          score: score,
          total_questions: questions.length,
          score_percent: (score / questions.length) * 100,
          end_time: new Date().toISOString(),
        })
        .eq('id', attemptId);

      if (error) console.error('Update score error:', error.message);

      router.push(`/result/${attemptId}`);
    }
  };

  if (loading)
    return (
      <div className="text-center text-gray-500 py-10">
        ⏳ กำลังโหลดคำถาม...
      </div>
    );

  if (questions.length === 0)
    return (
      <div className="text-center text-red-500 py-10">
        ❌ ไม่มีคำถามในชุดนี้
      </div>
    );

  const q = questions[current];

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-indigo-600 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        ข้อ {current + 1}/{questions.length}
      </h2>
      <p className="text-lg mb-6">{q.question_text}</p>

      <div className="space-y-3">
        {q.choices.map((choice, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(i)}
            disabled={answers[current] !== -1}
            className={`w-full text-left px-4 py-3 rounded-lg border transition ${
              answers[current] === i
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
            }`}
          >
            {choice}
          </button>
        ))}
      </div>

      {/* ✅ แสดงเฉลยทันที */}
      {showExplanation && (
        <div
          className={`mt-6 p-4 rounded-lg ${
            isCorrect ? 'bg-green-50 border border-green-400' : 'bg-red-50 border border-red-400'
          }`}
        >
          <p className={`font-semibold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
            {isCorrect ? '✅ ตอบถูก!' : '❌ ตอบผิด'}
          </p>
          <p className="text-gray-700 mt-2 leading-relaxed">
            💬 {q.explanation || 'ไม่มีคำอธิบายเพิ่มเติม'}
          </p>

          <button
            onClick={handleNext}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
          >
            {current + 1 === questions.length ? 'ดูผลคะแนน' : 'ข้อถัดไป →'}
          </button>
        </div>
      )}
    </div>
  );
}
