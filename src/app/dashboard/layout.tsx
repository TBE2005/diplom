import DashboardContent from "@/shared/dashboard";
import { Center, Loader } from "@mantine/core";
import { Suspense } from "react";
export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode,
}) {
    return (
        <Suspense fallback={<Center h="100vh" w="100vw" bg="gray.1">
            <Loader />
        </Center>}>
            <DashboardContent>
                {children}
            </DashboardContent>
        </Suspense>
    );

}