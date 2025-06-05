'use client'
import { Group, NavLink, Text, TextInput } from '@mantine/core';
import { Burger } from '@mantine/core';
import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useMutation, useQuery } from 'convex/react';
import { useEffect } from 'react';
import { useForm } from '@mantine/form';
import { useDebouncedValue } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

const links = [
    { label: 'Цели', href: '/dashboard' },
    { label: 'Донаты', href: '/dashboard/donations' },
    { label: 'Сборы', href: '/dashboard/goals' },
    { label: 'Оповещения', href: '/dashboard/alerts' },
]


export default function DashboardContent({ children }: { children: React.ReactNode }) {
    const searchParams = useSearchParams();
    const accessToken = searchParams.get("access_token");
    const user = useQuery(api.user.getUserByAccessToken, { accessToken: accessToken || localStorage.getItem("access_token") as string });
    const router = useRouter();
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

    const sumTargets = useQuery(api.target.getSumTargets, { userId: user?._id as Id<"users"> });
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
    useEffect(() => {
        if (!accessToken && !user?._id) {
            router.push("/");
        }
        if (accessToken && user?._id) {
            localStorage.setItem("access_token", accessToken);
            localStorage.setItem("user_id", user?._id as Id<"users">);
            router.push("/dashboard");
        }
    }, [searchParams]);
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