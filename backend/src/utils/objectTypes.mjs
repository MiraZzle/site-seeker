const websiteRecord = {
	id: null,
	url: null,
	boundaryRegExp: null,
	periodicity: null,
	label: null,
	isActive: null,
	tags: [],
};

const execution = {
	id: null,
	websiteRecordId: null,
	status: null,
	startTime: null,
	endTime: null,
	crawledCount: null,
};

const crawledData = {
	id: null,
	executionId: null,
	url: null,
	crawlTime: null,
	title: null,
	outgoingLinks: [],
};
