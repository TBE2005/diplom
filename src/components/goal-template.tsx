import { Flex, Text, Stack, Card, Paper } from "@mantine/core";
import { Doc } from "../../convex/_generated/dataModel";

export function GoalTemplate(settings: Doc<"goals"> & { collected: number, total: number, name: string }) {
    return (
        <Card bg={settings.backgroundColor} h={100} pos="relative">
            <Paper w={`${settings.collected / settings.total * 100}%`} h={100} c={settings.indicatorColor} pos="absolute" top={0} left={0} />
            <Stack gap="xs" pos="absolute" top={0} left={0} right={0} bottom={0} justify="center" align="center">
                <Text c={settings.textColor}>{settings.name}</Text>
                <Flex align="center" gap="xs">
                    <Text c={settings.textColor}>{settings.collected}</Text>
                    <Text c={settings.textColor}>/</Text>
                    <Text c={settings.textColor}>{settings.total}</Text>
                </Flex>
            </Stack>
        </Card>
    )

}