import { removeMessage } from "@/lib/messages";
import { NextRequest, NextResponse } from "next/server";
import { getPageByUserId } from "@/lib/pages";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ messageId: string }> }
) {
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

    const awaitedParams = await params;
    await removeMessage(userId, awaitedParams.messageId);

    return NextResponse.json(
      { message: "Message deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json(
      { error: "Failed to delete message" },
      { status: 500 }
    );
  }
}
