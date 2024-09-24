import sqlite3 from "sqlite3";
import { fileURLToPath } from "url";
import path from "path";

// Define this file's __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the path to the database and access it
const dbPath = path.join(__dirname, "../db/crawler.db");
const db = new sqlite3.Database(dbPath);

function createDatabase() {
  db.serialize(() => {
    db.run(`
            CREATE TABLE IF NOT EXISTS website_records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                url TEXT,
                boundaryRegExp TEXT,
                periodicity TEXT,
                label TEXT,
                isActive BOOLEAN,
                tags TEXT,
                isBeingCrawled BOOLEAN DEFAULT 0
            )
        `);
    db.run(`
            CREATE TABLE IF NOT EXISTS execution_records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                websiteRecordId INTEGER,
                status TEXT,
                startTime DATETIME,
                endTime DATETIME,
                crawledCount INTEGER,
                FOREIGN KEY (websiteRecordId) REFERENCES website_records(id) ON DELETE CASCADE
            )
        `);
    db.run(`
            CREATE TABLE IF NOT EXISTS crawled_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                executionId INTEGER,
                url TEXT,
                crawlTime DATETIME,
                title TEXT,
                outgoingLinks TEXT,
                FOREIGN KEY (executionId) REFERENCES execution_records(id) ON DELETE CASCADE
            )
        `);
  });
}

function populateTestData() {
  db.serialize(() => {
    // Clear existing data
    db.run("DELETE FROM crawled_data");
    db.run("DELETE FROM execution_records");
    db.run("DELETE FROM website_records");
    // Insert test data into website_records
    db.run(`
            INSERT INTO website_records (url, boundaryRegExp, periodicity, label, isActive, tags)
            VALUES
            ('https://example.com', '.*', 'daily', 'Example Site', 1, '["news", "example"]'),
            ('https://anotherexample.com', '.*', 'weekly', 'Another Example Site', 1, '["blog", "example"]'),
            ('https://yetanotherexample.com', '.*', 'monthly', 'Yet Another Example Site', 0, '["archive", "example"]')
        `);
    // Insert test data into execution_records
    db.run(`
            INSERT INTO execution_records (websiteRecordId, status, startTime, endTime, crawledCount)
            VALUES
            (1, 'completed', '2024-06-21 10:00:00', '2024-06-21 11:00:00', 100),
            (2, 'failed', '2024-06-20 09:00:00', '2024-06-20 10:00:00', 0),
            (3, 'completed', '2024-06-19 08:00:00', '2024-06-19 09:00:00', 50)
        `);
    // Insert test data into crawled_data
    db.run(`
            INSERT INTO crawled_data (executionId, url, crawlTime, title, outgoingLinks)
            VALUES
            (1, 'https://example.com/page1', '2024-06-21 10:05:00', 'Example Page 1', '["https://example.com/page2", "https://example.com/page3"]'),
            (1, 'https://example.com/page2', '2024-06-21 10:10:00', 'Example Page 2', '["https://example.com/page1", "https://example.com/page3"]'),
            (3, 'https://yetanotherexample.com/page1', '2024-06-19 08:05:00', 'Yet Another Example Page 1', '["https://yetanotherexample.com/page2"]')
        `);
    console.log("Test data created successfully.");
  });
}

function startDatabase() {
  createDatabase();
  populateTestData();
}

// Start the database
startDatabase();
