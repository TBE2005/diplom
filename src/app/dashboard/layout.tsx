import DashboardLayout from "@/components/dashboard-layout";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const accessToken = (await cookies()).get("access_token")?.value;
    if (!accessToken) {
        redirect("/");
    }
    return <DashboardLayout accessToken={accessToken}>{children}</DashboardLayout>;
}