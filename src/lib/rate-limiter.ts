import { RateLimiterMemory } from 'rate-limiter-flexible'

// ====== Rate Limiter สำหรับ Login ======
// อนุญาตให้ login ได้ 5 ครั้ง ภายใน 15 นาที
const loginLimiter = new RateLimiterMemory({
  points: 5, // จำนวนครั้งที่อนุญาต
  duration: 60 * 15, // ใน 15 นาที
})

// ====== Rate Limiter สำหรับ API ทั่วไป ======
// อนุญาตให้เรียก API ได้ 100 ครั้ง ต่อนาที
const apiLimiter = new RateLimiterMemory({
  points: 100,
  duration: 60, // 1 นาที
})

// ====== Rate Limiter สำหรับการสมัครสมาชิก ======
// อนุญาตให้สมัครได้ 3 ครั้ง ต่อชั่วโมง
const registerLimiter = new RateLimiterMemory({
  points: 3,
  duration: 60 * 60, // 1 ชั่วโมง
})

// ====== Function: ตรวจสอบ Login Rate Limit ======
export async function checkLoginRateLimit(identifier: string) {
  try {
    await loginLimiter.consume(identifier)
    return { 
      success: true,
      remaining: await loginLimiter.get(identifier).then(res => res?.remainingPoints || 0)
    }
  } catch (error: any) {
    return {
      success: false,
      error: 'พยายามเข้าสู่ระบบมากเกินไป กรุณารอ 15 นาที',
      retryAfter: Math.round(error.msBeforeNext / 1000), // seconds
    }
  }
}

// ====== Function: ตรวจสอบ API Rate Limit ======
export async function checkApiRateLimit(identifier: string) {
  try {
    await apiLimiter.consume(identifier)
    return { 
      success: true,
      remaining: await apiLimiter.get(identifier).then(res => res?.remainingPoints || 0)
    }
  } catch (error: any) {
    return {
      success: false,
      error: 'คำขอมากเกินไป กรุณารอสักครู่',
      retryAfter: Math.round(error.msBeforeNext / 1000),
    }
  }
}

// ====== Function: ตรวจสอบ Register Rate Limit ======
export async function checkRegisterRateLimit(identifier: string) {
  try {
    await registerLimiter.consume(identifier)
    return { 
      success: true,
      remaining: await registerLimiter.get(identifier).then(res => res?.remainingPoints || 0)
    }
  } catch (error: any) {
    return {
      success: false,
      error: 'พยายามสมัครสมาชิกมากเกินไป กรุณารอ 1 ชั่วโมง',
      retryAfter: Math.round(error.msBeforeNext / 1000),
    }
  }
}