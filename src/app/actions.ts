'use server'

export async function processPayment(
    targetAccount: string,
    amount: number,
    comment: string,
    name: string,
    accessToken: string
) {
    try {
        const params = new URLSearchParams({
            pattern_id: "p2p",
            to: targetAccount,
            amount: amount.toString(),
            comment: comment,
            message: name,
        });

        const response = await fetch(`https://yoomoney.ru/request-payment?${params.toString()}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            }
        });

        const data = await response.json();

        if (data.status === "refused") {
            throw new Error(JSON.stringify(data));
        }

        return data;
    } catch (error) {
        return error;
    }
} 