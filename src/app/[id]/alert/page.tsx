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
    const [alertQueue, setAlertQueue] = useState<DonationWithAlert[]>([]);
    const [currentAlert, setCurrentAlert] = useState<DonationWithAlert | null>(null);
    const [isShowingAlert, setIsShowingAlert] = useState(false);
    const processedDonations = useRef<Set<string>>(new Set());

    // Get donations for this target
    const donations = useQuery(api.donation.getDonationsForTarget, { 
        targetId: id as Id<"targets"> 
    });

    // Process new donations into the queue
    useEffect(() => {
        if (donations && donations.length > 0) {
            // Filter only donations with alerts that aren't already processed
            const newDonations = donations.filter(donation => 
                donation.alert && 
                !processedDonations.current.has(donation._id)
            );
            
            if (newDonations.length > 0) {
                // Add to processed set
                newDonations.forEach(donation => {
                    processedDonations.current.add(donation._id);
                });
                
                // Add to queue
                setAlertQueue(prev => [...prev, ...newDonations]);
            }
        }
    }, [donations]);

    // Process the queue
    useEffect(() => {
        if (alertQueue.length > 0 && !isShowingAlert) {
            // Take the first alert from the queue
            const nextAlert = alertQueue[0];
            setCurrentAlert(nextAlert);
            setIsShowingAlert(true);
            
            // Remove the alert from the queue after showing it
            const alertDuration = 5000; // 5 seconds per alert
            setTimeout(() => {
                setIsShowingAlert(false);
                setAlertQueue(prev => prev.slice(1));
            }, alertDuration);
        }
    }, [alertQueue, isShowingAlert]);

    // Empty state when no alerts are showing
    if (!isShowingAlert || !currentAlert || !currentAlert.alert) {
        return <Center h="100vh" w="100vw" bg="black"></Center>;
    }

    // Show the current alert
    return (
        <Center h="100vh" w="100vw" bg="black">
            <AlertTemplate 
                {...currentAlert.alert} 
                name={currentAlert.fromUser?.name || ""} 
                message={currentAlert.message} 
                amount={currentAlert.amount} 
            />
        </Center>
    );
}