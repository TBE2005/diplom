'use client'
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Card, Text } from "@mantine/core";
export default function Page() {
    const donations = useQuery(api.donation.getByUserId, { userId: localStorage.getItem("user_id") as Id<"users"> });
    return <>
        {donations?.map(donation =>
            <Card key={donation._id}>
                <Text>{donation.amount}</Text>
                <Text>{donation.message}</Text>
                <Text>{donation.target?.name}</Text>
            </Card>
        )}
    </>;
}
