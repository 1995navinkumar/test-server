import { MongoClient } from "mongodb";

// Replace the uri string with your connection string.
const mongoService = `mongo-svc:27017`;
const uri = `mongodb://admin:password@${mongoService}/?authMechanism=DEFAULT`;

const client = new MongoClient(uri);

export async function getDB(dbname = "app") {
    try {
        await client.connect();
        return client.db(dbname);
    } catch (err) {
        console.log(err);
    }
}