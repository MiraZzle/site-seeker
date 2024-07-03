import { Worker } from "worker_threads";

class CrawlerManager {
	constructor(model) {
		this.model = model;
	}

	scheduleCrawl(websiteRecord) {
		this.crawlWebsiteRecord(websiteRecord);
	}
	
	async crawlWebsiteRecord(websiteRecord) {
		this.model.toggleIsBeingCrawled(websiteRecord.id);
		//TODO: Remove the status column from execution
		let execution = {
			websiteRecordId: websiteRecord.id,
			startTime: new Date(),
			endTime: null,
			crawledCount: 0,
		};
		execution = await this.model.addExecution(execution);
		const worker = new Worker("./src/crawlers/crawler.mjs", {
			workerData: { websiteRecord, execution },
		});
		worker.on("message", (message) => {
			if (message.crawledData) {
				execution.crawledCount++;
				this.model.addCrawledData(message.crawledData);
			} else if (message.status === "completed") {
				this.model.toggleIsBeingCrawled(websiteRecord.id);
				execution.endTime = new Date();
				//TODO: add update execution method to model class
				// this.model.addExecutionRecord(executionWithId);
				if (websiteRecord.isActive) {
					setTimeout(() => {
						this.crawlWebsiteRecord(websiteRecord);
					}, websiteRecord.periodicity * 1000);
				}
				worker.terminate();
			}
		});
		worker.on("error", (error) => {
			console.error(error);
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