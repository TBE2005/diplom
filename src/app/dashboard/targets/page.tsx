'use client'
import { useRouter } from "next/navigation";
import { Container, Grid, Card, Text, Title, Group, Progress, Button, Center, Loader } from "@mantine/core";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface User {
  _id: Id<"users">;
  account: string;
  balance: number;
}

interface Target {
  _id: Id<"targets">;
  name: string;
  collected: number;
  total: number;
  userId: Id<"users">;
  goalId?: Id<"goals">;
  alertId?: Id<"alerts">;
}

export default function TargetsPage() {
  const router = useRouter();
  const targets = useQuery(api.target.get);
  const users = useQuery(api.user.getAll);

  if (!targets || !users) {
    return (
      <Center h={400}>
        <Loader size="lg" />
      </Center>
    );
  }

  // Map users to their targets for easier lookup
  const targetsWithUsers = targets.map((target: Target) => ({
    ...target,
    user: users.find((user: User) => user._id === target.userId)
  }));

  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="lg">Все цели</Title>
      <Grid>
        {targetsWithUsers.map((target) => {
          const progress = target.total > 0 ? (target.collected / target.total) * 100 : 0;
          
          return (
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={target._id}>
              <Card shadow="sm" padding="lg" radius="md" withBorder onClick={() => router.push(`/${target._id}`)} style={{ cursor: 'pointer' }}>
                <Card.Section withBorder inheritPadding py="xs">
                  <Group justify="space-between">
                    <Text fw={500}>{target.name}</Text>
                    <Text size="sm" c="dimmed">
                      {target.user?.account || "Неизвестный пользователь"}
                    </Text>
                  </Group>
                </Card.Section>
                
                <Group mt="md" mb="xs">
                  <Text>
                    {target.collected} ₽ из {target.total} ₽
                  </Text>
                </Group>
                
                <Progress value={progress} size="md" radius="xl" />
                
                <Button variant="light" color="blue" fullWidth mt="md" radius="md" onClick={() => router.push(`/${target._id}`)}>
                  Пожертвовать
                </Button>
              </Card>
            </Grid.Col>
          );
        })}
      </Grid>
    </Container>
  );
}
