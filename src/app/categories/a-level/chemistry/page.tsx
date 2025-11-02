// src/app/categories/a-level/chemistry/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server'
import SubjectPage from '../../components/SubjectPage'

export default async function ALevelChemistryPage() {
  const supabase = await createSupabaseServerClient()

  const { data: tests, error } = await supabase
    .from('Tests')
    .select('id, title, description, difficulty, created_at')
    .eq('category', 'a-level')
    .eq('subcategory', 'chemistry')
    .order('created_at', { ascending: false })

  return (
    <SubjectPage
      title="เคมี"
      icon="🧪"
      description="เคมีทั่วไป เคมีอินทรีย์ และเคมีฟิสิกส์"
      backLink="/categories/a-level"
      backText="กลับไป A-Level"
      color="green"
      tests={tests || []}
      error={error}
      questionCount={60}
    />
  )
}