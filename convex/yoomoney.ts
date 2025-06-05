import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const clientId = "E69B1725E46F1E7855155A622D7952CF616D37C90D134955B4604150B175DF69"
const clientSecret = "7F7A47CFF9FECBDC770AECC5D97B0E7C05A598302978E21A252D2C3A57CDABFCD61DDB46312B33FA54CDEF870AF216FD1CA614B98766D46036C94AE2559B4751"

export const callbackAuth = httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    try {
        const responseToken = await fetch(
            `https://yoomoney.ru/oauth/token?grant_type=authorization_code&code=${code}&client_id=${clientId}&client_secret=${clientSecret}`
        );
        const data = await responseToken.json();

        const responseAccount = await fetch(`https://yoomoney.ru/api/account-info`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${data.access_token}`,
            },
        });

        const account = await responseAccount.json();
        const user = await ctx.runQuery(api.user.getByAccount, { account: account.account });
        if (!user) {
            await ctx.runMutation(api.user.create, {
                account: account.account,
                balance: account.balance,
                access_token: data.access_token,
            });
        } else {
            await ctx.runMutation(api.user.update, {
                id: user._id,
                access_token: data.access_token,
            });
        }

        // Set cookie using Set-Cookie header and redirect
        return new Response(null, {
            status: 302,
            headers: {
                "Location": process.env.SITE_URL + "/dashboard" + "?access_token=" + data.access_token,
            },
        });
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ error: String(error) }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
});


export const payment = httpAction(async (ctx, request) => {
    const data = await request.json();
    const { targetAccount, amount, comment, name, accessToken } = data;
    const requestParams = new URLSearchParams({
        pattern_id: "p2p",
        to: targetAccount,
        amount: amount.toString(),
        comment: comment || "",
        message: name || "",
    });

    try {
        const responsePayment = await fetch(`https://yoomoney.ru/api/request-payment`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: requestParams.toString()
        });
        
        const requestData = await responsePayment.json();
        console.log(requestData);
        if(requestData.status === "refused") {
            throw new Error(requestData.error);
        }

        return new Response(JSON.stringify(requestData), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ error: String(error) }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
});