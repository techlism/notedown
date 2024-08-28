import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // biome-ignore lint/complexity/noForEach: <explanation>
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          // biome-ignore lint/complexity/noForEach: <explanation>
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // refreshing the auth token
  await supabase.auth.getUser()

  return supabaseResponse
}