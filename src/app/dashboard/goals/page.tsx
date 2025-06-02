'use client'
import { Button, Card, ColorInput, Flex, Progress, SimpleGrid, Text, Stack } from "@mantine/core";
import { useForm } from '@mantine/form';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Doc } from "../../../../convex/_generated/dataModel";
import { useEffect } from "react";
import { useDebouncedValue } from "@mantine/hooks";

export default function Page() {
    const goals = useQuery(api.goal.get);
    const createGoal = useMutation(api.goal.create);
    return (
        <>
            <Button onClick={() => createGoal()}>Добавить цель</Button>
            <SimpleGrid mt={'md'} cols={{ sm: 1, md: 2, lg: 3 }}
                spacing={{ base: 10, sm: 'xl' }}
                verticalSpacing={{ base: 'md', sm: 'xl' }}>
                {goals ? goals.map((goal) => (
                    <GoalCard key={goal._id} {...goal} />
                )) : <Text>No goals</Text>}
            </SimpleGrid>
        </>
    )
}


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

function GoalCard(initialValues: Doc<"goals">) {
    const form = useForm({
        mode: 'uncontrolled',
        initialValues,
    });
    const updateGoal = useMutation(api.goal.update);
    const deleteGoal = useMutation(api.goal.remove);
    const [debouncedValues] = useDebouncedValue(form.values, 500);
    useEffect(() => {
        if (
            debouncedValues.name !== initialValues.name ||
            debouncedValues.backgroundColor !== initialValues.backgroundColor ||
            debouncedValues.textColor !== initialValues.textColor ||
            debouncedValues.indicatorColor !== initialValues.indicatorColor
        ) {
            updateGoal({
                id: initialValues._id,
                name: debouncedValues.name,
                backgroundColor: debouncedValues.backgroundColor,
                indicatorColor: debouncedValues.indicatorColor,
                textColor: debouncedValues.textColor,
            });
        }
    }, [
        debouncedValues, 
        initialValues._id, 
        initialValues.name,
        initialValues.backgroundColor,
        initialValues.textColor,
        initialValues.indicatorColor,
        updateGoal
    ]);
    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
                <GoalTemplate {...form.values} collected={1000} total={5000} name="Template" />
            </Card.Section>
            <SimpleGrid cols={2} mt="md">
                <ColorInput description="Цвет фона" key={form.key('backgroundColor')} {...form.getInputProps('backgroundColor')} />
                <ColorInput description="Цвет индикатора" key={form.key('indicatorColor')} {...form.getInputProps('indicatorColor')} />
                <ColorInput description="Цвет текста" key={form.key('textColor')} {...form.getInputProps('textColor')} />
            </SimpleGrid>
            <Button variant="outline" color="red" mt="md" onClick={() => deleteGoal({ id: initialValues._id })}>Удалить</Button>
        </Card>
    )
}
