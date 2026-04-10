import { Collection, Db, Document, MongoClient, MongoClientOptions } from "mongodb";

const maybeMongoUri = process.env.MONGODB_URI ?? process.env.MONGO_URI;

if (!maybeMongoUri) {
    throw new Error("Missing MongoDB URI. Set MONGODB_URI or MONGO_URI.");
}

const MONGO_URI: string = maybeMongoUri;

const DB_NAME = process.env.MONGODB_DB ?? "url_shortener";

let client: MongoClient | null = null;
let db: Db | null = null;

async function connect(): Promise<Db> {
    if (!client) {
        const allowInsecureTls = process.env.MONGODB_TLS_INSECURE === "true";
        const options: MongoClientOptions = {
            serverSelectionTimeoutMS: 10000,
            family: 4,
            tls: true,
            ...(allowInsecureTls ? { tlsAllowInvalidCertificates: true } : {}),
        };

        client = new MongoClient(MONGO_URI, options);
        await client.connect();
    }

    if (!db) {
        db = client.db(DB_NAME);
    }

    return db;
}

export default async function getCollection<T extends Document = Document>(
    collectionName: string,
): Promise<Collection<T>> {
    const database = await connect();
    return database.collection<T>(collectionName);
}