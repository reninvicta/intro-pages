import clientPromise from "./mongodb";

export async function getAllMessages(userId: string) {
    const client = await clientPromise;
    const db = client.db("intro-pages");

    return db.collection(`messages-${userId}`).find().toArray();
}

export async function addMessage(userId: string, message: string, sourceIp: string, sourceUserAgent: string) {
    const client = await clientPromise;
    const db = client.db("intro-pages");

    return db.collection(`messages-${userId}`).insertOne({
        content: message,
        createdAt: new Date().toString(),
        ipAddress: sourceIp,
        userAgent: sourceUserAgent,
        messageId: crypto.randomUUID(),
    });
}

export async function removeMessage(userId: string, messageId: string) {
    const client = await clientPromise;
    const db = client.db("intro-pages");

    return db.collection(`messages-${userId}`).deleteOne({ messageId: messageId });
}

export async function blacklistIp(ip: string) {
    const client = await clientPromise;
    const db = client.db("intro-pages");

    return db.collection("blacklisted-ips").insertOne({ ip: ip, blacklistedAt: new Date().toString() });
}

export async function isIpBlacklisted(ip: string) {
    const client = await clientPromise;
    const db = client.db("intro-pages");

    const entry = await db.collection("blacklisted-ips").findOne({ ip: ip });
    return !!entry;
}