class CrawlerManager {
	constructor() {
		this.readyToCrawlQueue = [];
		this.waitingQueue = [];
	}

	enqueue(websiteRecord) {
		this.readyToCrawlQueue.push(websiteRecord);
	}
}

export default CrawlerManager;
