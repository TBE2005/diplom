import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.json();
    console.log(body);
    return NextResponse.json({ message: "Hello, world!" });
}

const clientId = "E69B1725E46F1E7855155A622D7952CF616D37C90D134955B4604150B175DF69"
const clientSecret = "7F7A47CFF9FECBDC770AECC5D97B0E7C05A598302978E21A252D2C3A57CDABFCD61DDB46312B33FA54CDEF870AF216FD1CA614B98766D46036C94AE2559B4751"

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get("code");
    const responseToken = await fetch(`https://yoomoney.ru/oauth/token?grant_type=authorization_code&code=${code}&client_id=${clientId}&client_secret=${clientSecret}`)
    const data = await responseToken.json();
    return NextResponse.json(data);
}
