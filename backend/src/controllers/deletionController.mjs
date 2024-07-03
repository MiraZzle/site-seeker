class DeletionController {
	constructor(model) {
		this.model = model;
	}

	async deleteWebsiteRecord(id) {
		await this.model.deleteWebsiteRecord(id);
	}
}

export default DeletionController;
