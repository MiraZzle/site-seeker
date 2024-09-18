<script lang="ts">
  import { onMount } from "svelte";
  import { type ApiResponseData, type GraphData, type GraphNode } from "$types/visualizationTypes";
  import cytoscape from "cytoscape";
  // @ts-ignore
  import coseBilkent from "cytoscape-cose-bilkent";
  import { getDomainViewData, getWebsiteViewData, getCytoscapeEdges, getCytoscapeNodes, applyLayout, cytoscapeStyles } from "$utils/visualizationUtils";

  cytoscape.use(coseBilkent);

  // Props
  export let liveMode: boolean;
  export let domainMode: boolean;
  export let fetchedData: ApiResponseData;
  export let updateNodeDetailsCardCallback: (selectedNode: GraphNode) => void;

  // Constants and variables
  const LIVE_MODE_INTERVAL = 5000;
  let graphContainer: HTMLDivElement;
  let cyInstance: cytoscape.Core;

  function getFormattedData(domainMode: boolean, liveMode: boolean = false): GraphData {
    // TODO: add live mode fetching
    // This is the point where i should also take care of the socket connection
    return domainMode ? getDomainViewData(fetchedData) : getWebsiteViewData(fetchedData);
  }

  // Lifecycle
  onMount(() => {
    // live mode will NEVER be enabled in the first render, so we can safely call the getData function
    const extractedData: GraphData = getFormattedData(domainMode, liveMode);
    createGraph(extractedData)
  });

  $: {
    liveMode ? console.log("Live mode enabled") : console.log("Static mode disabled");
    const extractedData: GraphData = getFormattedData(domainMode, liveMode);
    showGraph(extractedData);
  }
  
  ////////////////////////////////////////////////// GRAPH CONTROL METHODS
  function showGraph(graphData: GraphData) {
    if (!cyInstance) return;
    cyInstance.elements().remove(); // reset the graph
    const newNodes = getCytoscapeNodes(graphData);
    const newEdges = getCytoscapeEdges(graphData);
    cyInstance.add([...newNodes, ...newEdges]);
    applyLayout(cyInstance);
  }

  function createGraph(graphData: GraphData) {
    const nodes = getCytoscapeNodes(graphData);
    const edges = getCytoscapeEdges(graphData);

    cyInstance = cytoscape({
      container: graphContainer,
      elements: [...nodes, ...edges],
      style: cytoscapeStyles,
      minZoom: 0.5,
      maxZoom: 4,
      zoomingEnabled: true,
      userZoomingEnabled: true,
      wheelSensitivity: 0.1,
    });
    applyLayout(cyInstance);

    // Event listeners
    cyInstance.on("dbltap", "node", (event) => {
      const selectedNode = event.target;
      const selectedNodeData = selectedNode.data();
      updateNodeDetailsCardCallback(selectedNodeData);
    });
  }
</script>

<div class="graph-container" id="visualization__graph-container" bind:this={graphContainer}>
  {#if cyInstance}
    <slot></slot>
  {/if}
</div>

<style lang="scss">
  .graph-container {
    width: 950px;
    height: 750px;
  }
</style>
