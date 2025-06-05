'use client'
import { Group, NavLink, Card, Text, Tooltip, ActionIcon, CopyButton } from '@mantine/core';
import { Burger } from '@mantine/core';
import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaUsers, FaMoneyBillWave, FaBullseye, FaBell, FaMoneyBill, FaCheck } from 'react-icons/fa';
import { MdOutlineRequestPage } from "react-icons/md";
import { useQuery } from 'convex/react';
import { useEffect, Suspense } from 'react';
import { api } from '../../../convex/_generated/api';

const links = [
    { label: 'Мои цели', href: '/dashboard' },
    { label: 'Цели', href: '/dashboard/targets' },
    { label: 'Донаты', href: '/dashboard/donations' },
    { label: 'Сборы', href: '/dashboard/goals' },
    { label: 'Оповещения', href: '/dashboard/alerts' },
]

const statData = [
    { icon: FaUsers, label: 'Посетители', value: '1,254', color: 'blue' },
    { icon: FaMoneyBillWave, label: 'Сборы', value: '₽125,000', color: 'green' },
    { icon: FaBullseye, label: 'Цели', value: '8', color: 'orange' },
    { icon: FaBell, label: 'Оповещения', value: '3', color: 'red' },
    { icon: FaMoneyBill, label: 'Выплачено', value: '1,254', color: 'blue' },
];

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

                    {/* <Group >
                        {statData.map((stat, index) => (
                            <Card key={index} withBorder w={100} h={50} p={5} m={0}>
                                <Group p={0} m={0} gap={2}>
                                    <stat.icon style={{ color: `var(--mantine-color-${stat.color}-6)` }} />
                                    <Text c={stat.color}>{stat.value}</Text>
                                </Group>
                                <Text size="xs" c="dimmed">{stat.label}</Text>
                            </Card>
                        ))}
                    </Group> */}
                    <Group ml="auto">
                        <CopyButton value={`https://diplom-liard-three.vercel.app/${user?.account}`} timeout={2000}>
                            {({ copied, copy }) => (
                                <Tooltip label={copied ? 'Ссылка скопирована' : 'Ссылка на страницу доната'} withArrow position="right">
                                    <ActionIcon size={"xl"} color={copied ? 'teal' : ''} variant="light" onClick={copy}>
                                        {copied ? <FaCheck /> : <MdOutlineRequestPage size={30} />}
                                    </ActionIcon>
                                </Tooltip>
                            )}
                        </CopyButton>
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