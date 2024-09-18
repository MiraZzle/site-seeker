/// API TYPES
// API: the raw data from the api
export type ApiResponseData = {
	data: {
		nodes: CrawledNode[];
	};
};

// API:
export type CrawledNode = {
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
