import { convexAuthNextjsMiddleware, createRouteMatcher, isAuthenticatedNextjs, nextjsMiddlewareRedirect } from "@convex-dev/auth/nextjs/server";

const isPublicPage = createRouteMatcher(["/auth"]);

export default convexAuthNextjsMiddleware((request) => {
    console.log('Request URL:', request.url); // แสดง URL ของคำขอที่เข้ามา
    console.log('Authenticated:', isAuthenticatedNextjs()); // แสดงสถานะการล็อกอิน
    console.log('Public Page:', isPublicPage(request)); // แสดงสถานะของหน้า

    // ตรวจสอบว่าไม่ใช่หน้าเปิดและผู้ใช้ไม่ได้ล็อกอิน
    if (!isPublicPage(request) && !isAuthenticatedNextjs()) {
        return nextjsMiddlewareRedirect(request, "/auth");
    }
    // ตรวจสอบว่าหน้าเปิดและผู้ใช้ล็อกอิน
    if (isPublicPage(request) && isAuthenticatedNextjs()) {
        return nextjsMiddlewareRedirect(request, "/");
    }
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
