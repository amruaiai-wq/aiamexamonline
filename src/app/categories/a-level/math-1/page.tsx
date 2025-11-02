// src/app/categories/a-level/math-1/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server'
import SubjectPage from '../../components/SubjectPage'

export default async function ALevelMath1Page() {
  const supabase = await createSupabaseServerClient()

  const { data: tests, error } = await supabase
    .from('Tests')
    .select('id, title, description, difficulty, created_at')
    .eq('category', 'a-level')
    .eq('subcategory', 'math-1')
    .order('created_at', { ascending: false })

  return (
    <SubjectPage
      title="คณิตศาสตร์ 1"
      icon="🔢"
      description="พีชคณิต เรขาคณิต และแคลคูลัส"
      backLink="/categories/a-level"
      backText="กลับไป A-Level"
      color="indigo"
      tests={tests || []}
      error={error}
      questionCount={60}
    />
  )
}