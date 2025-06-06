'use client'
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import { AlertTemplate } from "@/components/alert-template";
import { Center } from "@mantine/core";
import { useEffect, useState } from "react";

export default function Page() {
    const { id } = useParams();

    const [isDisplaying, setIsDisplaying] = useState(false);

    const donation = useQuery(api.donation.getDonationToLastWithAlert, {
        targetId: id as Id<"targets">
    }); 

    useEffect(() => {
        if (donation && !isDisplaying && donation.alert) {
            setIsDisplaying(true);
            setTimeout(() => {
                setIsDisplaying(false);
            }, 5000);
        }
    }, [donation, isDisplaying]);

    return (
        <Center h="100vh" w="100vw">
            {isDisplaying && donation ? (
                <AlertTemplate
                    {...donation.alert!}
                    name={donation.fromUser?.name || ""}
                    message={donation.message}
                    amount={donation.amount}
                />
            ) : null}
        </Center>
    );
}