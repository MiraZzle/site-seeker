import express from "express";
import http from "http";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import { WebSocketServer } from "ws";
import sqlite3 from "sqlite3";
import { fileURLToPath, pathToFileURL } from "url";
import path from "path";

import { createHandler } from "graphql-http/lib/use/express";
import { graphql, GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLBoolean } from 'graphql';
import { ruruHTML } from "ruru/server";

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

// Swagger API documentation setup
const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Crawler API",
			version: "1.0.0",
		},
	},
	apis: [__filename], // Path to your API docs
};

const swaggerSpec = swaggerJSDoc(options);

/**
 * @swagger
 * components:
 *   schemas:
 *     WebsiteRecord:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the website record
 *         url:
 *           type: string
 *           description: The URL of the website
 *         boundaryRegExp:
 *           type: string
 *           description: The regular expression defining the boundary
 *         periodicity:
 *           type: integer
 *           description: The periodicity of the crawl
 *         label:
 *           type: string
 *           description: The label for the website record
 *         isActive:
 *           type: boolean
 *           description: Whether the record is active
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: List of tags associated with the record
 *         isBeingCrawled:
 *           type: boolean
 *           description: Whether the website is currently being crawled
 */

/**
 * @swagger
 * /:
 *   get:
 *     description: This is the root path!
 *     responses:
 *       200:
 *         description: Returns a message.
 */
app.get("/", (req, res) => {
	const rootMessage = { message: "This is the root path!" };
	res.json(rootMessage);
});

/**
 * @swagger
 * /api/websiteRecords/:
 *   get:
 *     description: Get all website records.
 *     responses:
 *       200:
 *         description: Successfully retrieved all records.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WebsiteRecord'
 *       500:
 *         description: Internal server error.
 */
app.get("/api/websiteRecords/", async (req, res) => {
	const result = await model.getAllWebsiteRecords();
	if (result) {
		res.status(200).json(result);
	} else {
		res.status(500).json({ message: "INTERNAL SERVER ERROR" });
	}
});

/**
 * @swagger
 * /api/websiteRecords/add:
 *   post:
 *     description: Add a new website record.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WebsiteRecord'
 *     responses:
 *       200:
 *         description: Successfully added the website record.
 */
app.post("/api/websiteRecords/add", (req, res) => {
	const additionController = new AdditionController(model);
	const websiteRecordTemp = req.body;
	const websiteRecord = DataFormatter.getRecordFromJson(websiteRecordTemp);
	additionController.addWebsiteRecord(websiteRecord, crawlerManager);
	res.status(200).json({ message: "Website record added" });
});

/**
 * @swagger
 * /api/websiteRecords/delete/{id}:
 *   delete:
 *     description: Delete a website record by ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully deleted the website record.
 */
app.delete("/api/websiteRecords/delete/:id", (req, res) => {
	const deletionController = new DeletionController(model);
	const requestedId = req.params.id;
	deletionController.deleteWebsiteRecord(requestedId);
	res.status(200).json({
		message: `Deleted website record with id ${requestedId}`,
	});
});

/**
 * @swagger
 * /api/websiteRecords/update/{id}:
 *   put:
 *     description: Update a website record by ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WebsiteRecord'
 *     responses:
 *       200:
 *         description: Successfully updated the website record.
 */
app.put("/api/websiteRecords/update/:id", (req, res) => {
	const updateController = new UpdateController(model);
	const requestedId = req.params.id;
	const updatedRecord = req.body;
	updateController.updateWebsiteRecord(requestedId, updatedRecord);
	res.status(200).json({
		message: `Updated website record with id ${requestedId}`,
	});
});

// GraphQL schema
const WebPageType = new GraphQLObjectType({
	name: "WebPage",
	fields: {
		identifier: { type: GraphQLID },
		label: { type: GraphQLString },
		url: { type: GraphQLString },
		regexp: { type: GraphQLString },
		tags: { type: new GraphQLList(GraphQLString) },
		active: { type: GraphQLBoolean },
		periodicity: {type: GraphQLString}
	}
});

const NodeType = new GraphQLObjectType({
	name: "Node",
	fields: () => ({
		title: { type: GraphQLString },
		url: { type: GraphQLString },
		crawlTime: { type: GraphQLString },
		links: { type: new GraphQLList(NodeType) },
		owner: { type: WebPageType }
	})
});

const schema = new GraphQLSchema({
	query: new GraphQLObjectType({
		name: 'Query',
		fields: {
			websites: {
				type: new GraphQLList(WebPageType),
				resolve: async () => {
					const records = await model.getAllWebsiteRecords();
					return records.map(record => ({
						identifier: record.id,
						label: record.label,
						url: record.url,
						regexp: record.boundaryRegExp,
						tags: record.tags,
						active: record.isActive,
						periodicity: record.periodicity
					}));
				}
			},
			nodes: {
				type: new GraphQLList(NodeType),
				args: {
					webPages: { type: new GraphQLList(GraphQLID) }
				},
				resolve: async (_, { webPages }) => {
					const nodes = await model.getNodesByWebPageIds(webPages);
					return nodes;
				}
			}
		},
	}),
});

app.all(
	"/graphql",
	createHandler({
		schema: schema,
	})
);

app.get("/graphiql", (_req, res) => {
	res.type("html");
	res.end(ruruHTML({ endpoint: "/graphql" }));
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
	console.log("Server is listening on port " + port);
});
