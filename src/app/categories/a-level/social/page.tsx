// src/app/categories/a-level/social/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server'
import SubjectPage from '../../components/SubjectPage'

export default async function ALevelSocialPage() {
  const supabase = await createSupabaseServerClient()

  const { data: tests, error } = await supabase
    .from('Tests')
    .select('id, title, description, difficulty, created_at')
    .eq('category', 'a-level')
    .eq('subcategory', 'social')
    .order('created_at', { ascending: false })

  return (
    <SubjectPage
      title="สังคมศึกษา"
      icon="🌏"
      description="ประวัติศาสตร์ ภูมิศาสตร์ และสังคม"
      backLink="/categories/a-level"
      backText="กลับไป A-Level"
      color="orange"
      tests={tests || []}
      error={error}
      questionCount={60}
    />
  )
}