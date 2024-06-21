class AdditionController {
	constructor(model) {
		this.model = model;
	}

	async addWebsiteRecord(websiteRecord, crawlerManager) {
		const webisteRecordWithId = await this.model.addWebsiteRecord(websiteRecord);
		crawlerManager.scheduleCrawl(webisteRecordWithId);
	}
}

export default AdditionController;
