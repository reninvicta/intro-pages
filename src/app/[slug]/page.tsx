/* eslint-disable @next/next/no-img-element */
import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/getPageBySlug";
import PageContent from "@/components/PageContent";

export default async function Page({ params }: { params: { slug: string }; }) {
    const awaitedParams = await params;
    
    const RESERVED = ["api", "admin"]
    if (RESERVED.includes(awaitedParams.slug)) {
        notFound();
    }

    const page = await getPageBySlug(awaitedParams.slug);

    if (!page) {
        notFound();
    }

    const safePage = {
        ...page,
        _id: page._id.toString(),
        discordId: page.discordId ? page.discordId.toString() : null
    }

    return (
        <>
            <head>
                <title>{page.name}</title>
                <meta property="og:title" content={page.name} />
                <meta property="og:description" content={page.status || page.username} />
                <meta property="og:image" content={page.avatarUrl || ""} />
                <meta property="og:url" content={`https://invicta.dev/${awaitedParams.slug}`} />
                <meta property="og:type" content="website" />

                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content={page.name} />
                <meta name="twitter:description" content={page.status || page.username} />
                <meta name="twitter:image" content={page.avatarUrl || ""} />
            </head>
            <PageContent page={safePage} />
        </>
);
}