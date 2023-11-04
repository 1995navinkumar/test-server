import express from "express";
import { httpLogMiddleware } from "./httpLogMiddleware.mjs";
import logger from "./logger.mjs";
// import { getDB } from "./mongo.mjs";
import { metricApi, requestCounter } from "./metrics.mjs";

const waitFor = delay => new Promise((resolve) => setTimeout(resolve, delay));

const port = 8888;

const app = express();


app.get("/metrics", metricApi);

app.use(httpLogMiddleware);

app.get("/error", (req, res) => {
    res.status(500).send("Intentional Error Thrown");
})

app.get("/uncaught", (req, res) => {
    throw new Error("uncaught error in code");
})

app.get("/*", async (req, res) => {
    await waitFor(Math.random() * 5000);
    res.end("Successful..!!");
})

// app.get("/todos", async (req, res, next) => {
//     const db = await getDB();
//     if (!db) {
//         res.end("noDB");
//         return;
//     }
//     const todos = db.collection("todo");
//     const query = {};
//     const todo = await todos.find(query).toArray();
//     res.json(todo);
// })

// app.get("/add", async (req, res, next) => {
//     const db = await getDB();
//     if (!db) {
//         res.end("noDB");
//         return;
//     }
//     const todos = db.collection("todo");
//     const doc = await todos.insertOne({ name: `navin-${count++}` });
//     res.json(doc);
// })

app.use((err, req, res, next) => {
    logger.error(err);
    res.status(500).send("Something went wrong bro..!!");
})

const server = app.listen(port, function () {
    const port = server.address().port;
    console.log('service listening on port:', port);
});