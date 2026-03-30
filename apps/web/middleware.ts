import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Routes that require authentication
const isProtectedRoute = createRouteMatcher([
    '/users/(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
    // Run middleware on all routes except _next internals and static files
    // Explicitly excluding opengraph-image and twitter-image ensures zero middleware interference for crawlers
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)|.*opengraph-image.*|.*twitter-image.*).*)', 
        '/(api|trpc)(.*)'
    ],
};
