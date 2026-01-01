import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
    const url = req.nextUrl;
    const hostname = req.headers.get("host") || "";

    // Define paths that should NOT be rewritten (API, Next internals are already handled by matcher config usually)
    // but explicitly checking doesn't hurt.

    const searchParams = url.searchParams.toString();
    const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;

    // 1. Admin Subdomain Logic
    // Check for "admin." prefix (works for admin.saileelarahasya.com and admin.localhost)
    if (hostname.startsWith("admin.")) {
        // If already on /admin path, don't double-prefix
        if (url.pathname.startsWith('/admin')) {
            return NextResponse.next();
        }
        // Rewrite all requests to the /admin path (which maps to src/app/admin)
        return NextResponse.rewrite(new URL(`/admin${path}`, req.url));
    }

    // 2. Main Domain Logic
    // Ensure we don't accidentally expose /admin on the main domain
    // EXCEPTION 1: Allow localhost for local development
    // EXCEPTION 2: Allow .vercel.app for Preview Deployments (where subdomains are hard)
    const isPreview = hostname.includes('.vercel.app');
    if (url.pathname.startsWith('/admin') && !hostname.includes('localhost') && !isPreview) {
        return NextResponse.redirect(new URL('https://admin.saileelarahasya.com', req.url));
    }

    // Fallthrough to normal handling (src/app/(main) maps to root)
    // No need to rewrite to (main) explicitly as route groups are transparent
    return NextResponse.next();
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
