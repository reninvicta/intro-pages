/* eslint-disable @typescript-eslint/no-explicit-any */
import clientPromise from "./mongodb";
import { cache } from "react";

export const getCachedPageBySlug = cache(getPageBySlug);

export async function getPageBySlug(slug: string) {
    const client = await clientPromise;
    const db = client.db("intro-pages");

    return db.collection("pages").findOne({ slug: slug });
}

export async function getPageByUserId(userId: string) {
    const client = await clientPromise;
    const db = client.db("intro-pages");

    return db.collection("pages").findOne({ userId: userId });
}

export async function updatePageByUserId(username: string, data: any) {
    const client = await clientPromise;
    const db = client.db("intro-pages");

    return db.collection("pages").updateOne({ username: username }, { $set: data }, { upsert: true });
}