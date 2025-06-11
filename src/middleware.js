import NextAuth from "next-auth";
import authConfig from "@/auth.config";


const { auth } = NextAuth(authConfig);

export default auth((req) => {

  if (!req.auth) {
    let callbackUrl = req.nextUrl.pathname;
    if (req.nextUrl.search) {
      callbackUrl += req.nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    return Response.redirect(
      req.nextUrl.origin + `/auth/login?callbackUrl=${encodedCallbackUrl}`
    );
  }
});

export const config = {
  matcher: [
    "/((?!api|auth|images|icons|manifest.json|normas|novedades|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|$).*)",
  ],
};