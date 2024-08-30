import AccountForm from '@/components/AccountForm'
import { createClient } from '@/utils/supabase/server'

export default async function Account() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className='h-[98lvh] m-2 rounded-md border shadow-md flex items-center justify-center bg-zinc-50 dark:bg-zinc-950'>
      <AccountForm user={user} />
    </div>
  )
}