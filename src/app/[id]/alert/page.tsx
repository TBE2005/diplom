'use client'
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import { AlertTemplate } from "@/components/alert-template";
import { Center } from "@mantine/core";
import { useEffect, useState } from "react";

export default function Page() {
    const { id } = useParams();
    const [alertQueue, setAlertQueue] = useState<{
        alert: Doc<"alerts">;
        name: string;
        message: string;
        amount: number;
    }[]>([]);
    const [currentAlert, setCurrentAlert] = useState<{
        alert: Doc<"alerts">;
        name: string;
        message: string;
        amount: number;
    } | null>(null);
    const [isShowingAlert, setIsShowingAlert] = useState<boolean>(false);

    const donation = useQuery(api.donation.getDonationToLastWithAlert, {
        targetId: id as Id<"targets">
    });

    // Process new donations
    useEffect(() => {
        if (donation && donation.alert) {
            const newDonation = {
                alert: donation.alert,
                name: donation.fromUser?.name || "",
                message: donation.message,
                amount: donation.amount
            };
            
            // Add to queue if we're currently showing an alert
            if (isShowingAlert) {
                setAlertQueue(prev => [...prev, newDonation]);
            } else {
                // Show immediately if no alert is currently showing
                setCurrentAlert(newDonation);
                setIsShowingAlert(true);
            }
        }
    }, [donation]);

    // Handle alert display timing
    useEffect(() => {
        if (!isShowingAlert || !currentAlert) return;

        const timer = setTimeout(() => {
            // Check if there are more alerts in queue
            if (alertQueue.length > 0) {
                const [nextAlert, ...remainingAlerts] = alertQueue;
                setCurrentAlert(nextAlert);
                setAlertQueue(remainingAlerts);
            } else {
                setIsShowingAlert(false);
                setCurrentAlert(null);
            }
        }, 5000); // 5 seconds

        return () => clearTimeout(timer);
    }, [isShowingAlert, currentAlert, alertQueue]);

    return (
        <Center h="100vh" w="100vw">
            {isShowingAlert && currentAlert ? (
                <AlertTemplate
                    {...currentAlert.alert}
                    name={currentAlert.name}
                    message={currentAlert.message}
                    amount={currentAlert.amount}
                />
            ) : null}
        </Center>
    );
}