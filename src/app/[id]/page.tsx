'use client'
import { useParams } from "next/navigation";
import { Center, TextInput, NumberInput, Textarea, Button, Select, Loader, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
export default function Page() {
    const { id } = useParams();
    const user = useQuery(api.user.getByAccount, { account: id as string });
    const targetsByUserId = useQuery(api.target.byUserId, { userId: user?._id as Id<"users"> });
    const createDonation = useMutation(api.donation.create);
    const form = useForm({
        initialValues: {
            name: "",
            amount: 0,
            message: "",
            targetId: targetsByUserId?.[0]?._id,
        },
    });
    if (!user || !targetsByUserId) {
        return <Center>
            <Loader />
        </Center>
    }
    if (targetsByUserId.length === 0) {
        return <Center>
            <Text>Цели не найдены</Text>
        </Center>
    }
    return (
        <Center>
            <form onSubmit={form.onSubmit(async (values) => {
                await createDonation({
                    amount: values.amount,
                    message: values.message,
                    targetId: values.targetId as Id<"targets">,
                    userId: user?._id as Id<"users">,
                });
            })}>
                <TextInput label="Имя" {...form.getInputProps("name")} />
                <NumberInput label="Сумма" {...form.getInputProps("amount")} />
                <Textarea label="Сообщение" {...form.getInputProps("message")} />
                <Select
                    label="Цель"
                    placeholder="Выберите цель"
                    data={targetsByUserId?.map(target => ({
                        value: target._id,
                        label: target.name,
                    })) || []}
                    defaultValue={targetsByUserId?.[0]?._id}
                    allowDeselect={false}
                />

                <Button type="submit">Отправить</Button>
            </form>
        </Center >
    )
}