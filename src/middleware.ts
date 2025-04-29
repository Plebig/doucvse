import axios from "axios";
import { getToken } from "next-auth/jwt";
import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const pathname = req.nextUrl.pathname;

    const isAuth = await getToken({ req });
    const isLoginPage = pathname.startsWith("/login");
    const isRegisterPage = pathname.startsWith("/register");
    const idDashboardPage = pathname.startsWith("/dashboard");

    const sensitiveRoutes = ["/dashboard/add"];
    const isAccessingSensitiveRoute = sensitiveRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (isLoginPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      return NextResponse.next();
    }

    if (isRegisterPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      return NextResponse.next();
    }

    if (idDashboardPage) {
      if (isAuth) {
        if (isAuth.role === "teacher") {
          try {

            await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/teacher-informations-exists`, {
              method: "POST",
              body: JSON.stringify({ userId: isAuth.id }),
            });
            
          } catch (error: any) {
            if (error.response && error.response.status === 400) {
              return NextResponse.redirect(new URL(`/register/register-detail/id?userId=${isAuth.id}`, req.url));
            }
          }
        }
      } else {
      }
    }
    
    if (!isAuth && isAccessingSensitiveRoute) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  },
  {
    callbacks: {
      async authorized() {
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/users/:id*", "/", "/login", "/register" , "/dashboard/:path*"],
};
