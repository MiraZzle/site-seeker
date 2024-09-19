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
  const LIVE_MODE_INTERVAL = 1000;
  let graphContainer: HTMLDivElement;
  let cyInstance: cytoscape.Core;
  let intervalId: number;

  function getFormattedData(domainMode: boolean): GraphData {
    return domainMode ? getDomainViewData(fetchedData) : getWebsiteViewData(fetchedData);
  }

  // Lifecycle
  onMount(() => {
    // live mode will NEVER be enabled in the first render, so we can safely call the getData function
    const extractedData: GraphData = getFormattedData(domainMode);
    createGraph(extractedData)
  });

  function startLiveMode(domainModeValue: boolean) {
    intervalId = setInterval(() => {
      const extractedData: GraphData = getFormattedData(domainModeValue);
      showGraph(extractedData);
    }, LIVE_MODE_INTERVAL);
    return () => clearInterval(intervalId);
  }

  function startStaticMode(domainModeValue: boolean) {
    if (intervalId) clearInterval(intervalId);
    const extractedData: GraphData = getFormattedData(domainModeValue);
    showGraph(extractedData);
  }

  $: {
    if (liveMode) {
      startLiveMode(domainMode);
    } else {
      startStaticMode(domainMode);
    }
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
