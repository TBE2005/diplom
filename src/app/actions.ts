'use server'

export async function processPayment(
    targetAccount: string,
    amount: number,
    comment: string,
    name: string,
    accessToken: string
) {
    if (!targetAccount || !amount || !accessToken) {
        return { error: { message: "Missing required parameters" } };
    }

    try {
        // Step 1: Request payment
        const requestParams = new URLSearchParams({
            pattern_id: "p2p",
            to: targetAccount,
            amount: amount.toString(),
            comment: comment || "",
            message: name || "",
        });

        const requestResponse = await fetch(`https://yoomoney.ru/api/request-payment?${requestParams.toString()}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        
        if (!requestResponse.ok) {
            return { 
                error: { 
                    message: `Payment API error: ${requestResponse.status}`,
                    status: requestResponse.status
                } 
            };
        }
        
        const requestData = await requestResponse.json();
        
        if (requestData.error) {
            return { error: { message: requestData.error || "Payment API error" } };
        }
        
        return requestData;
    } catch (error) {
        console.error("Payment processing error:", error);
        return { 
            error: { 
                message: error instanceof Error ? error.message : "Payment processing failed" 
            } 
        };
    }
} 