// src/app/categories/a-level/physics/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server'
import SubjectPage from '../../components/SubjectPage'

export default async function ALevelPhysicsPage() {
  const supabase = await createSupabaseServerClient()

  const { data: tests, error } = await supabase
    .from('Tests')
    .select('id, title, description, difficulty, created_at')
    .eq('category', 'a-level')
    .eq('subcategory', 'physics')
    .order('created_at', { ascending: false })

  return (
    <SubjectPage
      title="ฟิสิกส์"
      icon="⚛️"
      description="กลศาสตร์ ไฟฟ้า และคลื่น"
      backLink="/categories/a-level"
      backText="กลับไป A-Level"
      color="cyan"
      tests={tests || []}
      error={error}
      questionCount={60}
    />
  )
}