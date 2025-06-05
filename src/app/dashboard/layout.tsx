'use client'
import { Group, NavLink } from '@mantine/core';
import { Burger } from '@mantine/core';
import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from 'convex/react';
import { useEffect, Suspense } from 'react';
import { api } from '../../../convex/_generated/api';

const links = [
    { label: 'Цели', href: '/dashboard' },
    { label: 'Донаты', href: '/dashboard/donations' },
    { label: 'Сборы', href: '/dashboard/goals' },
    { label: 'Оповещения', href: '/dashboard/alerts' },
]


function DashboardContent({ children }: { children: React.ReactNode }) {
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
    const searchParams = useSearchParams();
    const user = useQuery(api.user.getByAccessToken, { access_token: searchParams.get("access_token") || "" });
    useEffect(() => {
        if (user?._id) {
            localStorage.setItem("access_token", user.access_token);
            localStorage.setItem("user_id", user._id);
        }
    }, [user]);
    const pathname = usePathname();
    
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