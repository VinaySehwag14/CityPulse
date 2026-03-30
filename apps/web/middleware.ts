import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Routes that require authentication
const isProtectedRoute = createRouteMatcher([
    '/users/(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
    // Explicitly skip Clerk logic for OG images to ensure crawlers have unobstructed access
    if (req.nextUrl.pathname.endsWith('/opengraph-image')) {
        return;
    }

    if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
    // Run middleware on all routes except _next internals and static files
    matcher: ['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)', '/(api|trpc)(.*)'],
};
