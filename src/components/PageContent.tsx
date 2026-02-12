"use client";

import { useEffect, useRef, useState } from "react";
import { Field, inputClass } from "./PageEditor";
import ReactMarkdown from "react-markdown";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PageContent({ page }: any) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [requiresClick, setRequiresClick] = useState(false);
    const [showClickOverlay, setShowClickOverlay] = useState(false);
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [canSend, setCanSend] = useState(true);

    // Autoplay
    useEffect(() => {
        if (!page.musicUrl) return;

        const audio = audioRef.current!;
        audio.volume = 0.5;
        const playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.catch(() => {
                setRequiresClick(true);
                setShowClickOverlay(true);
            });
        }
    }, [page.musicUrl]);

    const handlePlayClick = () => {
        audioRef.current?.play();
        setShowClickOverlay(false)
        setRequiresClick(false);
    };

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
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={page.avatarUrl} alt={page.name} className="w-24 h-24 rounded-full" />

                        <div>
                            <h1 className="text-3xl font-semibold">{page.name}</h1>
                            <p className="text-sm tracking-[0.3em] text-zinc-500/60">@{page.username.toUpperCase()}</p>
                        </div>
                    </div>

                    {page.status && (
                        <div className="italic text-zinc-400/80 text-center mb-3 mt-4">{page.status}</div>
                    )}

                    <div className="whitespace-pre-line max-w-none text-center mx-auto"><ReactMarkdown
                        components={{
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            a: ({ node, ...props }) => (
                                <a {...props} className="underline underline-offset-4 decoration-zinc-400 hover:decoration-zinc-200 transition-colors" target="_blank" rel="noopener noreferrer" />
                            ),
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            p: ({ node, ... props }) => (
                                <p className="my-2 leading-relaxed text-zinc-200">{props.children}</p>
                            ),
                        }}
                    >{page.bio}</ReactMarkdown></div>

                    {page.showMessageBox && (
                        <Field label="Leave an anonymous message!">
                            <div className="flex flex-row items-center">
                                <input
                                className={inputClass}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Your message..."
                                />

                                <button
                                    className="
                                        ml-2 w-48 rounded-lg px-4 min-h-[2.3rem] text-m font-medium
                                        bg-zinc-900/40 text-indigo-200 justify-center
                                        border border-indigo-400/30
                                        hover:bg-indigo-900/30
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                        transition
                                    "
                                    disabled={sending || message.trim() === "" || sent || !canSend}
                                    onClick={async () => {
                                        if (message.trim() === "") return;
                                        if (message.length > 1000) {
                                            alert("Message is too long! Please limit it to 1000 characters.");
                                            return;
                                        }
                                        setSending(true);
                                        const res = await fetch("/api/messages/submit", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({
                                                slug: page.slug,
                                                message: message,
                                            }),
                                        })

                                        if (res.ok) {
                                            setMessage("");
                                            setSent(true);
                                            setTimeout(() => setSent(false), 3000);
                                        } else {
                                            if (res.status === 403) {
                                                alert("Sorry! You have been blacklisted from sending messages.");
                                                setCanSend(false);
                                            } else {
                                                alert("Failed to send message. Please try again later.");
                                            }
                                        }

                                        setSending(false);
                                    }}
                                >
                                    {sent ? "Sent!" : "Send"}
                                </button>
                            </div>
                        </Field>
                    )}
                </div>

                {requiresClick && (
                    <div className={`absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-lg z-50 transition-opacity duration-500 ${
                        !showClickOverlay ? "opacity-0 pointer-events-none" : "opacity-100"
                }`} onClick={handlePlayClick}>
                        <span className="text-white text-2xl font-semibold px-6 py-3">Click to enter...</span>
                    </div>
                )}

                {/* Audio element */}
                {page.musicUrl && (
                    <audio ref={audioRef} src={page.musicUrl} loop />
                )}
            </main>
    );
}