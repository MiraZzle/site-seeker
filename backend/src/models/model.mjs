import { normalizeUrl } from '../utils/normalizeUrl.mjs'

class Model {
	static parseRows(rows) {
		return rows.map((row) => ({
			id: row.id,
			url: row.url,
			boundaryRegExp: row.boundaryRegExp,
			periodicity: row.periodicity,
			label: row.label,
			isActive: row.isActive,
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

	/* async getAllWebsiteRecords() {
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
	} */
	async getAllWebsiteRecords() {
		const query = `
			SELECT wr.*, er.id as executionId, er.startTime as executionStartTime, er.endTime as executionEndTime, er.status as executionStatus
			FROM website_records wr
			LEFT JOIN execution_records er
			ON wr.id = er.websiteRecordId
			AND er.startTime = (
				SELECT MAX(startTime)
				FROM execution_records
				WHERE websiteRecordId = wr.id
			)
		`;
		try {
			const rows = await new Promise((resolve, reject) => {
				this.db.all(query, (err, rows) => {
					if (err) {
						reject(err);
					} else {
						resolve(rows);
					}
				});
			});
	
			return rows.map((row) => ({
				id: row.id,
				url: row.url,
				boundaryRegExp: row.boundaryRegExp,
				periodicity: row.periodicity,
				label: row.label,
				isActive: row.isActive,
				tags: JSON.parse(row.tags),
				isBeingCrawled: row.isBeingCrawled,
				latestExecution: row.executionId ? {
					id: row.executionId,
					startTime: row.executionStartTime,
					endTime: row.executionEndTime,
					status: row.executionStatus
				} : null
			}));
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

	async deleteWebsiteRecord(id) {
		try {
			await new Promise((resolve, reject) => {
				this.db.run("DELETE FROM website_records WHERE id = ?", [id], (err) => {
					if (err) {
						reject(err);
					} else {
						resolve();
					}
				});
			});
			return true;
		} catch (err) {
			console.error(err);
			return false;
		}
	}

	async updateWebsiteRecord(id, { url, boundaryRegExp, periodicity, label, isActive, tags }) {
		try {
			await new Promise((resolve, reject) => {
				this.db.run(
					`
					UPDATE website_records
					SET url = ?, boundaryRegExp = ?, periodicity = ?, label = ?, isActive = ?, tags = ?
					WHERE id = ?
				`,
					[url, boundaryRegExp, periodicity, label, isActive, JSON.stringify(tags), id],
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

	async addExecution({ websiteRecordId, startTime, endTime, crawledCount, status }) {
		const lastID = await new Promise((resolve, reject) => {
			this.db.serialize(() => {
				const stmt = this.db.prepare(`
					INSERT INTO execution_records (websiteRecordId, startTime, endTime, crawledCount, status)
					VALUES (?, ?, ?, ?, ?)
				`);
				stmt.run(websiteRecordId, startTime, endTime, crawledCount, status, function (err) {
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
			status
		};
	}
	async updateExecution({ id, endTime, crawledCount, status }) {
		try {
			await new Promise((resolve, reject) => {
				this.db.serialize(() => {
					const stmt = this.db.prepare(`
				UPDATE execution_records
				SET endTime = ?, crawledCount = ?, status = ?
				WHERE id = ?
			  `);
					stmt.run(endTime, crawledCount, status, id, function (err) {
						if (err) {
							reject(err);
						} else {
							resolve();
						}
					});
					stmt.finalize();
				});
			});
			return {
				id,
				endTime,
				crawledCount,
				status
			};
		} catch (err) {
			console.error(err);
			return null;
		}
	}
	async getLatestExecution(websiteRecordId) {
		try {
			const execution = await new Promise((resolve, reject) => {
				this.db.get(
					`
					SELECT * FROM execution_records
					WHERE websiteRecordId = ?
					ORDER BY startTime DESC
					LIMIT 1
					`,
					[websiteRecordId],
					(err, row) => {
						if (err) {
							reject(err);
						} else {
							resolve(row);
						}
					}
				);
			});
	
			return execution ? {
				id: execution.id,
				websiteRecordId: execution.websiteRecordId,
				startTime: execution.startTime,
				endTime: execution.endTime,
				crawledCount: execution.crawledCount,
				status: execution.status,
			} : null;
		} catch (err) {
			console.error(err);
			return null;
		}
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

	async getNodesByWebPageIds(webPageIds) {
		try {
			const nodes = await new Promise((resolve, reject) => {
				const placeholders = webPageIds.map(() => '?').join(',');
				const query = `
			  SELECT cd.*, wr.id as ownerId, wr.label as ownerLabel, wr.url as ownerUrl, wr.boundaryRegExp as ownerRegExp,
					 wr.tags as ownerTags, wr.isActive as ownerActive
			  FROM crawled_data cd
			  INNER JOIN execution_records er ON cd.executionId = er.id
			  INNER JOIN website_records wr ON er.websiteRecordId = wr.id
			  WHERE wr.id IN (${placeholders})
			`;
				this.db.all(query, webPageIds, (err, rows) => {
					if (err) {
						reject(err);
					} else {
						resolve(rows);
					}
				});
			});

			const uniqueLinks = new Set();
			const nodesWithLinks = await Promise.all(nodes.map(async node => {
				const outgoingLinks = JSON.parse(node.outgoingLinks).map(link => normalizeUrl(link.url));
				outgoingLinks.forEach(link => uniqueLinks.add(link));

				if (uniqueLinks.size === 0) {
					return {
						title: node.title,
						url: node.url,
						crawlTime: node.crawlTime,
						links: [],
						owner: {
							identifier: node.ownerId,
							label: node.ownerLabel,
							url: node.ownerUrl,
							regexp: node.ownerRegExp,
							tags: JSON.parse(node.ownerTags),
							active: node.ownerActive
						}
					};
				}

				const uniqueLinksArray = Array.from(uniqueLinks);
				const placeholders = uniqueLinksArray.map(() => '?').join(',');
				const links = await new Promise((resolve, reject) => {
					const query = `
				SELECT cd.*
				FROM crawled_data cd
				INNER JOIN (
				  SELECT url, MAX(crawlTime) AS maxCrawlTime
				  FROM crawled_data
				  WHERE url IN (${placeholders})
				  GROUP BY url
				) grouped_cd
				ON cd.url = grouped_cd.url AND cd.crawlTime = grouped_cd.maxCrawlTime
			  `;
					this.db.all(query, uniqueLinksArray, (err, linkRows) => {
						if (err) {
							reject(err);
						} else {
							resolve(linkRows);
						}
					});
				});

				return {
					title: node.title,
					url: node.url,
					crawlTime: node.crawlTime,
					links: links.map(link => ({
						title: link.title,
						url: link.url,
						crawlTime: link.crawlTime,
						links: [],
						owner: {
							identifier: node.ownerId,
							label: node.ownerLabel,
							url: node.ownerUrl,
							regexp: node.ownerRegExp,
							tags: JSON.parse(node.ownerTags),
							active: node.ownerActive
						}
					})),
					owner: {
						identifier: node.ownerId,
						label: node.ownerLabel,
						url: node.ownerUrl,
						regexp: node.ownerRegExp,
						tags: JSON.parse(node.ownerTags),
						active: node.ownerActive
					}
				};
			}));

			// Remove duplicate nodes by URL
			const uniqueNodes = [];
			const seenUrls = new Set();
			for (const node of nodesWithLinks) {
				if (!seenUrls.has(node.url)) {
					uniqueNodes.push(node);
					seenUrls.add(node.url);
				}
			}

			return uniqueNodes;
		} catch (err) {
			console.error(err);
			return [];
		}
	}
}

export default Model;
