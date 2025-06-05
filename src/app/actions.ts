'use server'
import { cookies } from "next/headers";

export async function setCookie(accessToken: string) {
    (await cookies()).set("access_token", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
    });
}