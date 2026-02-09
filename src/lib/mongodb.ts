import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;

if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is null!");
}

declare global {
    var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const client = new MongoClient(uri, { tls: true, tlsAllowInvalidCertificates: false, serverSelectionTimeoutMS: 5000 });

const clientPromise = global._mongoClientPromise ?? (global._mongoClientPromise = client.connect());

export default clientPromise;