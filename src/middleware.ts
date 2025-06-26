import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isProtected = ["/home"].some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if ( isProtected && !token ) {
    return NextResponse.redirect(new URL("/userLogin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/home/:path*"], 
};
