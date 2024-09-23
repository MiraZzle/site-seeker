class UpdateController {
  constructor(model) {
    this.model = model;
  }

  async updateWebsiteRecord(websiteRecordId, updatedRecord) {
    // Backend validace
    const validationErrors = this.validateWebsiteRecord(updatedRecord);
    if (validationErrors.length > 0) {
      throw new Error(`Validation error: ${validationErrors.join(", ")}`);
    }

    await this.model.updateWebsiteRecord(websiteRecordId, updatedRecord);
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

export default UpdateController;
