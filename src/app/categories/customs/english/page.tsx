// src/app/categories/customs/english/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server'
import SubjectPage from '../../components/SubjectPage'

export default async function CustomsEnglishPage() {
  const supabase = await createSupabaseServerClient()

  const { data: tests, error } = await supabase
    .from('Tests')
    .select('id, title, description, difficulty, created_at')
    .eq('category', 'customs')
    .eq('subcategory', 'english')
    .order('created_at', { ascending: false })

  return (
    <SubjectPage
      title="ภาษาอังกฤษ"
      icon="🇬🇧"
      description="Reading Comprehension และ Grammar"
      backLink="/categories/customs"
      backText="กลับไป นักวิชาการศุลกากร"
      color="indigo"
      tests={tests || []}
      error={error}
      questionCount={30}
    />
  )
}