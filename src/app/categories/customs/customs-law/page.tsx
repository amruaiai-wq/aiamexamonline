// src/app/categories/customs/customs-law/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server'
import SubjectPage from '../../components/SubjectPage'

export default async function CustomsLawPage() {
  const supabase = await createSupabaseServerClient()

  const { data: tests, error } = await supabase
    .from('Tests')
    .select('id, title, description, difficulty, created_at')
    .eq('category', 'customs')
    .eq('subcategory', 'customs-law')
    .order('created_at', { ascending: false })

  return (
    <SubjectPage
      title="กฎหมายศุลกากร"
      icon="⚖️"
      description="พระราชบัญญัติศุลกากร และกฎหมายที่เกี่ยวข้อง"
      backLink="/categories/customs"
      backText="กลับไป นักวิชาการศุลกากร"
      color="purple"
      tests={tests || []}
      error={error}
      questionCount={50}
    />
  )
}