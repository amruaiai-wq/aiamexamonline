// src/app/categories/customs/general-knowledge/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server'
import SubjectPage from '../../components/SubjectPage'

export default async function CustomsGeneralKnowledgePage() {
  const supabase = await createSupabaseServerClient()

  const { data: tests, error } = await supabase
    .from('Tests')
    .select('id, title, description, difficulty, created_at')
    .eq('category', 'customs')
    .eq('subcategory', 'general-knowledge')
    .order('created_at', { ascending: false })

  return (
    <SubjectPage
      title="ความรู้ทั่วไป"
      icon="📚"
      description="ความรู้ทั่วไปเกี่ยวกับกรมศุลกากร"
      backLink="/categories/customs"
      backText="กลับไป นักวิชาการศุลกากร"
      color="blue"
      tests={tests || []}
      error={error}
      questionCount={40}
    />
  )
}