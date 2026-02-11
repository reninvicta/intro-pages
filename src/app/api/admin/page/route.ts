import { NextRequest, NextResponse } from "next/server";
import { updatePageByUserId } from "@/lib/getPageBySlug";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        if(!body.username || !body.name) {
            return NextResponse.json({ error: "Username and name are required" }, { status: 400 });
        }

        await updatePageByUserId(body.username, { name: body.name });
        return NextResponse.json({ message: "Page updated successfully" });
    } catch (err) {
        console.error("Failed to update page:", err)
        return NextResponse.json({ error: "Failed to update page" }, { status: 500 });
    }
}