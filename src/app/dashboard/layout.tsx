import DashboardLayout from "@/components/dashboard-layout";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const userId = (await cookies()).get("user_id")?.value;
    if (!userId) {
        redirect("/");
    }
    return <DashboardLayout userId={userId}>{children}</DashboardLayout>;
}