class Model {
	static parseRows(rows) {
		return rows.map((row) => ({
			id: row.id,
			url: row.url,
			boundaryRegExp: row.boundaryRegExp,
			periodicity: row.periodicity,
			label: row.label,
			active: row.active,
			tags: JSON.parse(row.tags),
		}));
	}

	constructor(db) {
		this.db = db;
		this.db.serialize(() => {
			// Create the tables if they do not exist
			this.db.run(`
                CREATE TABLE IF NOT EXISTS website_records (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    url TEXT,
                    boundaryRegExp TEXT,
                    periodicity TEXT,
                    label TEXT,
                    active BOOLEAN,
                    tags TEXT
                )
            `);
			this.db.run(`
                CREATE TABLE IF NOT EXISTS execution_records (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    websiteId INTEGER,
                    status TEXT,
                    start_time DATETIME,
                    end_time DATETIME,
                    number_of_sites_crawled INTEGER,
                    FOREIGN KEY (websiteId) REFERENCES website_records(id) ON DELETE CASCADE
                )
            `);

			this.db.run(`
                CREATE TABLE IF NOT EXISTS crawled_data (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    executionId INTEGER,
                    url TEXT,
                    crawl_time DATETIME,
                    title TEXT,
                    outgoing_links TEXT,
                    FOREIGN KEY (executionId) REFERENCES execution_records(id) ON DELETE CASCADE
                )
            `);
		});
	}

	async getAllWebsiteRecords() {
		try {
			let rows = await new Promise((resolve, reject) => {
				this.db.all("SELECT * FROM website_records", (err, rows) => {
					if (err) {
						reject(err);
					} else {
						resolve(rows);
					}
				});
			});
			const result = Model.parseRows(rows);
			return result;
		} catch (err) {
			console.error(err);
			return [];
		}
	}

	async getWebsiteRecordById(id) {
		try {
			let row = await new Promise((resolve, reject) => {
				this.db.get("SELECT * FROM website_records WHERE id = ?", [id], (err, row) => {
					if (err) {
						reject(err);
					} else {
						resolve(row);
					}
				});
			});
			const result = Model.parseRows([row]);
			return result[0];
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	deleteWebsiteRecord(id) {
		this.db.serialize(() => {
			const stmt = this.db.prepare("DELETE FROM website_records WHERE id = ?");
			stmt.run(id);
			stmt.finalize();
		});
	}

	addWebsiteRecord(url, boundaryRegExp, periodicity, label, active, tags) {
		this.db.serialize(() => {
			const stmt = this.db.prepare(`
                INSERT INTO website_records (url, boundaryRegExp, periodicity, label, active, tags)
                VALUES (?, ?, ?, ?, ?, ?)
            `);
			stmt.run(url, boundaryRegExp, periodicity, label, active, JSON.stringify(tags));
			stmt.finalize();
		});
	}

	addExecution(websiteId, status, startTime, endTime, numberOfSitesCrawled) {
		this.db.serialize(() => {
			const stmt = this.db.prepare(`
                INSERT INTO execution_records (websiteId, status, start_time, end_time, number_of_sites_crawled)
                VALUES (?, ?, ?, ?, ?)
            `);
			stmt.run(websiteId, status, startTime, endTime, numberOfSitesCrawled);
			stmt.finalize();
		});
	}

	addCrawledData(executionId, url, crawlTime, title, outgoingLinks) {
		this.db.serialize(() => {
			const stmt = this.db.prepare(`
                INSERT INTO crawled_data (executionId, url, crawl_time, title, outgoing_links)
                VALUES (?, ?, ?, ?, ?)
            `);
			stmt.run(executionId, url, crawlTime, title, JSON.stringify(outgoingLinks));
			stmt.finalize();
		});
	}
}

export default Model;
