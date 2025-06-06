import { AppShell, Button, Container, Text, Title, Group, Stack, Card, SimpleGrid, ThemeIcon, rem, Flex } from "@mantine/core";
import Link from "next/link";
import { FaChartLine, FaMoneyBillWave, FaRubleSign, FaShieldAlt, FaUserFriends } from "react-icons/fa";

const clientId = "E69B1725E46F1E7855155A622D7952CF616D37C90D134955B4604150B175DF69"
const redirectUri = "https://sleek-barracuda-414.convex.site/callback"
const scope = "account-info+operation-history+payment-p2p"
const responseType = "code"
const url = `https://yoomoney.ru/oauth/authorize?client_id=${clientId}&response_type=${responseType}&redirect_uri=${redirectUri}&scope=${scope}`

const features = [
  {
    icon: FaChartLine,
    title: 'Аналитика расходов',
    description: 'Визуализация ваших финансовых операций для лучшего понимания расходов',
  },
  {
    icon: FaMoneyBillWave,
    title: 'Управление бюджетом',
    description: 'Создавайте бюджеты и отслеживайте свои финансовые цели',
  },
  {
    icon: FaShieldAlt,
    title: 'Безопасность',
    description: 'Ваши данные надежно защищены и никогда не передаются третьим лицам',
  },
  {
    icon: FaUserFriends,
    title: 'Совместные счета',
    description: 'Управляйте финансами вместе с близкими людьми',
  },
];

export default function Home() {
  return (
    <AppShell>
      <Container size="lg">
        {/* Hero Section */}
        <Flex
          mih={600}
          gap="xl"
          justify="center"
          align="center"
          direction={{ base: 'column', md: 'row' }}
          wrap="wrap"
          pt={50}
          pb={50}
        >
          <div style={{ flex: 1, maxWidth: '600px' }}>
            <Title order={1} size="h1" fw={900} c="blue.7">
              Финансовый помощник для YooMoney
            </Title>
            <Text size="xl" mt="md" c="dimmed">
              Анализируйте свои расходы, управляйте бюджетом и достигайте финансовых целей с нашим удобным сервисом
            </Text>
            <Group mt={30}>
              <Button component={Link} href={url} size="lg" radius="md">
                Войти через YooMoney
              </Button>
              <Button component={Link} href="#features" variant="light" size="lg" radius="md">
                Узнать больше
              </Button>
            </Group>
          </div>
          <div style={{ flex: 1, maxWidth: '500px' }}>
            <FaRubleSign
              size={500}
              color="blue"
            />
          </div>
        </Flex>

        {/* Features Section */}
        <Stack id="features" py={50}>
          <Title order={2} ta="center" mt="sm">
            Возможности сервиса
          </Title>
          <Text c="dimmed" ta="center" size="lg" maw={700} mx="auto" mt="sm">
            Наш сервис предоставляет полный набор инструментов для управления вашими финансами
          </Text>

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl" mt={30}>
            {features.map((feature) => (
              <Card key={feature.title} shadow="md" radius="md" padding="lg" withBorder>
                <ThemeIcon
                  size={50}
                  radius="md"
                  variant="light"
                  color="blue"
                >
                  <feature.icon style={{ width: rem(26), height: rem(26) }} />
                </ThemeIcon>
                <Text fw={700} fz="lg" mt="md">{feature.title}</Text>
                <Text c="dimmed" fz="sm" mt="sm">{feature.description}</Text>
              </Card>
            ))}
          </SimpleGrid>
        </Stack>

        {/* CTA Section */}
        <Card withBorder shadow="md" radius="md" p="xl" my={50} bg="blue.0">
          <Stack align="center" gap="md">
            <Title order={3} ta="center">Готовы начать управлять финансами?</Title>
            <Text c="dimmed" ta="center" maw={600}>
              Присоединяйтесь к тысячам пользователей, которые уже оптимизировали свои финансы с нашим сервисом
            </Text>
            <Button component={Link} href={url} size="lg" radius="md" mt="md">
              Войти через YooMoney
            </Button>
          </Stack>
        </Card>
      </Container>
    </AppShell>
  );
}
