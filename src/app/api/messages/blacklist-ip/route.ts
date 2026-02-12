import { NextRequest, NextResponse } from "next/server";
import { blacklistIp } from "@/lib/messages";
import { getPageByUserId } from "@/lib/pages";

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Id ")) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 403 }
            );
        }

        const userId = authHeader.substring(3);
        const page = await getPageByUserId(userId);
        if (!page) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 403 }
            );
        }

        const { ipAddress } = await request.json();

        if (!ipAddress) {
            return NextResponse.json(
                { error: "Missing IP address" },
                { status: 400 }
            );
        }

        // Add IP to blacklist
        await blacklistIp(ipAddress);

        return NextResponse.json(
            { success: true, message: "IP address blacklisted successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error blacklisting IP:", error);
        return NextResponse.json(
            { error: "Failed to blacklist IP address" },
            { status: 500 }
        );
    }
}
