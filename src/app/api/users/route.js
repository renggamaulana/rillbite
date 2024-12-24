import { NextResponse } from "next/server";

// handle GET Request
export async function GET() {
    const users = [
        {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
        },
        {
            id: 2,
            name: "Dev Ed",
            email: "deved@example.com",
        },
    ];

    return NextResponse.json(users, { status:200 });
}

// handle POST Request
export async function POST(req) {
    const body = await req.json();
    return NextResponse.json({message: 'User created', data: body}, { status: 201 });
}