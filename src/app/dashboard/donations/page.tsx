'use client'
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Card, Text, Group, Badge, Stack, Container, Title, Divider } from "@mantine/core";
import { FaMoneyBillWave } from "react-icons/fa";

export default function Page() {
    const donations = useQuery(api.donation.getByUserId, { userId: localStorage.getItem("user_id") as Id<"users"> });
    
    return (
        <Container size="xl" p="md">
            <Title order={2} mb="md">Донаты</Title>
            <Divider mb="lg" />
            <Stack gap="md">
                {donations?.map(donation => (
                    <Card key={donation._id} withBorder shadow="sm" radius="md" p="md" w="100%">
                        <Group justify="space-between" mb="xs">
                            <Group>
                                <FaMoneyBillWave size={20} />
                                <Text fw={700} size="lg">{donation.amount} руб.</Text>
                            </Group>
                            {donation.target?.name && (
                                <Badge color="blue" variant="light">
                                    {donation.target.name}
                                </Badge>
                            )}
                        </Group>
                        {donation.message && (
                            <Text c="dimmed" size="sm">
                                "{donation.message}"
                            </Text>
                        )}
                    </Card>
                ))}
            </Stack>
        </Container>
    );
}
