import { cookies } from "next/headers";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import DashboardContent from "@/shared/dashboard";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const cookie = (await cookies()).get("access_token");
    const user = await fetch("https://sleek-barracuda-414.convex.site/user/getByAccessToken?access_token=" + cookie?.value, {
        method: "GET",
    });
    const userData = await user.json();
    console.log("userData", userData);
    if (!userData) {
        redirect("/");
    }
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DashboardContent user={userData}>
                {children}
            </DashboardContent>
        </Suspense>
    );
}