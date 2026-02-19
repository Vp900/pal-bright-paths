import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB;

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connect(): Promise<Db> {
  if (!client) {
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true } as any);
    await client.connect();
    db = client.db(dbName);
    return db;
  }

  if (!db) db = client.db(dbName);
  return db as Db;
}

export function getDb(): Db {
  if (!db) throw new Error('MongoDB not connected. Call connect() first.');
  return db;
}

export async function close(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}
