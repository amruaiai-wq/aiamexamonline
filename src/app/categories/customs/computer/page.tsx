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
      title="คอมพิวเตอร์"
      icon="💻"
      description="ความรู้พื้นฐานคอมพิวเตอร์และระบบสารสนเทศ"
      backLink="/categories/customs"
      backText="กลับไป นักวิชาการศุลกากร"
      color="orange"
      tests={tests || []}
      error={error}
      questionCount={30}
    />
  )
}