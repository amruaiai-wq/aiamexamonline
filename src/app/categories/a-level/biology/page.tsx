// src/app/categories/a-level/biology/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server'
import SubjectPage from '../../components/SubjectPage'

export default async function ALevelBiologyPage() {
  const supabase = await createSupabaseServerClient()

  const { data: tests, error } = await supabase
    .from('Tests')
    .select('id, title, description, difficulty, created_at')
    .eq('category', 'a-level')
    .eq('subcategory', 'biology')
    .order('created_at', { ascending: false })

  return (
    <SubjectPage
      title="ชีววิทยา"
      icon="🧬"
      description="เซลล์ พันธุกรรม และสิ่งมีชีวิต"
      backLink="/categories/a-level"
      backText="กลับไป A-Level"
      color="pink"
      tests={tests || []}
      error={error}
      questionCount={60}
    />
  )
}