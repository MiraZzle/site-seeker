import { normalizeUrl } from "../utils/normalizeUrl.mjs";

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
        latestExecution: row.executionId
          ? {
              id: row.executionId,
              startTime: row.executionStartTime,
              endTime: row.executionEndTime,
              status: row.executionStatus,
            }
          : null,
      }));
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async getWebsiteRecordById(id) {
    const query = `
			SELECT * FROM website_records
			WHERE id = ?
		`;

    try {
      const row = await new Promise((resolve, reject) => {
        this.db.get(query, [id], (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      });

      if (!row) {
        throw new Error(`Website record with id ${id} not found`);
      }

      return {
        id: row.id,
        url: row.url,
        boundaryRegExp: row.boundaryRegExp,
        periodicity: row.periodicity,
        label: row.label,
        isActive: row.isActive,
        tags: JSON.parse(row.tags),
        isBeingCrawled: row.isBeingCrawled,
      };
    } catch (err) {
      console.error(err);
      return null;
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
      // Begin a transaction to ensure atomicity
      await new Promise((resolve, reject) => {
        this.db.run("BEGIN TRANSACTION", (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      });

      // Delete all related crawled_data based on execution records linked to this websiteRecord
      await new Promise((resolve, reject) => {
        this.db.run(
          `
					DELETE FROM crawled_data 
					WHERE executionId IN (
						SELECT id FROM execution_records WHERE websiteRecordId = ?
					)`,
          [id],
          (err) => {
            if (err) {
              return this.db.run("ROLLBACK", () => reject(err)); // Rollback on error
            }
            resolve();
          }
        );
      });

      // Delete all related execution records
      await new Promise((resolve, reject) => {
        this.db.run(
          "DELETE FROM execution_records WHERE websiteRecordId = ?",
          [id],
          (err) => {
            if (err) {
              return this.db.run("ROLLBACK", () => reject(err)); // Rollback on error
            }
            resolve();
          }
        );
      });

      // Delete the website record itself
      await new Promise((resolve, reject) => {
        this.db.run("DELETE FROM website_records WHERE id = ?", [id], (err) => {
          if (err) {
            return this.db.run("ROLLBACK", () => reject(err)); // Rollback on error
          }
          resolve();
        });
      });

      // Commit transaction
      await new Promise((resolve, reject) => {
        this.db.run("COMMIT", (err) => {
          if (err) {
            return this.db.run("ROLLBACK", () => reject(err)); // Rollback on error
          }
          resolve();
        });
      });

      return true; // Success
    } catch (err) {
      console.error("Error deleting website record and related data:", err);
      return false; // Failure
    }
  }

  async updateWebsiteRecord(
    id,
    { url, boundaryRegExp, periodicity, label, isActive, tags }
  ) {
    try {
      await new Promise((resolve, reject) => {
        this.db.run(
          `
					UPDATE website_records
					SET url = ?, boundaryRegExp = ?, periodicity = ?, label = ?, isActive = ?, tags = ?
					WHERE id = ?
				`,
          [
            url,
            boundaryRegExp,
            periodicity,
            label,
            isActive,
            JSON.stringify(tags),
            id,
          ],
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

  async addExecution({
    websiteRecordId,
    startTime,
    endTime,
    crawledCount,
    status,
  }) {
    const lastID = await new Promise((resolve, reject) => {
      this.db.serialize(() => {
        const stmt = this.db.prepare(`
					INSERT INTO execution_records (websiteRecordId, startTime, endTime, crawledCount, status)
					VALUES (?, ?, ?, ?, ?)
				`);
        stmt.run(
          websiteRecordId,
          startTime,
          endTime,
          crawledCount,
          status,
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
      websiteRecordId,
      startTime,
      endTime,
      crawledCount,
      status,
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
        status,
      };
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
      stmt.run(
        executionId,
        url,
        crawlTime,
        title,
        JSON.stringify(outgoingLinks)
      );
      stmt.finalize();
    });
  }

  async getNodesByWebPageIds(webPageIds) {
    try {
      const nodes = await new Promise((resolve, reject) => {
        const placeholders = webPageIds.map(() => "?").join(",");
        const query = `
        SELECT cd.*, wr.id as ownerId, wr.label as ownerLabel, wr.url
        ownerUrl, wr.boundaryRegExp as ownerRegExp,
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
      const nodesWithLinks = await Promise.all(
        nodes.map(async (node) => {
          const outgoingLinks = JSON.parse(node.outgoingLinks).map((link) =>
            normalizeUrl(link.url)
          );
          outgoingLinks.forEach((link) => uniqueLinks.add(link));

          if (uniqueLinks.size === 0) {
            return {
              id: node.id,
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
                active: node.ownerActive,
              },
            };
          }

          const uniqueLinksArray = Array.from(uniqueLinks);
          const placeholders = uniqueLinksArray.map(() => "?").join(",");
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
            id: node.id,
            title: node.title,
            url: node.url,
            crawlTime: node.crawlTime,
            links: links.map((link) => ({
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
                active: node.ownerActive,
              },
            })),
            owner: {
              identifier: node.ownerId,
              label: node.ownerLabel,
              url: node.ownerUrl,
              regexp: node.ownerRegExp,
              tags: JSON.parse(node.ownerTags),
              active: node.ownerActive,
            },
          };
        })
      );

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

  async getAllExecutions() {
    const query = `
            SELECT er.*, wr.label AS websiteLabel
            FROM execution_records er
            JOIN website_records wr ON er.websiteRecordId = wr.id
            ORDER BY er.startTime DESC
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
        websiteLabel: row.websiteLabel,
        status: row.status,
        startTime: row.startTime,
        endTime: row.endTime,
        crawledSites: row.crawledCount,
        websiteRecordId: row.websiteRecordId,
      }));
    } catch (err) {
      console.error("Error fetching executions:", err);
      return [];
    }
  }

  async getExecutionsForWebsiteRecord(websiteRecordId) {
    const query = `
			SELECT er.*, wr.label AS websiteLabel
			FROM execution_records er
			JOIN website_records wr ON er.websiteRecordId = wr.id
			WHERE wr.id = ?
			ORDER BY er.startTime DESC
		`;

    try {
      const rows = await new Promise((resolve, reject) => {
        this.db.all(query, [websiteRecordId], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });

      return rows.map((row) => ({
        id: row.id,
        websiteLabel: row.websiteLabel,
        status: row.status,
        startTime: row.startTime,
        endTime: row.endTime,
        crawledSites: row.crawledCount,
        websiteRecordId: row.websiteRecordId,
      }));
    } catch (err) {
      console.error("Error fetching executions for record ID:", err);
      return [];
    }
  }

  async getWebsiteRecordByNodeId(nodeId) {
    return new Promise((resolve, reject) => {
      // Step 1: Get the URL associated with the nodeId
      const getUrlQuery = `
			SELECT cd.url
			FROM crawled_data cd
			WHERE cd.id = ?
			`;

      this.db.get(getUrlQuery, [nodeId], (err, row) => {
        if (err) {
          reject("Error retrieving URL from crawled_data table: " + err);
          return;
        }

        if (!row) {
          reject("No URL found for the provided nodeId.");
          return;
        }

        const nodeUrl = row.url;

        // Step 2: Get all executionIds associated with the URL
        const getExecutionIdsQuery = `
					SELECT cd.executionId
					FROM crawled_data cd
					WHERE cd.url = ?
					`;

        this.db.all(getExecutionIdsQuery, [nodeUrl], (err, rows) => {
          if (err) {
            reject(
              "Error retrieving execution IDs from crawled_data table: " + err
            );
            return;
          }

          if (!rows || rows.length === 0) {
            reject("No execution IDs found for the provided URL.");
            return;
          }

          // Extract all execution IDs
          const executionIds = rows.map((row) => row.executionId);

          if (executionIds.length === 0) {
            reject("No execution IDs found for the provided URL.");
            return;
          }

          // Step 3: Use the executionIds to get the corresponding website records
          const placeholders = executionIds.map(() => "?").join(",");
          const websiteQuery = `
				SELECT wr.*
				FROM execution_records er
				JOIN website_records wr ON er.websiteRecordId = wr.id
				WHERE er.id IN (${placeholders})
				`;

          this.db.all(websiteQuery, executionIds, (err, websiteRows) => {
            if (err) {
              reject("Error retrieving website records: " + err);
              return;
            }

            if (!websiteRows || websiteRows.length === 0) {
              reject(
                "No website records found for the provided execution IDs."
              );
              return;
            }

            resolve(websiteRows); // Return all matching website records
          });
        });
      });
    });
  }
}

export default Model;
