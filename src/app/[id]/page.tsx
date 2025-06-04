'use client'
import { useParams } from "next/navigation";
import { Center, TextInput, NumberInput, Textarea, Button, Loader, Text, Paper, Title, Group, Progress } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { notifications } from "@mantine/notifications";
export default function Page() {
    const { id } = useParams();
    const target = useQuery(api.target.getById, { id: id as Id<"targets"> });
    const user = useQuery(api.user.getByAccessToken, { access_token: localStorage.getItem("access_token") as string });
    const createDonation = useMutation(api.donation.create);

    const form = useForm({
        initialValues: {
            name: "",
            amount: 0,
            message: "",
            targetId: id as Id<"targets">,
        },
    });

    if (!target || !user) {
        return <Center>
            <Loader />
        </Center>
    }



    const payment = async (values: typeof form.values) => {
        try {
            const params = new URLSearchParams({
                pattern_id: "p2p",
                to: target.user?.account as string,
                amount: values.amount.toString(),
                comment: values.message,
                message: values.name,
            });
            const payment = await fetch(`https://yoomoney.ru/request-payment?${params.toString()}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
                }
            }).then(res => res.json()).then(data => {
                if (data.status === "refused") {
                    throw new Error(data.error);
                }
            });
            await createDonation({
                amount: values.amount,
                message: values.message,
                targetId: values.targetId,
                userId: user._id,
                name: values.name,
            });
            form.reset();
            notifications.show({
                title: "Успешно",
                message: "Донат успешно отправлен",
                color: "green",
            });
            return payment;
        } catch (error) {
            notifications.show({
                title: "Ошибка",
                message: "Донат не отправлен",
                color: "red",
            });
            console.log(error);
        }
    }
    const progress = target.total && target.collected && target.total > 0 ? (target.collected / target.total) * 100 : 0;

    return (
        <Center>
            <Paper shadow="md" p="xl" radius="md" withBorder maw={500} w="100%">
                <Title order={2} mb="md">{target.name}</Title>
                <Text mb="md">Автор: {user.account}</Text>

                <Group mb="md">
                    <Text>{target.collected} ₽ из {target.total} ₽</Text>
                    <Text c="dimmed">({progress.toFixed(1)}%)</Text>
                </Group>

                <Progress value={progress} size="md" radius="xl" mb="xl" />

                <Title order={3} mb="md">Поддержать цель</Title>

                <form onSubmit={form.onSubmit(payment)}>
                    <TextInput label="Имя" {...form.getInputProps("name")} mb="md" />
                    <NumberInput label="Сумма" {...form.getInputProps("amount")} mb="md" />
                    <Textarea label="Сообщение" {...form.getInputProps("message")} mb="md" />
                    <Button type="submit" mt={4} fullWidth>Отправить</Button>
                </form>
            </Paper>
        </Center>
    )
}