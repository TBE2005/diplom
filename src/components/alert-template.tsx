import { Doc } from "../../convex/_generated/dataModel";
import { Card, Center, Flex, Stack, Text } from "@mantine/core";


export function AlertTemplate(settings: Doc<"alerts"> & { name: string, message: string, amount: number }) {
    return (
        <Card bg={settings.backgroundColor} >
            <Center>
                <Stack gap="xs" align="center">
                    <Flex align="center" gap="xs">
                        <Text c={settings.textColor}>{settings.name}</Text>
                        <Text c={settings.textColor}>-</Text>
                        <Text c={settings.textColor}>{settings.amount}</Text>
                    </Flex>
                    <Text c={settings.textColor}>{settings.message}</Text>
                </Stack>
            </Center>
        </Card>
    )

}