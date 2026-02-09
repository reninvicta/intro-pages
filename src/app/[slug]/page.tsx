/* eslint-disable @next/next/no-img-element */
import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/getPageBySlug";
import ReactMarkdown from "react-markdown";

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

    return (
        <main className="min-h-screen flex items-center justify-center bg-zinc-900 text-white"
            style={
                page.backdropUrl ? {
                    backgroundImage: `url(${page.backdropUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                } : undefined
            }>
            {/* Backdrop overlay for readability */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" />

            <div className="relative z-10 max-w-3xl w-full mx-4 bg-zinc-800/40 backdrop-blur-md rounded-2xl p-8 shadow-xl">
                <div className="flex items-center gap-4 justify-center">
                    <img src={page.avatarUrl} alt={page.name} className="w-24 h-24 rounded-full" />

                    <div>
                        <h1 className="text-3xl font-semibold">{page.name}</h1>
                        <p className="text-sm tracking-[0.3em] text-zinc-500/60">@{page.username.toUpperCase()}</p>
                    </div>
                </div>

                {page.status && (
                    <div className="italic text-zinc-400/80 text-center mb-3">{page.status}</div>
                )}

                <div className="whitespace-pre-line max-w-none text-center mx-auto"><ReactMarkdown
                    components={{
                        a: ({ node, ...props }) => (
                            <a {...props} className="underline underline-offset-4 decoration-zinc-400 hover:decoration-zinc-200 transition-colors" target="_blank" rel="noopener noreferrer" />
                        ),
                        p: ({ node, ... props }) => (
                            <p className="my-2 leading-relaxed text-zinc-200">{props.children}</p>
                        ),
                    }}
                >{page.bio}</ReactMarkdown></div>
            </div>
        </main>
    );
}

export const runtime = "nodejs";