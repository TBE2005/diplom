'use client'
import { Button, Card, ColorInput, SimpleGrid, Text } from "@mantine/core";
import { useForm } from '@mantine/form';
import { api } from "../../../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Doc } from "../../../../convex/_generated/dataModel";
import { useDebouncedValue } from "@mantine/hooks";
import { useEffect } from "react";
import { AlertTemplate } from "@/components/alert-template";
export default function Page() {
    const alerts = useQuery(api.alert.get);
    const createAlert = useMutation(api.alert.create);
    return (
        <>
            <Button onClick={() => createAlert()}>Добавить оповещение</Button>
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
        mode: 'uncontrolled',
        initialValues,
    });
    const updateAlert = useMutation(api.alert.update);
    const deleteAlert = useMutation(api.alert.remove);

    const [debouncedValues] = useDebouncedValue(form.values, 500);

    useEffect(() => {
        if (
            debouncedValues.name !== initialValues.name ||
            debouncedValues.backgroundColor !== initialValues.backgroundColor ||
            debouncedValues.textColor !== initialValues.textColor
        ) {
            updateAlert({
                id: initialValues._id,
                name: debouncedValues.name,
                backgroundColor: debouncedValues.backgroundColor,
                textColor: debouncedValues.textColor,
            });
        }
    }, [
        debouncedValues, 
        initialValues._id, 
        initialValues.name,
        initialValues.backgroundColor,
        initialValues.textColor,
        updateAlert
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
