import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.json();
    console.log(body);
    return NextResponse.json({ message: "Hello, world!" });
}

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get("code");
    console.log(code);
    return NextResponse.json({ code });
}
