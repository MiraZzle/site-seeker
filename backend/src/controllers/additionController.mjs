class AdditionController {
	constructor(model) {
		this.model = model;
	}

	addWebsiteRecord(websiteRecord, crawlerManager) {
		this.model.addWebsiteRecord(websiteRecord);
		crawlerManager.enqueue(websiteRecord);
	}
}

export default AdditionController;
