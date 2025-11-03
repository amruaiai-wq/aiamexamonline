// src/app/categories/customs/economics/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server'
import SubjectPage from '../../components/SubjectPage'

export default async function CustomsEconomicsPage() {
  const supabase = await createSupabaseServerClient()

  const { data: tests, error } = await supabase
    .from('Tests')
    .select('id, title, description, difficulty, created_at')
    .eq('category', 'customs')
    .eq('subcategory', 'economics')
    .order('created_at', { ascending: false })

  return (
    <SubjectPage
      title="การคิดเชิงวิเคราะห์"
      icon="📈"
      description="Analytical Thinking"
      backLink="/categories/customs"
      backText="กลับไป นักวิชาการศุลกากร"
      color="green"
      tests={tests || []}
      error={error}
      questionCount={30}
    />
  )
}