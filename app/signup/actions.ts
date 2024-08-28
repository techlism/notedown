'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function signup(formData: FormData) {
    const supabase = createClient()
  
    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    //   options : {
    //     data : {
    //         name : formData.get('name') as string
    //     }
    //   } 
    // Needs schema modifications to work
    }

    const { error } = await supabase.auth.signUp(data)
  
    if (error) {
        console.error(error)
      redirect('/error');
   
    }
  
    revalidatePath('/', 'layout')
    redirect('/')
  
}