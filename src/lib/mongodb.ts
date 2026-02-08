import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is null!");
}

if (process.env.NODE_ENV == "development") {
    // @ts-expect-error global is not defined in node.js
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        // @ts-expect-error global is not defined in node.js
        global._mongoClientPromise = client.connect();
    }

    // @ts-expect-error global is not defined in node.js
    clientPromise = global._mongoClientPromise;
} else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

export default clientPromise;