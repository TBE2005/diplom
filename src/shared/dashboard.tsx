'use client'
import { Group, NavLink, TextInput, Loader, Center, Badge } from '@mantine/core';
import { Burger } from '@mantine/core';
import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useMutation, useQuery } from 'convex/react';
import { useEffect, useState } from 'react';
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
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
    const pathname = usePathname();

    // Get token from searchParams or localStorage
    useEffect(() => {
        const accessToken = searchParams.get("access_token");
        if (accessToken) {
            setToken(accessToken);
            // Если токен получен из URL, сохраняем его сразу
            localStorage.setItem("access_token", accessToken);
        } else {
            const storedToken = localStorage.getItem("access_token");
            if (storedToken) {
                setToken(storedToken);
            } else {
                // No token found, redirect to login
                router.push("/");
            }
        }
        setIsLoading(false);
    }, [searchParams, router]);

    // Only query user data after we have a token
    const user = useQuery(api.user.getUserByAccessToken,
        token ? { accessToken: token } : "skip"
    );

    // Сохраняем user_id в localStorage как только получим данные пользователя
    useEffect(() => {
        if (user?._id) {
            localStorage.setItem("user_id", user._id as string);
        }
    }, [user?._id]);

    // Only query other data after we have user data
    const sumTargets = useQuery(api.target.getSumTargets,
        user?._id ? { userId: user._id as Id<"users"> } : "skip"
    );

    const updateUser = useMutation(api.user.update);

    const form = useForm({
        initialValues: {
            name: user?.name || '',
        },
    });

    // Update form when user data loads
    useEffect(() => {
        if (user?.name) {
            form.setValues({ name: user.name });
        }
    }, [user?.name]);

    const [debouncedValues] = useDebouncedValue(form.values, 500);

    useEffect(() => {
        if (user?._id && debouncedValues.name !== user?.name && debouncedValues.name !== '') {
            updateUser({ id: user._id as Id<"users">, name: debouncedValues.name });
            notifications.show({
                title: "Успешно",
                message: "Имя обновлено",
                color: "green",
            });
        }
    }, [debouncedValues, user]);

    useEffect(() => {
        if (token && user?._id) {
            localStorage.setItem("access_token", token);
            // Удаляем дублирование, так как теперь user_id сохраняется в отдельном useEffect

            // If we came from a redirect with access_token in URL, clean it up
            if (searchParams.get("access_token")) {
                router.push("/dashboard");
            }
        }
    }, [token, user?._id, router, searchParams]);

    if (isLoading) {
        return (
            <Center style={{ height: '100vh' }}>
                <Loader size="xl" />
            </Center>
        );
    }

    if (!token || !user) {
        return (
            <Center style={{ height: '100vh' }}>
                <Loader size="xl" />
            </Center>
        );
    }

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
                    <Group visibleFrom="sm">
                        <Badge>Собрано: {sumTargets}</Badge>
                        <TextInput {...form.getInputProps("name")} />
                    </Group>
                </Group>
            </AppShell.Header>
            <AppShell.Navbar p="md">
                <Group hiddenFrom="sm" mb="md">
                    <Badge>Собрано: {sumTargets}</Badge>
                    <TextInput {...form.getInputProps("name")} />
                </Group>
                {links.map((link) => (
                    <NavLink component={Link} key={link.href} {...link} active={pathname === link.href} />
                ))}
            </AppShell.Navbar>
            <AppShell.Main>{children}</AppShell.Main>
        </AppShell>
    );
}