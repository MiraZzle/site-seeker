import sqlite3 from "sqlite3";
const db = new sqlite3.Database("../db/crawler.db");

function createTestData() {
	db.serialize(() => {
		// Clear existing data
		db.run("DELETE FROM crawled_data");
		db.run("DELETE FROM execution_records");
		db.run("DELETE FROM website_records");

		// Insert test data into website_records
		db.run(`
            INSERT INTO website_records (url, boundaryRegExp, periodicity, label, active, tags)
            VALUES
            ('https://example.com', '.*', 'daily', 'Example Site', 1, '["news", "example"]'),
            ('https://anotherexample.com', '.*', 'weekly', 'Another Example Site', 1, '["blog", "example"]'),
            ('https://yetanotherexample.com', '.*', 'monthly', 'Yet Another Example Site', 0, '["archive", "example"]')
        `);

		// Insert test data into execution_records
		db.run(`
            INSERT INTO execution_records (websiteId, status, start_time, end_time, number_of_sites_crawled)
            VALUES
            (1, 'completed', '2024-06-21 10:00:00', '2024-06-21 11:00:00', 100),
            (2, 'failed', '2024-06-20 09:00:00', '2024-06-20 10:00:00', 0),
            (3, 'completed', '2024-06-19 08:00:00', '2024-06-19 09:00:00', 50)
        `);

		// Insert test data into crawled_data
		db.run(`
            INSERT INTO crawled_data (executionId, url, crawl_time, title, outgoing_links)
            VALUES
            (1, 'https://example.com/page1', '2024-06-21 10:05:00', 'Example Page 1', '["https://example.com/page2", "https://example.com/page3"]'),
            (1, 'https://example.com/page2', '2024-06-21 10:10:00', 'Example Page 2', '["https://example.com/page1", "https://example.com/page3"]'),
            (3, 'https://yetanotherexample.com/page1', '2024-06-19 08:05:00', 'Yet Another Example Page 1', '["https://yetanotherexample.com/page2"]')
        `);

		console.log("Test data created successfully.");
	});
}

// Run the function to create test data
createTestData();
