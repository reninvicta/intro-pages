/* eslint-disable @typescript-eslint/no-unused-vars */
import { notFound } from "next/navigation";
import { getPageByUserId } from "@/lib/pages";
import { getAllMessages } from "@/lib/messages";
import MessageInbox from "@/components/MessageInbox";

export default async function AdminMessagePage({ params }: { params: { userId: string } }) {
    const awaitedParams = await params;
    const page = await getPageByUserId(awaitedParams.userId);
    if (!page) notFound();

    const safePage = (() => {
        const { _id, ...rest } = page;
        return rest;
    })()

    const messages = await getAllMessages(awaitedParams.userId);

    const safeMessages = messages.map((message) => {
        const { _id, ...rest } = message;
        return rest;
    })

    return <MessageInbox page={safePage} messages={safeMessages} />
}