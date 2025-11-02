import { z } from 'zod'

// ====== Login Validation ======
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'กรุณากรอกอีเมล')
    .email('รูปแบบอีเมลไม่ถูกต้อง'),
  password: z
    .string()
    .min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'),
})

export type LoginInput = z.infer<typeof loginSchema>

// ====== Register Validation ======
export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, 'กรุณากรอกอีเมล')
      .email('รูปแบบอีเมลไม่ถูกต้อง'),
    password: z
      .string()
      .min(8, 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร')
      .regex(/[A-Z]/, 'ต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว')
      .regex(/[a-z]/, 'ต้องมีตัวพิมพ์เล็กอย่างน้อย 1 ตัว')
      .regex(/[0-9]/, 'ต้องมีตัวเลขอย่างน้อย 1 ตัว'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'รหัสผ่านไม่ตรงกัน',
    path: ['confirmPassword'],
  })

export type RegisterInput = z.infer<typeof registerSchema>

// ====== Test Submission Validation ======
export const testSubmissionSchema = z.object({
  testId: z.string().uuid('Invalid test ID'),
  answers: z.array(
    z.object({
      questionId: z.string().uuid('Invalid question ID'),
      selectedAnswer: z.string().min(1, 'Please select an answer'),
    })
  ),
  timeSpent: z.number().positive('Time spent must be positive'),
})

export type TestSubmissionInput = z.infer<typeof testSubmissionSchema>

// ====== Helper function to validate ======
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown) {
  try {
    const validated = schema.parse(data)
    return { success: true as const, data: validated }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false as const,
        errors: error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      }
    }
    return {
      success: false as const,
      errors: [{ field: 'unknown', message: 'Validation failed' }],
    }
  }
}