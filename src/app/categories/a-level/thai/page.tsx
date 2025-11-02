// src/app/categories/a-level/thai/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server'
import SubjectPage from '../../components/SubjectPage'

export default async function ALevelThaiPage() {
  const supabase = await createSupabaseServerClient()

  const { data: tests, error } = await supabase
    .from('Tests')
    .select('id, title, description, difficulty, created_at')
    .eq('category', 'a-level')
    .eq('subcategory', 'thai')
    .order('created_at', { ascending: false })

  return (
    <SubjectPage
      title="ภาษาไทย"
      icon="🇹🇭"
      description="วรรณคดี วรรณกรรม และการใช้ภาษา"
      backLink="/categories/a-level"
      backText="กลับไป A-Level"
      color="red"
      tests={tests || []}
      error={error}
      questionCount={60}
    />
  )
}