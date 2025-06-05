import { cookies } from "next/headers";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import DashboardContent from "@/shared/dashboard";
import { Center, Loader } from "@mantine/core";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const cookie = (await cookies()).get("access_token");
    if (!cookie?.value) {
        redirect("/");
    }
    const response = await fetch("https://sleek-barracuda-414.convex.site/user/getByAccessToken?access_token=" + cookie?.value, {
        method: "GET",
    });
    const userData = await response.json();
    if (userData.error) {
        redirect("/");
    }
    return (
        <Suspense fallback={<Center h="100vh" w="100vw" bg="gray.1">
            <Loader />
        </Center>}>
            <DashboardContent user={userData}>
                {children}
            </DashboardContent>
        </Suspense>
    );

}