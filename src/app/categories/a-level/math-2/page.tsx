// src/app/categories/a-level/math-2/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server'
import SubjectPage from '../../components/SubjectPage'

export default async function ALevelMath2Page() {
  const supabase = await createSupabaseServerClient()

  const { data: tests, error } = await supabase
    .from('Tests')
    .select('id, title, description, difficulty, created_at')
    .eq('category', 'a-level')
    .eq('subcategory', 'math-2')
    .order('created_at', { ascending: false })

  return (
    <SubjectPage
      title="คณิตศาสตร์ 2"
      icon="📐"
      description="สถิติ ความน่าจะเป็น และเมทริกซ์"
      backLink="/categories/a-level"
      backText="กลับไป A-Level"
      color="purple"
      tests={tests || []}
      error={error}
      questionCount={60}
    />
  )
}