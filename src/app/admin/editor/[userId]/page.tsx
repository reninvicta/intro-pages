/* eslint-disable @typescript-eslint/no-unused-vars */
import { notFound } from "next/navigation";
import { getPageByUserId } from "@/lib/pages";
import PageEditor from "@/components/PageEditor";

export default async function AdminUserPage({ params }: { params: { userId: string } }) {
    const awaitedParams = await params;
    const page = await getPageByUserId(awaitedParams.userId);
    if (!page) notFound();

    const safePage = (() => {
        const { _id, ...rest } = page;
        return rest;
    })()

    return <PageEditor page={safePage} />
}