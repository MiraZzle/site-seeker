import {
	type GraphData,
	type ApiResponseData,
	type GraphNode,
	type LinkNode,
	type CrawledNode,
	type WebsiteRecord,
} from "$types/visualizationTypes";
import axios from "axios";

export function applyLayout(cy: cytoscape.Core) {
	if (!cy) return;
	cy.layout({
		name: "cose-bilkent",
		// @ts-ignore
		nodeDimensionsIncludeLabels: true,
		idealEdgeLength: 100,
		nodeRepulsion: 1_000_000,
		animate: true,
		randomize: false,
	}).run();
}

export function getDomainViewData(rawData: ApiResponseData): GraphData {
	function extractDomain(url: string): string {
		const domain = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/i);
		return domain ? domain[1] : "";
	}

	const extractedNodes = rawData.data.nodes;
	const domainNodeMap = new Map<string, GraphNode>();
	const domainLinks = new Set<string>();

	extractedNodes.forEach((node: CrawledNode) => {
		const domain = extractDomain(node.url);
		if (!domainNodeMap.has(domain)) {
			domainNodeMap.set(domain, {
				id: domain,
				value: {
					title: domain,
					url: node.url,
					crawlTime: node.crawlTime,
					links: [],
					owner: node.owner,
				},
				classes: "crawled",
			});
		}
	});

	extractedNodes.forEach((node: CrawledNode) => {
		const sourceDomain = extractDomain(node.url);
		node.links.forEach((link: LinkNode) => {
			const targetDomain = extractDomain(link.url);

			const [domain1, domain2] = [sourceDomain, targetDomain].sort();
			const edgeKey = `${domain1}--${domain2}`;

			if (domain1 !== domain2 && !domainLinks.has(edgeKey)) {
				domainLinks.add(edgeKey);
			}

			if (!domainNodeMap.has(targetDomain)) {
				domainNodeMap.set(targetDomain, {
					id: targetDomain,
					value: {
						title: targetDomain,
						url: link.url,
						crawlTime: link.crawlTime,
						links: [],
						owner: {
							identifier: "N/A",
							label: "Uncrawled",
							url: link.url,
						},
					},
					classes: "uncrawled",
				});
			}
		});
	});

	const links = Array.from(domainLinks).map((edge) => {
		const [source, target] = edge.split("--");
		return { source, target };
	});
	const nodes = Array.from(domainNodeMap.values());

	return { nodes, links };
}

export function getWebsiteViewData(rawData: ApiResponseData): GraphData {
	const nodeMap = new Map<string, GraphNode>();
	const extractedNodes = rawData.data.nodes;
	const uniqueLinks = new Set<string>();

	const crawledNodes: GraphNode[] = extractedNodes.map((node: CrawledNode) => ({
		id: node.url,
		value: node,
		classes: "crawled",
	}));

	crawledNodes.forEach((node) => {
		nodeMap.set(node.id, node);
	});

	// Uncrawled nodes (link nodes)
	extractedNodes.forEach((node: CrawledNode) => {
		node.links.forEach((link: LinkNode) => {
			if (!nodeMap.has(link.url)) {
				nodeMap.set(link.url, {
					id: link.url,
					value: link,
					classes: "uncrawled",
				});
			}
		});
	});

	// Process edges and store them in the uniqueLinks set
	extractedNodes.forEach((node: CrawledNode) => {
		node.links.forEach((link: LinkNode) => {
			const [source, target] = [node.url, link.url].sort();
			const edgeKey = `${source}--${target}`; // Create a unique key for the edge

			uniqueLinks.add(edgeKey);
		});
	});

	// Convert the links to edges
	const links = Array.from(uniqueLinks).map((edge) => {
		const [source, target] = edge.split("--");
		return { source, target };
	});
	const nodes = Array.from(nodeMap.values());

	return { nodes, links };
}

export function getCytoscapeNodes(graphData: GraphData): cytoscape.NodeDefinition[] {
	return graphData.nodes.map((node) => {
		return {
			data: {
				id: node.id,
				value: node.value,
				classes: node.classes,
			},
		};
	});
}

export function getCytoscapeEdges(graphData: GraphData): cytoscape.EdgeDefinition[] {
	return graphData.links.map((link) => {
		return {
			data: {
				source: link.source,
				target: link.target,
			},
		};
	});
}

export const cytoscapeStyles: cytoscape.Stylesheet[] = [
	{
		selector: "node",
		style: {
			label: "data(value.url)",
			"font-size": 10,
			width: 25,
			height: 25,
			color: "black",
			"text-valign": "top",
			"text-halign": "center",
		},
	},
	{
		selector: "node[classes='uncrawled']",
		style: {
			backgroundColor: "LightCoral",
		},
	},
	{
		selector: "node[classes='crawled']",
		style: {
			backgroundColor: "CornflowerBlue",
		},
	},
	{
		selector: "edge",
		style: {
			"curve-style": "bezier",
			"target-arrow-shape": "triangle",
			"target-arrow-color": "#000",
			"arrow-scale": 0.5,
			"line-color": "grey",
			width: 1,
			opacity: 0.5,
		},
	},
];

export async function getWebsiteRecordsByNodeId(nodeId: string): Promise<WebsiteRecord[]> {
	try {
		const response = await axios.get(
			`http://localhost:3000/api/websiteRecords/nodes/${nodeId}`
		);
		return response.data;
	} catch (error) {
		console.error("Error fetching website records:", error);
		throw error;
	}
}

export async function getNodesByRecordId(record_id: string): Promise<ApiResponseData> {
	const graphqlQuery = `
	query GetNodesByRecordId($webPageIds: [ID!]) {
		nodes(webPages: $webPageIds) {
			id
			title
			url
			crawlTime
			links {
				title
				url
			}
			owner {
				identifier
				label
				url
			}
		}
    }`;

	const response = await axios
		.post("http://localhost:3000/graphql", {
			query: graphqlQuery,
			variables: { webPageIds: [record_id] },
			headers: {
				"Content-Type": "application/json",
			},
		})
		.catch((error) => {
			console.error("Error fetching data from GraphQL API", error);
		});
	return response?.data;
}
