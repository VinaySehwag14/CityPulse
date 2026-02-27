import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Routes that require authentication
const isProtectedRoute = createRouteMatcher([
    '/feed(.*)',
    '/events/new(.*)',
    '/users/(.*)',
]);

export default clerkMiddleware((auth, req) => {
    if (isProtectedRoute(req)) auth.protect();
});

export const config = {
    // Run middleware on all routes except _next internals and static files
    matcher: ['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)', '/(api|trpc)(.*)'],
};
