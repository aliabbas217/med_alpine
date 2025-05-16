import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";

const PUBLIC_PATHS = ["/", "/login", "/signup", "/forgot-password"];

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  const pathname = request.nextUrl.pathname;

  // Check if the path is public
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // If there is no session, redirect to login
  if (!session) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", encodeURIComponent(pathname));
    return NextResponse.redirect(url);
  }

  // Validate the session
  try {
    await adminAuth.verifySessionCookie(session, true);
    return NextResponse.next();
  } catch (error) {
    // Invalid session, clear the cookie and redirect to login
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("session");
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api routes
     * 2. /_next/static (static files)
     * 3. /_next/image (image optimization files)
     * 4. /favicon.ico (favicon file)
     * 5. /public files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$|.*\\.png$|.*\\.jpg$|.*\\.jpeg$).*)",
  ],
};