// src/app/categories/a-level/english/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server'
import SubjectPage from '../../components/SubjectPage'

export default async function ALevelEnglishPage() {
  const supabase = await createSupabaseServerClient()

  const { data: tests, error } = await supabase
    .from('Tests')
    .select('id, title, description, difficulty, created_at')
    .eq('category', 'a-level')
    .eq('subcategory', 'english')
    .order('created_at', { ascending: false })

  return (
    <SubjectPage
      title="ภาษาอังกฤษ"
      icon="🇬🇧"
      description="Reading, Writing และ Grammar"
      backLink="/categories/a-level"
      backText="กลับไป A-Level"
      color="blue"
      tests={tests || []}
      error={error}
      questionCount={60}
    />
  )
}