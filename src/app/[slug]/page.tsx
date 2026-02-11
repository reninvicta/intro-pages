/* eslint-disable @typescript-eslint/no-unused-vars */
import { notFound } from "next/navigation";
import { getCachedPageBySlug, getPageBySlug } from "@/lib/getPageBySlug";
import PageContent from "@/components/PageContent";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: {slug: string}; }): Promise<Metadata> {
    const awaitedParams = await params;
    const slug = awaitedParams.slug;

    const RESERVED = new Set(["api", "admin"]);
    if (RESERVED.has(slug.toLowerCase())) return {};

    const page = await getCachedPageBySlug(slug);

    if (!page) return {};

    return {
        title: page.name,
        description: page.status || page.username,
        openGraph: {
            title: page.name,
            description: page.status || page.username,
            images: page.avatarUrl ? [page.avatarUrl] : [],
            url: `https://invicta.dev/${slug}`,
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

    const safePage = (() => {
        const { _id, ...rest } = page;
        return rest;
    })()

    return <PageContent page={safePage} />;
}