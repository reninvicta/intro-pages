import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/getPageBySlug";

export default async function Page({
    params,
}: {
    params: { slug: string };
}) {
    const { slug } = params;

    const RESERVED = ["api", "admin"]
    if (RESERVED.includes(slug)) {
        notFound();
    }

    const page = await getPageBySlug(slug);

    if (!page) {
        notFound();
    }

    return (
        <main className="min-h-screen flex items-center justify-center">
            <h1 className="text-4xl">{page.title}</h1>
        </main>
    );
}