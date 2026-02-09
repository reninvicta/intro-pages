import clientPromise from "./mongodb";

export async function getPageBySlug(slug: string) {
    const client = await clientPromise;
    const db = client.db("intro-pages");

    return db.collection("pages").findOne({ slug: slug });
}