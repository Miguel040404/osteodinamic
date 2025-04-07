// Run on edge
import NextAuth from "next-auth";
import authConfig from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    console.log(' MIDDLEWARE', req.nextUrl.pathname, req.auth);

    if (!req.auth) {  // NO AUTENTICADO

        let callbackUrl = req.nextUrl.pathname;
        if (req.nextUrl.search) {
            callbackUrl += req.nextUrl.search;
        }

        const encodedCallbackUrl = encodeURIComponent(callbackUrl);
        return Response.redirect(req.nextUrl.origin
            + `/auth/login?callbackUrl=${encodedCallbackUrl}`)
    }

})


export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - auth
         * - home 
         * - pizzas
         * - images (into /public)
         * - pwa (into /public) 
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         * - $ (root page)
         */
        '/((?!api|auth|images|pwa|home|pizzas|pedidos|repartidores|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|$).*)',
    ],
}