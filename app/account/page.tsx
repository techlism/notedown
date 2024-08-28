import AccountForm from '@/components/AccountForm'
import { createClient } from '@/utils/supabase/server'

export default async function Account() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return <p>
    {JSON.stringify(user, null, 2)}
  </p>
}