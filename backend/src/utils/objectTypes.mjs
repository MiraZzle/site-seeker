const websiteRecord = {
  id: null, //! this is the primary key
  url: null,
  boundaryRegExp: null,
  periodicity: null,
  label: null,
  isActive: null,
  tags: [],
  isBeingCrawled: null,
};

const execution = {
  id: null, //! this is the primary key
  websiteRecordId: null,
  status: null,
  startTime: null,
  endTime: null,
  crawledCount: null,
};

const crawledData = {
  id: null, //! this is the primary key
  executionId: null,
  url: null,
  crawlTime: null,
  title: null,
  outgoingLinks: [],
};
