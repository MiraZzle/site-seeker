<script lang="ts">
  import { onDestroy, onMount, tick } from "svelte";
  import { type ApiResponseData, type ApiResponseDataWrapper, type GraphData, type GraphNode } from "$types/visualizationTypes";
  import cytoscape from "cytoscape";
  // @ts-ignore
  import coseBilkent from "cytoscape-cose-bilkent";
  import { getDomainViewData, getWebsiteViewData, getCytoscapeEdges, getCytoscapeNodes, applyLayout, cytoscapeStyles, getNodesByRecordId } from "$utils/visualizationUtils";

  cytoscape.use(coseBilkent);

  // Props
  export let liveMode: boolean = false;
  export let domainMode: boolean = false;
  export let fetchedRecordId: string;
  export let fetchedData: ApiResponseData;
  export let updateNodeDetailsCardCallback: (selectedNode: GraphNode) => void;

  // Constants and variables
  const LIVE_MODE_INTERVAL = 2000;
  let graphContainer: HTMLDivElement;
  let cyInstance: cytoscape.Core;
  let intervalId: number | undefined = undefined;

  function getFormattedData(domainMode: boolean): GraphData {
    return domainMode ? getDomainViewData(fetchedData) : getWebsiteViewData(fetchedData);
  }

  async function fetchNewData(): Promise<void> {
    fetchedData = await getNodesByRecordId(fetchedRecordId);
  }

  function stopLiveMode() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = undefined;
    }
  }
  
  function startLiveMode(domainModeValue: boolean) {
    stopLiveMode();
    intervalId = setInterval(async () => {
      fetchNewData();
      const extractedData: GraphData = getFormattedData(domainModeValue);
      showGraph(extractedData);
    }, LIVE_MODE_INTERVAL);
    return () => clearInterval(intervalId);
  }

  function startStaticMode(domainModeValue: boolean) {
    stopLiveMode();
    const extractedData: GraphData = getFormattedData(domainModeValue);
    showGraph(extractedData);
  }
  
  // Lifecycle
  onMount(() => {
    const extractedData: GraphData = getFormattedData(domainMode);
    createGraph(extractedData);
  });

  onDestroy(() => {
    if (intervalId) clearInterval(intervalId);
  })

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
