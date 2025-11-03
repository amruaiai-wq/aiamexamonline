// src/app/categories/customs/computer/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server'
import SubjectPage from '../../components/SubjectPage'

export default async function CustomsComputerPage() {
  const supabase = await createSupabaseServerClient()

  const { data: tests, error } = await supabase
    .from('Tests')
    .select('id, title, description, difficulty, created_at')
    .eq('category', 'customs')
    .eq('subcategory', 'computer')
    .order('created_at', { ascending: false })

  return (
    <SubjectPage
      title="ความรู้เกี่ยวกับจรรยาบรรณ"
      icon="🌟"
      description="ความรู้เกี่ยวกับวินัย จรรยาบรรณและจรรยาของราชการ"
      backLink="/categories/customs"
      backText="กลับไป นักวิชาการศุลกากร"
      color="orange"
      tests={tests || []}
      error={error}
      questionCount={30}
    />
  )
}