'use client'
import { Button, Card, ColorInput, SimpleGrid, Text } from "@mantine/core";
import { useForm } from '@mantine/form';
import { api } from "../../../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { useDebouncedValue } from "@mantine/hooks";
import { useEffect } from "react";
import { AlertTemplate } from "@/components/alert-template";
import { notifications } from '@mantine/notifications';
export default function Page() {
    const alerts = useQuery(api.alert.get);
    const createAlert = useMutation(api.alert.create);
    return (
        <>
            <Button onClick={() => createAlert({
                userId: localStorage.getItem("user_id") as Id<"users">
            })}>Добавить оповещение</Button>
            <SimpleGrid mt={'md'} cols={{ sm: 1, md: 2, lg: 3 }}
                spacing={{ base: 10, sm: 'xl' }}
                verticalSpacing={{ base: 'md', sm: 'xl' }}>
                {alerts ? alerts?.map((alert) => (
                    <AlertCard key={alert._id} {...alert} />
                )) : <Text>No alerts</Text>}
            </SimpleGrid>
        </>
    )
}

function AlertCard(initialValues: Doc<"alerts">) {
    const form = useForm({
        initialValues,
    });
    const updateAlert = useMutation(api.alert.update);
    const deleteAlert = useMutation(api.alert.remove);

    const [debouncedValues] = useDebouncedValue(form.values, 500);

    useEffect(() => {
        async function update() {
            if (
                debouncedValues.backgroundColor !== initialValues.backgroundColor ||
                debouncedValues.textColor !== initialValues.textColor
            ) {
                try {
                    await updateAlert({
                        id: initialValues._id,
                        backgroundColor: debouncedValues.backgroundColor,
                        textColor: debouncedValues.textColor,
                        userId: localStorage.getItem("user_id") as Id<"users">
                    });
                    notifications.show({
                        title: "Оповещение обновлено",
                        message: "Оповещение обновлено успешно",
                        color: "green"
                    });
                } catch (error) {
                    notifications.show({
                        title: "Ошибка",
                        message: "Ошибка при обновлении оповещения" + error,
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
                <AlertTemplate {...form.values} name="Template" message="Template" amount={1000} />
            </Card.Section>
            <SimpleGrid cols={2} mt="md">
                <ColorInput description="Цвет фона" key={form.key('backgroundColor')} {...form.getInputProps('backgroundColor')} />
                <ColorInput description="Цвет текста" key={form.key('textColor')} {...form.getInputProps('textColor')} />
            </SimpleGrid>
            <Button variant="outline" color="red" mt="md" onClick={() => deleteAlert({ id: initialValues._id })}>Удалить</Button>
        </Card>
    )
}
