import { Flex, Progress, Text, Stack } from "@mantine/core";
import { Doc } from "../../convex/_generated/dataModel";

export function GoalTemplate(settings: Doc<"goals"> & { collected: number, total: number, name: string }) {
    return (
        <Progress.Root bg={settings.backgroundColor} size={100}>
            <Progress.Section value={35} color={settings.indicatorColor} />
            <Stack gap="xs" pos="absolute" top={0} left={0} right={0} bottom={0} justify="center" align="center">
                <Text c={settings.textColor}>{settings.name}</Text>
                <Flex align="center" gap="xs">
                    <Text c={settings.textColor}>{settings.collected}</Text>
                    <Text c={settings.textColor}>/</Text>
                    <Text c={settings.textColor}>{settings.total}</Text>
                </Flex>
            </Stack>
        </Progress.Root>
    )

}