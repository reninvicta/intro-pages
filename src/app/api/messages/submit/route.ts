import { NextRequest, NextResponse } from "next/server";
import { getCachedPageBySlug as getPageBySlug } from "@/lib/pages";
import { addMessage as addMessageToDb, isIpBlacklisted as checkIpBlacklist } from "@/lib/messages";

async function getIpAddress(request: NextRequest): Promise<string> {
    // check in this order:
    // 1. X-Client-IP
    // 2. X-Forwarded-For
    // 3. CF-Connecting-IP
    // 4. Fastly-Client-IP
    // 5. True-Client-IP
    // 6. X-Real-IP
    // 7. X-Cluster-Client-IP
    // 8. X-Forwarded, Forwarded-For, Forwarded

    const headers = request.headers;
    const ip =
        headers.get("x-client-ip") ||
        headers.get("x-forwarded-for")?.split(",").map(ip => ip.trim())[0] ||
        headers.get("cf-connecting-ip") ||
        headers.get("fastly-client-ip") ||
        headers.get("true-client-ip") ||
        headers.get("x-real-ip") ||
        headers.get("x-cluster-client-ip") ||
        headers.get("x-forwarded") ||
        headers.get("forwarded-for") || 
        headers.get("forwarded");

    return ip || "unknown";
}

export async function POST(request: NextRequest) {
    try {
        const { slug, message } = await request.json();

        if (!slug || !message) {
            return NextResponse.json(
                { error: "Missing slug or message" },
                { status: 400 }
            );
        }

        // Fetch userId from slug
        const page = await getPageBySlug(slug);
        if (!page || !page.userId) {
            return NextResponse.json(
                { error: "Page not found" },
                { status: 404 }
            );
        }

        const userId = page.userId;
        const sourceIp = await getIpAddress(request);
        const sourceUserAgent = request.headers.get("user-agent") || "unknown";

        // Check if IP is blacklisted
        if (await checkIpBlacklist(sourceIp)) {
            return NextResponse.json(
                { error: "IP address is blacklisted" },
                { status: 403 }
            );
        }

        // Add message to database
        await addMessageToDb(userId, message, sourceIp, sourceUserAgent);

        return NextResponse.json(
            { success: true, message: "Message submitted successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error submitting message:", error);
        return NextResponse.json(
            { error: "Failed to submit message" },
            { status: 500 }
        );
    }
}
