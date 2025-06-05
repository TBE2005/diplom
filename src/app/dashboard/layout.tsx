import DashboardContent from "@/shared/dashboard";
export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode,
}) {
    return (
        <DashboardContent>
            {children}
        </DashboardContent>
    );

}