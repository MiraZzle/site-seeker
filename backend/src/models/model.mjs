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
			isBeingCrawled: row.isBeingCrawled,
		}));
	}

	constructor(db) {
		this.db = db;
		this.db.serialize(() => {
			this.db.run(`
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
			this.db.run(`
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

			this.db.run(`
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

	async addWebsiteRecord({
		url,
		boundaryRegExp,
		periodicity,
		label,
		isActive,
		tags,
		isBeingCrawled,
	}) {
		const lastID = await new Promise((resolve, reject) => {
			this.db.serialize(() => {
				const stmt = this.db.prepare(`
                    INSERT INTO website_records (url, boundaryRegExp, periodicity, label, isActive, tags, isBeingCrawled)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `);
				stmt.run(
					url,
					boundaryRegExp,
					periodicity,
					label,
					isActive,
					JSON.stringify(tags),
					isBeingCrawled,
					function (err) {
						if (err) {
							reject(err);
						} else {
							resolve(this.lastID);
						}
					}
				);
				stmt.finalize();
			});
		});
		return {
			id: lastID,
			url,
			boundaryRegExp,
			periodicity,
			label,
			isActive,
			tags,
			isBeingCrawled,
		};
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

	async toggleIsBeingCrawled(id) {
		try {
			await new Promise((resolve, reject) => {
				this.db.run(
					"UPDATE website_records SET isBeingCrawled = NOT isBeingCrawled WHERE id = ?",
					[id],
					(err) => {
						if (err) {
							reject(err);
						} else {
							resolve();
						}
					}
				);
			});
			return true;
		} catch (err) {
			console.error(err);
			return false;
		}
	}

	deleteWebsiteRecord(id) {
		this.db.serialize(() => {
			const stmt = this.db.prepare("DELETE FROM website_records WHERE id = ?");
			stmt.run(id);
			stmt.finalize();
		});
	}

	async addExecution({ websiteRecordId, startTime, endTime, crawledCount }) {
		const lastID = await new Promise((resolve, reject) => {
			this.db.serialize(() => {
				const stmt = this.db.prepare(`
					INSERT INTO execution_records (websiteRecordId, startTime, endTime, crawledCount)
					VALUES (?, ?, ?, ?)
				`);
				stmt.run(websiteRecordId, startTime, endTime, crawledCount, (err) => {
					if (err) {
						reject(err);
					} else {
						resolve(this.lastID);
					}
				});
				stmt.finalize();
			});
		});
		return {
			id: lastID,
			websiteRecordId,
			startTime,
			endTime,
			crawledCount,
		};
	}

	addCrawledData({ executionId, url, crawlTime, title, outgoingLinks }) {
		this.db.serialize(() => {
			const stmt = this.db.prepare(`
                INSERT INTO crawled_data (executionId, url, crawlTime, title, outgoingLinks)
                VALUES (?, ?, ?, ?, ?)
            `);
			stmt.run(executionId, url, crawlTime, title, JSON.stringify(outgoingLinks));
			stmt.finalize();
		});
	}
}

export default Model;
