/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect } from "react";

export const inputClass = "w-full rounded-lg bg-zinc-950/60 border border-white/10 " +
    "px-3 py-2 text-sm min-h-[2.5rem]" +
    "focus:outline-none focus:ring-2 focus:ring-indigo-500/40 " +
    "focus:border-indigo-500/40 transition text-center";

export function Field({ label, description, children }: { label:string, description?: string, children: React.ReactNode }) {
    return (
        <div className="justify-center text-center rounded-xl bg-zinc-900/40 border border-white/5 space-y-2 backdrop-blur-sm p-2">
            <div>
                <label className="text-m text-center font-medium text-zinc-200"><b>{label}</b></label>
                {description && (
                    <p className="text-xs text-zinc-400 mt-0.5">{description}</p>
                )}
            </div>
            {children}
        </div>
    );
}

function Toggle({ label, checked, onChange }: { label: string, checked: boolean, onChange: (value: boolean) => void }) {
    return (
        <button
        type="button"
        onClick={() => onChange(!checked)}
        className="flex items-center justify-between w-full rounded-xl p-4
                    bg-zinc-900/40 border border-white/5 backdrop-blur-sm
                    hover:bg-zinc-900/60 transition"
        >
        <span className="text-m text-zinc-200 font-medium">
            <b>{label}</b>
        </span>

        {/* Track */}
        <span
            className={`relative h-5 w-9 rounded-full transition-colors ${
            checked ? "bg-indigo-500/60" : "bg-zinc-700"
            }`}
        >
            {/* Knob */}
            <span
            className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white
                        transition-transform ${
                            checked ? "translate-x-4" : "translate-x-0"
                        }`}
            />
        </span>
        </button>
    );
}

export default function PageEditor({ page }: { page: any }) {
    const [form, setForm] = useState(page);
    const [saving, setSaving] = useState(false);
    const bioRef = useRef<HTMLTextAreaElement | null>(null);

    function update<K extends keyof typeof form>(key: K, value: any) {
        setForm((f: any) => ({ ...f, [key]: value }));
    }

    async function save() {
        setSaving(true);
        await fetch("../../api/admin/page", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Id ${page.userId}` },
            body: JSON.stringify(form),
        });
        setSaving(false);
    }

    useEffect(() => {
        const el = bioRef.current;
        if (el) {
            el.style.height = "auto";
            el.style.height = `${el.scrollHeight}px`;
        }
    })

    return (
        <main className="min-h-screen flex items-center justify-center bg-zinc-900 text-white"
            style={
                form.backdropUrl ? {
                    backgroundImage: `url(${form.backdropUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                } : {}
            }
        >
            {/* Backdrop overlay for readability */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" />

            <div className="relative z-10 max-w-3xl w-full mx-4 bg-zinc-800/40 backdrop-blur-md rounded-2xl p-8 shadow-xl justify-center text-center">
                <h1 className="text-2xl font-semibold mb-4 justify-center text-center">Editor for {form.username ?? form.name}</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Text fields */}

                    <Field label="Slug" description="The path to this page relative to invicta.dev.">
                        <input
                            className={inputClass}
                            value={form.slug}
                            onChange={(e) => update("slug", e.target.value)}
                        ></input>
                    </Field>

                    <Field label="Name" description="The name displayed on the page, as well as the page title.">
                        <input
                            className={inputClass}
                            value={form.name}
                            onChange={(e) => update("name", e.target.value)}
                        ></input>
                    </Field>

                    <Field label="Username" description="The username displayed below the name.">
                        <input
                            className={inputClass}
                            value={form.username}
                            onChange={(e) => update("username", e.target.value)}
                        ></input>
                    </Field>

                    <Field label="Avatar URL" description="The URL of the profile picture displayed on the page.">
                        <input
                            className={inputClass}
                            value={form.avatarUrl}
                            onChange={(e) => update("avatarUrl", e.target.value)}
                        ></input>
                    </Field>

                    <Field label="Backdrop URL" description="The URL of the backdrop image displayed on the page.">
                        <input
                            className={inputClass}
                            value={form.backdropUrl}
                            onChange={(e) => update("backdropUrl", e.target.value)}
                        ></input>
                    </Field>

                    <Field label="Music URL" description="The URL of the music that automatically plays when visiting the page.">
                        <input
                            className={inputClass}
                            value={form.musicUrl}
                            onChange={(e) => update("musicUrl", e.target.value)}
                        ></input>
                    </Field>

                    <Field label="Status" description="The current status of the page.">
                        <input
                            className={inputClass}
                            value={form.status}
                            onChange={(e) => update("status", e.target.value)}
                        ></input>
                    </Field>

                    <Field label="Discord User ID" description="The Discord user ID associated with this page.">
                        <input
                            className={inputClass}
                            value={form.discordId}
                            onChange={(e) => update("discordId", e.target.value)}
                        ></input>
                    </Field>

                    <div className="md:col-span-2 space-y-4">
                        <Field label="Bio (Markdown supported)" description="A short biography or description for the page.">
                            <textarea
                                ref={bioRef}
                                className={`${inputClass} resize-none overflow-hidden`}
                                value={form.bio}
                                rows={1}
                                onChange={(e) => {
                                    update("bio", e.target.value);

                                    const el = bioRef.current;
                                    if (el) {
                                        el.style.height = "auto";
                                        el.style.height = `${el.scrollHeight}px`;
                                    }
                                }
                            }
                            ></textarea>
                        </Field>
                    </div>

                    <Toggle label="Use Discord Avatar" checked={form.useDiscordValues} onChange={(v) => update("useDiscordValues", v)} />
                    <Toggle label="Show Message Box" checked={form.showMessageBox} onChange={(v) => update("showMessageBox", v)} />
                </div>

                <button
                    onClick={save}
                    disabled={saving}
                    className="
                        mt-6 w-48 rounded-xl px-4 py-2 text-m font-medium
                        bg-zinc-900/40 text-indigo-200 justify-center
                        border border-indigo-400/30
                        hover:bg-indigo-900/30
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition
                    "
                >
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </main>
    )
}