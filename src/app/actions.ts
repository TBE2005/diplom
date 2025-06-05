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
        console.log(1, requestData);
        return requestData;
    } catch (error) {
        console.error(2, error);
        throw error;
    }
} 