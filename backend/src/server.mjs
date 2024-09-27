import express from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import sqlite3 from "sqlite3";
import { fileURLToPath, pathToFileURL } from "url";
import path from "path";
import cors from "cors";

import { createHandler } from "graphql-http/lib/use/express";
import { ruruHTML } from "ruru/server";
import StartController from "./controllers/startController.mjs";
import ExecutionsController from "./controllers/executionsController.mjs";
import GetController from "./controllers/getController.mjs";
import { schema } from "./graphqlSchema.mjs";

// Define this file's __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define all the necessary paths
const dbPath = path.join(__dirname, "./db/crawler.db");
const modelPath = pathToFileURL(
  path.join(__dirname, "./models/model.mjs")
).href;
const additionControllerPath = pathToFileURL(
  path.join(__dirname, "./controllers/additionController.mjs")
).href;
const deletionControllerPath = pathToFileURL(
  path.join(__dirname, "./controllers/deletionController.mjs")
).href;
const updateControllerPath = pathToFileURL(
  path.join(__dirname, "./controllers/updateController.mjs")
).href;
const dataFormatterPath = pathToFileURL(
  path.join(__dirname, "./utils/dataFormatter.mjs")
).href;
const crawlerManagerPath = pathToFileURL(
  path.join(__dirname, "./crawlers/crawlerManager.mjs")
).href;

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
const port = process.env.BACKEND_PORT || 3000;

app.use(
  cors({
    origin: "*", // Replace this with the URL of your frontend
  })
);

// Middleware to parse JSON data
app.use(express.json());
app.use(cors());

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
  const getController = new GetController(model);
  const result = await getController.getAllWebsiteRecords();
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
});

/**
 * @swagger
 * /api/websiteRecords/nodes/{id}:
 *   get:
 *     description: Get a website record by node ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the node to fetch the website record for.
 *     responses:
 *       200:
 *         description: Successfully retrieved the website record.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WebsiteRecord'
 *       404:
 *         description: Website record not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message if website record not found.
 *       500:
 *         description: Internal server error.
 */
app.get("/api/websiteRecords/nodes/:id", async (req, res) => {
  const getController = new GetController(model);
  const result = await getController.getWebsiteRecordByNodeId(req.params.id);
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
app.post("/api/websiteRecords/add", async (req, res) => {
  const additionController = new AdditionController(model);
  const websiteRecordTemp = req.body;
  const websiteRecord = DataFormatter.getRecordFromJson(websiteRecordTemp);

  try {
    const addedWebsiteRecordId = await additionController.addWebsiteRecord(
      websiteRecord,
      crawlerManager
    );
    res.status(200).json({
      message: `Website record added with id ${addedWebsiteRecordId}`,
      lastId: addedWebsiteRecordId,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
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
  deletionController.deleteWebsiteRecord(Number(requestedId), crawlerManager);
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
app.put("/api/websiteRecords/update/:id", async (req, res) => {
  const updateController = new UpdateController(model);
  const requestedId = req.params.id;
  const updatedRecord = req.body;

  try {
    await updateController.updateWebsiteRecord(requestedId, updatedRecord);
    res.status(200).json({
      message: `Updated website record with id ${requestedId}`,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/websiteRecords/start/{id}:
 *   post:
 *     description: Start the execution of a website record by ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the website record to start execution.
 *     responses:
 *       200:
 *         description: Successfully started the execution of the website record.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the execution has started.
 *       500:
 *         description: Internal server error.
 */
app.post("/api/websiteRecords/start/:id", (req, res) => {
  const startController = new StartController(model);
  const requestedId = req.params.id;

  startController.startWebsiteRecordExecution(requestedId, crawlerManager);

  res.status(200).json({
    message: `Execution of Record ${requestedId} has started!`,
  });
});

/**
 * @swagger
 * /api/executions:
 *   get:
 *     description: Get all executions.
 *     responses:
 *       200:
 *         description: Returns all executions.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The ID of the execution.
 *                   websiteLabel:
 *                     type: string
 *                     description: The label of the website associated with the execution.
 *                   status:
 *                     type: string
 *                     description: The status of the execution (e.g., Finished).
 *                   startTime:
 *                     type: string
 *                     format: date-time
 *                     description: The start time of the execution.
 *                   endTime:
 *                     type: string
 *                     format: date-time
 *                     description: The end time of the execution.
 *                   crawledSites:
 *                     type: integer
 *                     description: The number of sites crawled during the execution.
 *       500:
 *         description: Internal server error.
 */
app.get("/api/executions", async (req, res) => {
  const executionsController = new ExecutionsController(model);
  const result = await executionsController.getAllExecutions();
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
});

/**
 * @swagger
 * /api/executions/{id}:
 *   get:
 *     description: Get executions by website record ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the website record to fetch executions for.
 *     responses:
 *       200:
 *         description: Returns executions for the specified website record.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The ID of the execution.
 *                   websiteLabel:
 *                     type: string
 *                     description: The label of the website associated with the execution.
 *                   status:
 *                     type: string
 *                     description: The status of the execution (e.g., Finished).
 *                   startTime:
 *                     type: string
 *                     format: date-time
 *                     description: The start time of the execution.
 *                   endTime:
 *                     type: string
 *                     format: date-time
 *                     description: The end time of the execution.
 *                   crawledSites:
 *                     type: integer
 *                     description: The number of sites crawled during the execution.
 *       404:
 *         description: Website record not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message if website record not found.
 *       500:
 *         description: Internal server error.
 */
app.get("/api/executions/:id", async (req, res) => {
  const executionsController = new ExecutionsController(model);
  const requestedId = req.params.id;

  const result =
    await executionsController.getExecutionsForWebsiteRecord(requestedId);
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
});

app.all(
  "/graphql",
  createHandler({
    schema: schema,
    context: { model },
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
