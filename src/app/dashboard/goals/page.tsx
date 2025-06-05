'use client'
import { Button, Card, ColorInput, SimpleGrid, Skeleton } from "@mantine/core";
import { useForm } from '@mantine/form';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { useEffect } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { GoalTemplate } from "@/components/goal-template";
import { notifications } from '@mantine/notifications';
export default function Page() {
    const goals = useQuery(api.goal.byUserId, {
        userId: localStorage.getItem("user_id") as Id<"users">
    });
    const createGoal = useMutation(api.goal.create);
    return (
        <>
            <Button onClick={() => createGoal({
                userId: localStorage.getItem("user_id") as Id<"users">
            })}>Добавить цель</Button>
            <SimpleGrid mt={'md'} cols={{ sm: 1, md: 2, lg: 3 }}
                spacing={{ base: 10, sm: 'xl' }}
                verticalSpacing={{ base: 'md', sm: 'xl' }}>
                {goals ? goals.map((goal) => (
                    <GoalCard key={goal._id} {...goal} />
                )) : (
                    <>
                        {[1, 2, 3].map((i) => (
                            <Card key={i} shadow="sm" padding="lg" radius="md" withBorder>
                                <Card.Section>
                                    <Skeleton height={180} radius={0} />
                                </Card.Section>
                                <SimpleGrid cols={2} mt="md">
                                    <Skeleton height={36} mt="sm" />
                                    <Skeleton height={36} mt="sm" />
                                    <Skeleton height={36} mt="sm" />
                                </SimpleGrid>
                                <Skeleton height={36} mt="md" width="40%" />
                            </Card>
                        ))}
                    </>
                )}
            </SimpleGrid>
        </>
    )
}

function GoalCard(initialValues: Doc<"goals">) {
    // Create a new mutable object with the properties we need
    const formInitialValues = {
        _id: initialValues._id,
        _creationTime: initialValues._creationTime,
        backgroundColor: initialValues.backgroundColor,
        indicatorColor: initialValues.indicatorColor,
        textColor: initialValues.textColor,
        userId: initialValues.userId,
    };

    const form = useForm({
        initialValues: formInitialValues,
    });

    const updateGoal = useMutation(api.goal.update);
    const deleteGoal = useMutation(api.goal.remove);
    const [debouncedValues] = useDebouncedValue(form.values, 500);
    useEffect(() => {
        async function update() {
            if (
                debouncedValues.backgroundColor !== initialValues.backgroundColor ||
                debouncedValues.textColor !== initialValues.textColor ||
                debouncedValues.indicatorColor !== initialValues.indicatorColor
            ) {
                try {
                    await updateGoal({
                        id: initialValues._id,
                        backgroundColor: debouncedValues.backgroundColor,
                        indicatorColor: debouncedValues.indicatorColor,
                        textColor: debouncedValues.textColor,
                        userId: localStorage.getItem("user_id") as Id<"users">
                    });
                    notifications.show({
                        title: "Цель обновлена",
                        message: "Цель обновлена успешно",
                        color: "green"
                    });
                } catch (error) {
                    notifications.show({
                        title: "Ошибка",
                        message: "Ошибка при обновлении цели" + error,
                        color: "red"
                    });
                }
            }
        }
        update();
    }, [
        debouncedValues
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
