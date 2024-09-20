class DeletionController {
    constructor(model) {
        this.model = model;
    }

    async deleteWebsiteRecord(id, crawlerManager) {
		console.log(`MA AKTIVNI EXECUTION? - ${crawlerManager.isExecutionActive(id)}`)
        if (crawlerManager.isExecutionActive(id)) {
            crawlerManager.cancelExecution(id);
        }

        const result = await this.model.deleteWebsiteRecord(id);

        if (result) {
            console.log(`Website record with id ${id} and its related data have been deleted.`);
        } else {
            console.error(`Failed to delete website record with id ${id}.`);
        }

        return result;
    }
}

export default DeletionController;
