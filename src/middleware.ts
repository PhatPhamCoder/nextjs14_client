import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privatePaths = [`/me`];
const authPaths = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let sessionToken = request.cookies.get("sessionToken")?.value;

  const isPrivatePath = privatePaths.some((path) => pathname.startsWith(path));
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));

  // Chưa đăng nhập
  if (isPrivatePath && !sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Sau khi đăng nhập
  if (isAuthPath && sessionToken) {
    return NextResponse.redirect(new URL("/me", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [...privatePaths, ...authPaths],
};
