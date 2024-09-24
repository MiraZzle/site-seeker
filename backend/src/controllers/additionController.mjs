class AdditionController {
  constructor(model) {
    this.model = model;
  }

  async addWebsiteRecord(websiteRecord, crawlerManager) {
    // Backend validace
    const validationErrors = this.validateWebsiteRecord(websiteRecord);
    if (validationErrors.length > 0) {
      throw new Error(`Validation error: ${validationErrors.join(", ")}`);
    }

    const websiteRecordWithId =
      await this.model.addWebsiteRecord(websiteRecord);
    crawlerManager.scheduleCrawl(websiteRecordWithId);
    return websiteRecordWithId.id;
  }

  validateWebsiteRecord(record) {
    const errors = [];

    // URL validace
    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/;
    if (!record.url || !urlPattern.test(record.url)) {
      errors.push("Invalid URL format.");
    }

    // Boundary RegExp validace
    try {
      new RegExp(record.boundaryRegExp);
    } catch (e) {
      errors.push("Invalid Regular Expression format.");
    }

    // Periodicity validace
    if (isNaN(record.periodicity) || record.periodicity <= 0) {
      errors.push("Periodicity must be a number greater than 0.");
    }

    // Label validace
    if (!record.label || record.label.trim().length === 0) {
      errors.push("Label cannot be empty.");
    }

    // Tags validace
    if (
      !Array.isArray(record.tags) ||
      record.tags.some((tag) => /[^a-zA-Z0-9 ]/.test(tag))
    ) {
      errors.push("Tags can only contain alphanumeric characters and spaces.");
    }

    return errors;
  }
}

export default AdditionController;
