import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// Marketing is the unauthenticated half of the site — a signed-in visitor
// landing on any of these wants their results, not the sales page.
//
// `/privacy` and `/terms` are deliberately absent. The profile step's consent
// checkbox links to `/privacy`, and bouncing a student away from the policy
// they're being asked to agree to would be wrong; both also have to stay
// reachable for everyone regardless of session.
const MARKETING_PATHS = ["/", "/about", "/faq", "/contact", "/technology-careers"]

// Next 16 renamed the middleware convention to `proxy`; same execution point.
// Auth routing lives here so it's decided before a page renders, rather than
// each page re-deriving it. Sessions are JWT-only (ADR-001), so this is a
// cookie decode — no database round trip on the edge.
//
// This is the redirect layer, not the security boundary: `app/(app)/layout.tsx`
// still checks the session server-side, because a matcher that stops matching
// is a silent failure and should not be the only thing standing between an
// anonymous visitor and a student's blueprint.
export const proxy = async (request: NextRequest) => {
  const { nextUrl } = request
  const isSignedIn = Boolean(await getToken({ req: request }))

  if (nextUrl.pathname.startsWith("/assessments")) {
    return isSignedIn ? NextResponse.next() : NextResponse.redirect(new URL("/", nextUrl))
  }

  if (isSignedIn && MARKETING_PATHS.includes(nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/assessments", nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/",
    "/about",
    "/faq",
    "/contact",
    "/technology-careers",
    "/assessments",
    "/assessments/:path*",
  ],
}
