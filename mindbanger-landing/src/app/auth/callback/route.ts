import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/app/today'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${requestUrl.origin}${next}`)
    }
    console.error("Auth Callback Error:", error)
  }

  // Ak narazíme na chybu alebo nie je prítomný "code" fallback na login
  return NextResponse.redirect(`${requestUrl.origin}/login?error=Invalid_Token`)
}
