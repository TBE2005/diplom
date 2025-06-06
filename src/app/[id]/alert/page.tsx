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
    const [queuedDonations, setQueuedDonations] = useState<any[]>([]);
    const [currentDonation, setCurrentDonation] = useState<any | null>(null);
    const [isDisplaying, setIsDisplaying] = useState(false);

    // Get donations for this target
    const donation = useQuery(api.donation.getDonationToLastWithAlert, {
        targetId: id as Id<"targets">
    });

    // Add new donations to the queue
    useEffect(() => {
        if (donation && donation.alert && (!currentDonation || donation._id !== currentDonation._id)) {
            setQueuedDonations(prev => [...prev, donation]);
        }
    }, [donation, currentDonation]);

    // Process the donation queue
    useEffect(() => {
        if (!isDisplaying && queuedDonations.length > 0) {
            // Get the next donation from the queue
            const nextDonation = queuedDonations[0];
            const remainingDonations = queuedDonations.slice(1);
            
            // Display the donation
            setCurrentDonation(nextDonation);
            setQueuedDonations(remainingDonations);
            setIsDisplaying(true);
            
            // Set a timeout to hide the donation after 5 seconds
            const timer = setTimeout(() => {
                setIsDisplaying(false);
                setCurrentDonation(null);
            }, 5000);
            
            return () => clearTimeout(timer);
        }
    }, [queuedDonations, isDisplaying]);

    // Show the current alert or empty state
    return (
        <Center h="100vh" w="100vw">
            {isDisplaying && currentDonation && currentDonation.alert ? (
                <AlertTemplate
                    {...currentDonation.alert}
                    name={currentDonation.fromUser?.name || ""}
                    message={currentDonation.message}
                    amount={currentDonation.amount}
                />
            ) : null}
        </Center>
    );
}