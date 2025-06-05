'use client'
import { Group, NavLink, Text, TextInput } from '@mantine/core';
import { Burger } from '@mantine/core';
import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useMutation, useQuery } from 'convex/react';
import { useEffect, Suspense } from 'react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { useForm } from '@mantine/form';
import { useDebouncedValue } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';

const links = [
    { label: 'Цели', href: '/dashboard' },
    { label: 'Донаты', href: '/dashboard/donations' },
    { label: 'Сборы', href: '/dashboard/goals' },
    { label: 'Оповещения', href: '/dashboard/alerts' },
]


function DashboardContent({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
    const searchParams = useSearchParams();
    const user = useQuery(api.user.getByAccessToken, { access_token: searchParams.get("access_token") || "" });
    const sumTargets = useQuery(api.target.getSumTargets, { userId: user?._id as Id<"users"> });
    useEffect(() => {
        if (user?._id) {
            localStorage.setItem("access_token", user.access_token);
            localStorage.setItem("user_id", user._id);
        } else {
            async function getInfo() {
                const user = await fetch("https://yoomoney.ru/api/account-info", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("access_token")}`
                    }
                });
                const userData = await user.json();
                if (userData?._id) {
                    localStorage.setItem("access_token", userData.access_token);
                    localStorage.setItem("user_id", userData._id);
                } else {
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("user_id");
                    router.push("/");
                }
            }
            getInfo();
        }
    }, [user]);
    const pathname = usePathname();
    const updateUser = useMutation(api.user.update);
    const form = useForm({
        initialValues: {
            name: user?.name,
        },
    });
    const [debouncedValues] = useDebouncedValue(form.values, 500);
    useEffect(() => {
        if (debouncedValues.name !== user?.name) {
            updateUser({ id: user?._id as Id<"users">, name: debouncedValues.name });
            notifications.show({
                title: "Успешно",
                message: "Имя обновлено",
                color: "green",
            });
        }
    }, [debouncedValues]);
    return (
        <AppShell
            header={{ height: 70 }}
            navbar={{
                width: 300,
                breakpoint: 'sm',
                collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
            }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md" pt="xs" pb="xs">
                    <Group>
                        <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
                        <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
                    </Group>
                    <Group>
                        <Text>{sumTargets}</Text>
                        <TextInput {...form.getInputProps("name")} />
                    </Group>
                </Group>
            </AppShell.Header>
            <AppShell.Navbar p="md">
                {links.map((link) => (
                    <NavLink component={Link} key={link.href} {...link} active={pathname === link.href} />
                ))}
            </AppShell.Navbar>
            <AppShell.Main>{children}</AppShell.Main>
        </AppShell>
    );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DashboardContent>
                {children}
            </DashboardContent>
        </Suspense>
    );
}