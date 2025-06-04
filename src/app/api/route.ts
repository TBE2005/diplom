import { NextRequest, NextResponse } from "next/server";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";

export async function POST(request: NextRequest) {
    const body = await request.json();
    console.log(body);
    return NextResponse.json({ message: "Hello, world!" });
}

const clientId = "E69B1725E46F1E7855155A622D7952CF616D37C90D134955B4604150B175DF69"
const clientSecret = "7F7A47CFF9FECBDC770AECC5D97B0E7C05A598302978E21A252D2C3A57CDABFCD61DDB46312B33FA54CDEF870AF216FD1CA614B98766D46036C94AE2559B4751"

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get("code");
    try {
        const responseToken = await fetch(`https://yoomoney.ru/oauth/token?grant_type=authorization_code&code=${code}&client_id=${clientId}&client_secret=${clientSecret}`)
        const data = await responseToken.json();

        const responseAccount = await fetch(`https://yoomoney.ru/api/account-info`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${data.access_token}`
            }
        })

        const account = await responseAccount.json();
        const user = await fetchQuery(api.user.getByAccount, { account: account.account });
        const response = NextResponse.redirect(new URL("/dashboard", request.url))
        response.cookies.set("access_token", data.access_token, { httpOnly: true })

        if (!user) {
            await fetchMutation(api.user.create, { account: account.account, balance: account.balance });
        }
        return response;
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error }, { status: 500 })
    }
}
