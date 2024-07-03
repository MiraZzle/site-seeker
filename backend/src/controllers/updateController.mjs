class UpdateController {
	constructor(model) {
		this.model = model;
	}

	async updateWebsiteRecord(websiteRecordId, updatedRecord) {
		await this.model.updateWebsiteRecord(websiteRecordId, updatedRecord);
	}
}

export default UpdateController;
