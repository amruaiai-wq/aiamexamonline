'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    // ตรวจสอบรหัสผ่านตรงกันหรือไม่
    if (password !== confirmPassword) {
      setErrorMessage('รหัสผ่านไม่ตรงกัน');
      setLoading(false);
      return;
    }

    // ตรวจสอบชื่อ
    if (!fullName.trim()) {
      setErrorMessage('กรุณากรอกชื่อ-นามสกุล');
      setLoading(false);
      return;
    }

    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName.trim(),
        }
      }
    });

    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
    } else {
      setSuccessMessage('สมัครสมาชิกสำเร็จ! กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชี');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium mb-6 transition-colors group"
        >
          <svg 
            className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          กลับหน้าหลัก
        </Link>

        {/* Form Card */}
        <form
          onSubmit={handleRegister}
          className="bg-white rounded-3xl shadow-2xl p-8 border-t-4 border-indigo-600"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl mb-4">
              <span className="text-3xl">🚀</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              สมัครสมาชิก
            </h2>
            <p className="text-gray-600">
              เริ่มต้นฝึกข้อสอบฟรีวันนี้
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-2xl mb-6 flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <span className="font-medium">{errorMessage}</span>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border-2 border-green-200 text-green-700 p-4 rounded-2xl mb-6 flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <span className="font-medium">{successMessage}</span>
            </div>
          )}

          {/* Full Name Field */}
          <div className="mb-5">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="fullName"
            >
              ชื่อ-นามสกุล
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="เช่น สมชาย ใจดี"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Email Field */}
          <div className="mb-5">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              อีเมล
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="example@email.com"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Password Field */}
          <div className="mb-5">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              รหัสผ่าน
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="อย่างน้อย 6 ตัวอักษร"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Confirm Password Field */}
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="confirmPassword"
            >
              ยืนยันรหัสผ่าน
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              placeholder="ใส่รหัสผ่านอีกครั้ง"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                กำลังสมัครสมาชิก...
              </div>
            ) : (
              'สมัครสมาชิก'
            )}
          </button>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            มีบัญชีอยู่แล้ว?{' '}
            <Link href="/login" className="text-indigo-600 hover:text-indigo-800 font-semibold">
              เข้าสู่ระบบที่นี่
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}