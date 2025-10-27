'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AuthStatus() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // ✅ ดึง user ปัจจุบันตอนโหลดหน้า
    supabase.auth.getUser().then(({ data, error }) => {
      if (!error && data?.user) setUser(data.user);
      setLoading(false);
    });

    // ✅ ฟังการเปลี่ยนแปลง session (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe?.();
    };
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/login')}
          className="px-5 py-2.5 text-sm font-semibold text-indigo-600 bg-white border-2 border-indigo-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200"
        >
          เข้าสู่ระบบ
        </button>
        <button
          onClick={() => router.push('/register')}
          className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
        >
          สมัครสมาชิก
        </button>
      </div>
    );
  }

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'ผู้ใช้';

  return (
    <div className="flex items-center gap-3">
      {/* User Name */}
      <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white rounded-xl border-2 border-indigo-100">
        <span className="text-2xl">👤</span>
        <span className="text-sm font-semibold text-gray-700">
          {displayName}
        </span>
      </div>

      {/* Dashboard Button */}
      <button
        onClick={() => router.push('/dashboard')}
        className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
      >
        Dashboard
      </button>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
      >
        ออกจากระบบ
      </button>
    </div>
  );
}