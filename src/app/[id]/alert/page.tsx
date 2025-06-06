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
    const [queuedDonations, setQueuedDonations] = useState<{
        _id: Id<"donations">;
        amount: number;
        message: string;
        fromUser: Doc<"users"> | undefined;
        alert: Doc<"alerts"> | undefined;
    }[]>([]);
    const [currentDonation, setCurrentDonation] = useState<{
        alert: Doc<"alerts"> | undefined;
        fromUser: Doc<"users"> | undefined;
        message: string;
        amount: number;
    } | null>(null);
    const [isDisplaying, setIsDisplaying] = useState(false);

    // Get donations for this target
    const donation = useQuery(api.donation.getDonationToLastWithAlert, {
        targetId: id as Id<"targets">
    });

    // Add new donations to the queue
    useEffect(() => {
        if (donation && donation.alert && (!currentDonation || donation.alert._id !== currentDonation.alert?._id)) {
            const donationWithUser = {
                ...donation,
                fromUser: donation.fromUser || undefined,
                alert: donation.alert || undefined
            };
            setQueuedDonations(prev => [...prev, donationWithUser]);
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
            {isDisplaying && currentDonation ? (
                <AlertTemplate
                    {...currentDonation.alert!}
                    name={currentDonation.fromUser?.name || ""} 
                    message={currentDonation.message}
                    amount={currentDonation.amount}
                />
            ) : null}
        </Center>
    );
}