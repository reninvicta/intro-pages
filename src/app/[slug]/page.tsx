/* eslint-disable @next/next/no-img-element */
import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/getPageBySlug";
import PageContent from "@/components/PageContent";

export default async function Page({ params }: { params: { slug: string }; }) {
    const { slug } = await params;
    
    const RESERVED = ["api", "admin"]
    if (RESERVED.includes(slug)) {
        notFound();
    }

    const page = await getPageBySlug(slug);

    if (!page) {
        notFound();
    }

    const safePage = {
        ...page,
        _id: page._id.toString(),
        discordId: page.discordId ? page.discordId.toString() : null
    }

    return <PageContent page={safePage} />;
}