import {
	type GraphData,
	type ApiResponseData,
	type GraphNode,
	type LinkNode,
	type CrawledNode,
} from "$types/visualizationTypes";

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
	const domainLinks = new Set<{ source: string; target: string }>();

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
			if (sourceDomain !== targetDomain) {
				domainLinks.add({ source: sourceDomain, target: targetDomain });
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

	const allNodes = Array.from(domainNodeMap.values());
	const links = Array.from(domainLinks);
	return { nodes: allNodes, links };
}

export function getWebsiteViewData(rawData: ApiResponseData): GraphData {
	const nodeMap = new Map<string, GraphNode>();
	const extractedNodes = rawData.data.nodes;

	const crawledNodes: GraphNode[] = extractedNodes.map((node: CrawledNode) => ({
		id: node.url,
		value: node,
		classes: "crawled",
	}));

	crawledNodes.forEach((node) => {
		nodeMap.set(node.id, node);
	});

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

	const allNodes = Array.from(nodeMap.values());

	const links = extractedNodes.flatMap((node: CrawledNode) =>
		node.links.map((link: LinkNode) => ({
			source: node.url,
			target: link.url,
		}))
	);

	return { nodes: allNodes, links };
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
			"font-size": 5,
			width: 20,
			height: 20,
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
			"line-color": "#000",
			width: 1,
			opacity: 0.5,
		},
	},
];
