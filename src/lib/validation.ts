// src/lib/validation.ts
import { z } from 'zod';

// Schema for question validation
const questionSchema = z.object({
  question_text: z.string().min(1, 'คำถามต้องไม่ว่าง'),
  question_type: z.enum(['multiple_choice', 'true_false', 'fill_blank']),
  choices: z.array(z.string()).nullable().optional(),
  correct_answer: z.string().min(1, 'คำตอบต้องไม่ว่าง'),
  explanation: z.string().nullable().optional(),
  order_num: z.number().int().positive().optional(),
});

// Schema for test upload validation
const testUploadSchema = z.object({
  title: z.string().min(1, 'ชื่อข้อสอบต้องไม่ว่าง'),
  description: z.string().optional(),
  category: z.enum(['toeic', 'pak-kor', 'a-level', 'customs']),
  subcategory: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  time_limit_minutes: z.number().int().positive().optional(),
  questions: z.array(questionSchema).min(1, 'ต้องมีอย่างน้อย 1 คำถาม'),
});

export function validateTestData(data: unknown) {
  try {
    const result = testUploadSchema.parse(data);
    return {
      success: true as const,
      data: result,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false as const,
        errors: error.issues.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      };
    }
    throw error;
  }
}

export type TestUploadData = z.infer<typeof testUploadSchema>;
export type QuestionData = z.infer<typeof questionSchema>;