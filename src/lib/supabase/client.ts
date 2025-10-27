// src/lib/supabase/client.ts
'use client';

import { createBrowserClient } from '@supabase/ssr';

// ✅ Export ชื่อที่ใช้ในโค้ด
export const createSupabaseClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

// Export alias (ถ้ามีที่อื่นใช้ชื่อนี้)
export const createClient = createSupabaseClient;