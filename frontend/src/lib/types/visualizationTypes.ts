/// API TYPES
// API: the raw data from the api
export type ApiResponseData = {
	data: {
		nodes: CrawledNode[];
	};
};

// API:
export type CrawledNode = {
	id: string;
	title: string;
	url: string;
	crawlTime: string;
	links: LinkNode[];
	owner: Owner;
};

// API: link node from the api (not a crawled node)
export type LinkNode = {
	title: string;
	url: string;
	crawlTime: string;
};

// API: website record from the api
export type Owner = {
	identifier: string;
	label: string;
	url: string;
};

// API: website record from the api
export type WebsiteRecord = {
	id: number,
	url: string,
	boundaryRegExp: string,
	periodicity: number,
	label: string,
	isActive: boolean,
	tags: string[],
	isBeingCrawled: boolean,
};

/// GRAPH TYPES
// GRAPH: a node in the graph which holds all the information
export type GraphNode = {
	id: string;
	value: CrawledNode | LinkNode;
	classes: string;
};

// GRAPH: the data structure for the graph
export type GraphData = {
	nodes: GraphNode[];
	links: { source: string; target: string }[];
};
