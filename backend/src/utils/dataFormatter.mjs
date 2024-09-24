class DataFormatter {
  static getRecordFromJson(jsonWebsiteRecord) {
    return {
      id: jsonWebsiteRecord.id,
      url: jsonWebsiteRecord.url,
      boundaryRegExp: jsonWebsiteRecord.boundaryRegExp,
      periodicity: jsonWebsiteRecord.periodicity,
      label: jsonWebsiteRecord.label,
      isActive: jsonWebsiteRecord.isActive,
      tags: jsonWebsiteRecord.tags,
    };
  }
}

export default DataFormatter;
