// src/lib/supabase/server.ts (Server Component Client)
// ใช้สำหรับ Server Component (page.tsx)
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers'; // <<<< next/headers ต้องอยู่ที่นี่เท่านั้น

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase URL or Anon Key in .env.local.");
}

export const createSupabaseServerClient = () => {
  return createServerComponentClient({ 
    cookies, 
    supabaseUrl, 
    supabaseKey: supabaseKey
  });
};