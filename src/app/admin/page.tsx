"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
    const [userId, setUserId] = useState("");
    const router = useRouter();

    function submit(e: React.SubmitEvent) {
        e.preventDefault();
        if (!userId.trim()) return;
        router.push(`/admin/${userId.trim()}`);
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-zinc-900 text-white">
            <div className="relative z-10 max-w-3xl w-full mx-4 bg-zinc-800/40 backdrop-blur-md rounded-2xl p-8 shadow-xl justify-center text-center">
                <h1 className="text-2xl font-semibold mb-4 justify-center text-center">Page Editor</h1>

                <form onSubmit={submit} className="space-y-4">
                <input
                    className="w-100 border rounded p-2 justify-center text-center"
                    placeholder="User ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />

                <br/>

                <button
                    type="submit"
                    className="w-48 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
                >
                    Edit Page
                </button>
            </form>
            </div>
        </main>
    )
}