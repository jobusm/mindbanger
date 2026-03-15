import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Mapped supported languages
const SUPPORTED_LANGUAGES = ['en', 'sk', 'cs']
const DEFAULT_LANGUAGE = 'en'

// Mapping countries to languages
const COUNTRY_TO_LANG: Record<string, string> = {
  SK: 'sk',
  CZ: 'cs',
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // 1. Check if the user already has a preferred language saved in cookies
  let language = request.cookies.get('user-lang')?.value

  if (!language || !SUPPORTED_LANGUAGES.includes(language)) {
    // 2. If no cookie, detect IP country from Vercel's headers
    const country = request.headers.get('x-vercel-ip-country') || ''
    
    // 3. Default to 'en' if the country is not mapped
    language = COUNTRY_TO_LANG[country.toUpperCase()] || DEFAULT_LANGUAGE
    
    // 4. Save the detected language into cookies for subsequent requests
    response.cookies.set('user-lang', language, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
    })
  }

  // 5. Inject the language directly into headers so server components can access it easily
  response.headers.set('x-user-lang', language)

  return response
}

export const config = {
  matcher: [
    // Avoid running middleware on static files and API endpoints (unless api endpoints need it, but we can read cookies there)
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
