/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect } from "react";

export default function MessageInbox({ page, messages }: { page: any, messages: any[] }) {
    return (
        <main className="min-h-screen flex items-center justify-center bg-zinc-900 text-white"
            style={
                page.backdropUrl ? {
                    backgroundImage: `url(${page.backdropUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                } : {}
            }
        >
            {/* Backdrop overlay for readability */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" />

            <div className="relative z-10 max-w-3xl w-full mx-4 bg-zinc-800/40 backdrop-blur-md rounded-2xl shadow-xl justify-center text-center overflow-hidden flex flex-col">
                <h1 className="text-2xl font-semibold px-8 pt-8 pb-4 justify-center text-center">Inbox for {page.username ?? page.name}</h1>

                <div className="flex flex-col gap-4 max-h-96 overflow-y-auto px-8 pb-8">
                    {messages.length === 0 ? (
                        <p className="text-gray-400">No messages yet.</p>
                    ) : (
                        messages.map((message) => (
                            <div key={message.messageId} id={`message-${message.messageId}`} className="bg-zinc-700/50 rounded-lg text-center overflow-hidden min-h-[124px] flex flex-col">
                                {/* topbar with timestamp and ip */}
                                <div className="flex justify-between text-sm text-zinc-200 mb-2 bg-zinc-900/30 p-2 border-b border-indigo-400/30">
                                    <span>{new Date(message.createdAt).toLocaleString()}</span>
                                    <span>{message.ipAddress}</span>
                                </div>

                                <p className="text-md text-zinc-200 mb-1">{message.content}</p>

                                {/* bottom-bar with buttons: Delete, Blacklist IP */}
                                <div className="flex justify-left space-x-2 text-sm text-zinc-200 mt-2 bg-zinc-900/30 p-2 border-t border-indigo-400/30">
                                    <button className="px-3 py-1 bg-red-900/80 rounded hover:bg-red-900 transition-colors" onClick={() => {
                                        if (confirm("Are you sure you want to delete this message? This action cannot be undone.")) {
                                            fetch(`/api/messages/${message.messageId}`, {
                                                method: "DELETE",
                                                headers: {
                                                    "Authorization": `Id ${page.userId}`
                                                }
                                            }).then((res) => {
                                                if (res.ok) {
                                                    alert("Message deleted successfully.");

                                                    // remove message from UI
                                                    const messageElement = document.getElementById(`message-${message.messageId}`);
                                                    if (messageElement) {
                                                        messageElement.remove();
                                                    }
                                                } else {
                                                    alert("Failed to delete message.");
                                                }
                                            });
                                        }
                                    }}>Delete</button>

                                    <button className="px-3 py-1 bg-yellow-900/80 rounded hover:bg-yellow-900 transition-colors" onClick={() => {
                                        if (confirm(`Are you sure you want to blacklist the IP address ${message.ipAddress}? This will prevent any future messages from this IP. This action cannot be undone.`)) {
                                            let success = true;
                                            fetch(`/api/messages/blacklist-ip`, {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type": "application/json",
                                                    "Authorization": `Id ${page.userId}`
                                                },
                                                body: JSON.stringify({ ipAddress: message.ipAddress }),
                                            }).then((res) => {
                                                if (!res.ok) success = false;
                                            });

                                            fetch(`/api/messages/${message.messageId}`, {
                                                method: "DELETE",
                                                headers: {
                                                    "Authorization": `Id ${page.userId}`
                                                }
                                            }).then((res) => {
                                                if (res.ok) {
                                                    alert(success ? "IP address blacklisted and message deleted successfully." : "Message deleted successfully, but failed to blacklist IP.");

                                                    const messageElement = document.getElementById(`message-${message.messageId}`);
                                                    if (messageElement) {
                                                        messageElement.remove();
                                                    }
                                                } else {
                                                    alert(success ? "IP address blacklisted successfully, but failed to delete message." : "Failed to blacklist IP and delete message. Is the API down?");
                                                }
                                            });
                                        }}}>Blacklist IP</button>
                                    </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </main>
    )
}