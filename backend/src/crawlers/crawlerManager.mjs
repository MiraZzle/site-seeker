import { Worker } from "worker_threads";

class CrawlerManager {
	constructor(model) {
		this.model = model;
		this.activeExecutions = new Map();
	}

	scheduleCrawl(websiteRecord) {
		if (this.activeExecutions.has(websiteRecord.id)) {
			const { worker, timeout } = this.activeExecutions.get(websiteRecord.id);
			if (worker) {
				console.log(`Cancelling previous execution for record ${websiteRecord.id}.`);
				worker.terminate();
			}
			if (timeout) {
				clearTimeout(timeout);
			}
		}
		this.crawlWebsiteRecord(websiteRecord);
	}

	isExecutionActive(websiteRecordId) {
        return this.activeExecutions.has(websiteRecordId);
    }

	cancelExecution(websiteRecordId) {
        const activeExecution = this.activeExecutions.get(websiteRecordId);
        if (activeExecution) {
            const { worker, timeout } = activeExecution;
            if (worker) {
                worker.terminate(); // Ukončíme worker
                console.log(`Worker for record ${websiteRecordId} has been terminated.`);
            }
            if (timeout) {
                clearTimeout(timeout); // Zrušíme čekající timeout
                console.log(`Timeout for record ${websiteRecordId} has been cleared.`);
            }
            this.activeExecutions.delete(websiteRecordId); // Odstraníme z mapy
        }
    }

	async crawlWebsiteRecord(websiteRecord) {
		this.model.toggleIsBeingCrawled(websiteRecord.id);
		let execution = {
			websiteRecordId: websiteRecord.id,
			startTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
			endTime: null,
			crawledCount: 0,
			status: "crawling"
		};
		execution = await this.model.addExecution(execution);
		const worker = new Worker("./src/crawlers/crawler.mjs", {
			workerData: { websiteRecord, execution },
		});
		this.activeExecutions.set(websiteRecord.id, { worker, timeout: null });

		worker.on("message", async (message) => {
			if (message.crawledData) {
				execution.crawledCount++;
				await this.model.addCrawledData(message.crawledData);
			} else if (message.status === "completed") {
				await this.model.toggleIsBeingCrawled(websiteRecord.id);
				execution.endTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
				execution.status = "completed";
				await this.model.updateExecution(execution);

				if (websiteRecord.isActive) {
					const timeout = setTimeout(() => {
						this.crawlWebsiteRecord(websiteRecord);
					}, websiteRecord.periodicity * 1000);

					this.activeExecutions.set(websiteRecord.id, { worker: null, timeout });
				} else {
					this.activeExecutions.delete(websiteRecord.id);
				}
				worker.terminate();
			}
		});
		worker.on("error", (error) => {
			console.error(error);
			this.activeExecutions.delete(websiteRecord.id);
			worker.terminate();
		});
		worker.on("exit", (code) => {
			if (code !== 0) {
				console.error(new Error(`Worker stopped with exit code ${code}`));
			}
		});
	}
}

export default CrawlerManager;