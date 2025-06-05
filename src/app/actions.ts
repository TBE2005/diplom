'use server'

export async function processPayment(
    targetAccount: string,
    amount: number,
    comment: string,
    name: string,
    accessToken: string
) {
    try {
        // Step 1: Request payment
        const requestParams = new URLSearchParams({
            pattern_id: "p2p",
            to: targetAccount,
            amount: amount.toString(),
            comment: comment,
            message: name,
        });

        const requestResponse = await fetch(`https://yoomoney.ru/api/request-payment?${requestParams.toString()}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });

        const requestData = await requestResponse.json();
        console.log("@ Request payment response:", requestData);
        
        if (requestData.status === "refused") {
            return { success: false, error: `Payment request refused: ${requestData.error || JSON.stringify(requestData)}` };
        }

        // Step 2: Process payment
        if (requestData.status === "success") {
            const processParams = new URLSearchParams({
                request_id: requestData.request_id,
            });

            const processResponse = await fetch(`https://yoomoney.ru/api/process-payment?${processParams.toString()}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });

            const processData = await processResponse.json();
            console.log("@ Process payment response:", processData);
            
            if (processData.status === "refused") {
                return { success: false, error: `Payment processing refused: ${processData.error || JSON.stringify(processData)}` };
            }

            return { success: true, data: processData };
        }

        return { success: true, data: requestData };
    } catch (error) {
        console.error("@ Error:", error);
        // Return a serializable error object
        return { 
            success: false, 
            error: error instanceof Error ? error.message : "Unknown error occurred" 
        };
    }
} 