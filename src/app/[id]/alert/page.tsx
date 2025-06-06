'use client'
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { Id, Doc } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import { AlertTemplate } from "@/components/alert-template";
import { Center } from "@mantine/core";
import { useEffect, useState, useRef } from "react";

// Define the donation type with alert
interface DonationWithAlert {
    _id: Id<"donations">;
    amount: number;
    message: string;
    fromUser?: {
        name: string;
        _id: Id<"users">;
    };
    alert?: Doc<"alerts"> | null;
}

export default function Page() {
    const { id } = useParams();
    const [currentAlert, setCurrentAlert] = useState<DonationWithAlert | null>(null);
    const [isShowingAlert, setIsShowingAlert] = useState(false);
    const lastProcessedId = useRef<string | null>(null);

    // Get donations for this target
    const donations = useQuery(api.donation.getDonationsForTarget, {
        targetId: id as Id<"targets">
    });

    // Process only the latest donation with an alert
    useEffect(() => {
        if (donations && donations.length > 0) {
            // Find the latest donation with an alert
            const latestDonation = [...donations]
                .reverse()
                .find(donation => donation.alert && donation._id !== lastProcessedId.current);

            if (latestDonation) {
                lastProcessedId.current = latestDonation._id;
                setCurrentAlert(latestDonation);
                setIsShowingAlert(true);

                // Hide the alert after showing it
                const alertDuration = 5000; // 5 seconds per alert
                setTimeout(() => {
                    setIsShowingAlert(false);
                }, alertDuration);
            }
        }
    }, [donations]);

    // Empty state when no alerts are showing
    if (!isShowingAlert || !currentAlert || !currentAlert.alert) {
        return <Center h="100vh" w="100vw">
        </Center>;
    }

    // Show the current alert
    return (
        <Center h="100vh" w="100vw">
            <AlertTemplate
                {...currentAlert.alert}
                name={currentAlert.fromUser?.name || ""}
                message={currentAlert.message}
                amount={currentAlert.amount}
            />
        </Center>
    );
}