import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    const { id } = params;
    NextResponse.json({ message: `Fetching use with ID: ${id}` }, { status: 200 });
}

export async function PUT(req, { params }) {
    const { id } = params;
    const body = await req.json();
    return NextResponse.json({ message: `User ${id} updated`, data: body}, { status:201 })
}


export async function DELETE(req, { params }) {
    const { id } = params;
    return NextResponse.json({ message: `User ${id} deleted`}, { status: 200 } )
}