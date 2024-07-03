import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import sqlite3 from "sqlite3";
import { fileURLToPath, pathToFileURL } from "url";
import path from "path";

// Define this file's __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define all the necessary paths
const dbPath = path.join(__dirname, "./db/crawler.db");
const modelPath = pathToFileURL(path.join(__dirname, "./models/model.mjs")).href;
const additionControllerPath = pathToFileURL(path.join(__dirname, "./controllers/additionController.mjs")).href;
const deletionControllerPath = pathToFileURL(path.join(__dirname, "./controllers/deletionController.mjs")).href;
const updateControllerPath = pathToFileURL(path.join(__dirname, "./controllers/updateController.mjs")).href;
const dataFormatterPath = pathToFileURL(path.join(__dirname, "./utils/dataFormatter.mjs")).href;
const crawlerManagerPath = pathToFileURL(path.join(__dirname, "./crawlers/crawlerManager.mjs")).href;

// Dynamically import modules
const { default: Model } = await import(modelPath);
const { default: AdditionController } = await import(additionControllerPath);
const { default: DeletionController } = await import(deletionControllerPath);
const { default: UpdateController } = await import(updateControllerPath);
const { default: DataFormatter } = await import(dataFormatterPath);
const { default: CrawlerManager } = await import(crawlerManagerPath);

// Express application
const db = new sqlite3.Database(dbPath);
const model = new Model(db);
const crawlerManager = new CrawlerManager(model);
const app = express();
const server = http.createServer(app);
const wsServer = new WebSocketServer({ server });
const port = 3000;

// Middleware to parse JSON data
app.use(express.json());

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

app.post("/api/websiteRecords/add", (req, res) => {
	const additionController = new AdditionController(model);
	const websiteRecordTemp = req.body;
	const websiteRecord = DataFormatter.getRecordFromJson(websiteRecordTemp);
	additionController.addWebsiteRecord(websiteRecord, crawlerManager);
	res.status(200).json({ message: "Website record added" });
});

app.delete("/api/websiteRecords/delete/:id", (req, res) => {
	const deletionController = new DeletionController(model);
	const requestedId = req.params.id;
	deletionController.deleteWebsiteRecord(requestedId);
	res.status(200).json({ message: `Deleted website record with id ${requestedId}` });
});

app.put("/api/websiteRecords/update/:id", (req, res) => {
	const updateController = new UpdateController(model);
	const requestedId = req.params.id;
	const updatedRecord = req.body.updatedWebsiteRecord;
	updateController.updateWebsiteRecord(requestedId, updatedRecord);
	res.status(200).json({ message: `Updated website record with id ${requestedId}` });
});

// GraphQL endpoint
// app.use("/graphql", createHandler({ schema, rootValue: root }));

// app.get("/graphiql", (req, res) => {});

app.listen(port, () => {
	console.log("Server is listening on port " + port);
});
