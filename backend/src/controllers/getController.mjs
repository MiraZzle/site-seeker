class GetController {
  constructor(model) {
    this.model = model;
  }

  async getAllWebsiteRecords() {
    return await this.model.getAllWebsiteRecords();
  }

  async getWebsiteRecordById(id) {
    return await this.model.getWebsiteRecordById(id);
  }

  async getWebsiteRecordByNodeId(nodeId) {
    return await this.model.getWebsiteRecordByNodeId(nodeId);
  }
}

export default GetController;
