"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
    const [userId, setUserId] = useState("");
    const router = useRouter();

    return (
        <main className="min-h-screen flex items-center justify-center bg-zinc-900 text-white">
            <div className="relative z-10 max-w-3xl w-full mx-4 bg-zinc-800/40 backdrop-blur-md rounded-2xl p-8 shadow-xl justify-center text-center">
                <h1 className="text-2xl font-semibold mb-4 justify-center text-center">Login Page</h1>

                <input
                    className="w-100 border rounded p-2 justify-center text-center"
                    placeholder="User ID"
                    value={userId}
                    type="password"
                    onChange={(e) => setUserId(e.target.value)}
                />

                <div className="mt-4 flex justify-center text-center space-x-4">

                    <button
                        type="button"
                        onClick={() => !userId.trim() || router.push(`/admin/editor/${userId.trim()}`)}
                        className="w-48 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                        Edit Page
                    </button>

                    <button
                        type="button"
                        onClick={() => !userId.trim() || router.push(`/admin/messages/${userId.trim()}`)}
                        className="w-48 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors"
                    >
                        View Inbox
                    </button>
                </div>
            </div>
        </main>
    )
}