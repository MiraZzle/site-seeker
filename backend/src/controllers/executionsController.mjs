class ExecutionsController {
	constructor(model) {
		this.model = model;
	}

	async getAllExecutions() {
        return await this.model.getAllExecutions();
	}

    async getExecutionsForWebsiteRecord(id) {
        return await this.model.getExecutionsForWebsiteRecord(id)
    }
}

export default ExecutionsController;