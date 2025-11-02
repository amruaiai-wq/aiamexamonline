// src/app/categories/pak-kor/thai/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server'
import SubjectPage from '../../components/SubjectPage'

export default async function PakKorThaiPage() {
  const supabase = await createSupabaseServerClient()

  const { data: tests, error } = await supabase
    .from('Tests')
    .select('id, title, description, difficulty, created_at')
    .eq('category', 'pak-kor')
    .eq('subcategory', 'thai')
    .order('created_at', { ascending: false })

  return (
    <SubjectPage
      title="ภาษาไทย"
      icon="🇹🇭"
      description="ทักษะการใช้ภาษาไทย ไวยากรณ์ และการเขียน"
      backLink="/categories/pak-kor"
      backText="กลับไป ภาค ก."
      color="green"
      tests={tests || []}
      error={error}
      questionCount={150}
    />
  )
}