import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import Model from "./models/model.mjs";
import sqlite3 from "sqlite3";

// Express application
const db = new sqlite3.Database("./src/db/crawler.db");
const model = new Model(db);
const app = express();
const server = http.createServer(app);
const wsServer = new WebSocketServer({ server });
const port = 3000;

// Middleware to parse JSON data

// Root API endpoint
app.get("/", (req, res) => {
	const rootMessage = { message: "This is the root path!" };
	res.json(rootMessage);
});

// API endpoint for website records
app.get("/api/websiteRecords/", async (req, res) => {
	const result = await model.getAllWebsiteRecords();
	if (result) {
		res.status(200).json(result);
	} else {
		res.status(500).json({ message: "INTERNAL SERVER ERROR" });
	}
});

app.post("/api/websiteRecords/add", (req, res) => {});

app.delete("/api/websiteRecords/delete/:id", (req, res) => {});

app.put("/api/websiteRecords/update/:id", (req, res) => {});

// GraphQL endpoint
// app.use("/graphql", createHandler({ schema, rootValue: root }));

// app.get("/graphiql", (req, res) => {});

app.listen(port, () => {
	console.log("Server is listening on port " + port);
});
