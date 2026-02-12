/* eslint-disable @typescript-eslint/no-unused-vars */
import { notFound } from "next/navigation";
import { getCachedPageBySlug, getPageBySlug } from "@/lib/pages";
import PageContent from "@/components/PageContent";
import { Metadata } from "next";

// if in dev server then localhost:3000
const domain = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://invicta.dev";

export async function generateMetadata({ params }: { params: {slug: string}; }): Promise<Metadata> {
    const awaitedParams = await params;
    const slug = awaitedParams.slug;

    const RESERVED = new Set(["api", "admin"]);
    if (RESERVED.has(slug.toLowerCase())) return {};

    const page = await getCachedPageBySlug(slug);

    if (!page) return {};

    if (page.useDiscordValues === true) {
        const apiResponse = await fetch(`${domain}/api/discord-avatar?id=${page.discordId}`)
        if (apiResponse.ok) {
            const data = await apiResponse.json();
            page.avatarUrl = data.avatar;
        } // soft error - do nothing on fail
    }

    return {
        title: page.name,
        description: page.status || page.username,
        openGraph: {
            title: page.name,
            description: page.status || page.username,
            images: page.avatarUrl ? [page.avatarUrl] : [],
            url: `${domain}/${slug}`,
            type: "website",
        },
        twitter: {
            card: "summary",
            title: page.name,
            description: page.status || page.username,
            images: page.avatarUrl ? [page.avatarUrl] : [],
        }
    }
}

export default async function Page({ params }: { params: { slug: string }; }) {
    const awaitedParams = await params;
    const slug = awaitedParams.slug;
    
    const RESERVED = new Set(["api", "admin"]);
    if (RESERVED.has(slug.toLowerCase())) {
        notFound();
    }

    const page = await getPageBySlug(slug);

    if (!page) {
        notFound();
    }

    if (page.useDiscordValues === true) {
        const apiResponse = await fetch(`${domain}/api/discord-avatar?id=${page.discordId}`)
        if (apiResponse.ok) {
            const data = await apiResponse.json();
            page.avatarUrl = data.avatar;
        } // soft error - do nothing on fail
    }

    const safePage = (() => {
        const { _id, userId, ...rest } = page;
        return rest;
    })()

    return <PageContent page={safePage} />;
}