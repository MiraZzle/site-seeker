class StartController {
  constructor(model) {
    this.model = model;
  }

  async startWebsiteRecordExecution(id, crawlerManager) {
    const webisteRecordWithId = await this.model.getWebsiteRecordById(id);
    crawlerManager.scheduleCrawl(webisteRecordWithId);
  }
}

export default StartController;
