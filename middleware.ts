import { withAuth } from "next-auth/middleware";
// FIXED: Import from next/server, not next/navigation
import { NextResponse } from "next/server"; 

export default withAuth(
  function middleware(req) {
    // This allows the request to continue if authenticated
    return NextResponse.next();
  },
  {
    callbacks: {
      // Returns true if the JWT token exists
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login", // Redirects here if unauthorized
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*", 
    "/marketplace/:path*", 
    "/analytics/:path*",
    "/my-credits/:path*"
  ],
};