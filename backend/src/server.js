import express from "express";
import http from "http";
import { WebSocketServer } from "ws";

// Express application
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
app.get("/api/websiteRecords/", (req, res) => {});

app.post("/api/websiteRecords/add", (req, res) => {});

app.delete("/api/websiteRecords/delete/:id", (req, res) => {});

app.put("/api/websiteRecords/update/:id", (req, res) => {});

// GraphQL endpoint
// app.use("/graphql", createHandler({ schema, rootValue: root }));

// app.get("/graphiql", (req, res) => {});

app.listen(port, () => {
	console.log("Server is listening on port " + port);
});
