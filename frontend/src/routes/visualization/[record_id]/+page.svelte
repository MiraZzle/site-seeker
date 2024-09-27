<script lang="ts">
  import Navbar from "$components/web/Navbar.svelte";
  import Header from "$components/elements/typography/Header.svelte";
  import SelectInput from "$components/utils/SelectInput.svelte";
  import Card from "$components/utils/Card.svelte";
  import Toggle from "$components/utils/Toggle.svelte";
  import NodeGraph from "$components/utils/NodeGraph.svelte";
  import Button from "$components/elements/typography/Button.svelte";
  import AddRecordModal from "$components/utils/AddRecordModal.svelte";
  import ExecutionStartedModal from "$components/utils/ExecutionStartedModal.svelte";
  import { getWebsiteRecordsByNodeId, getNodesByRecordId } from "$utils/visualizationUtils.js";
  import { onMount } from "svelte";
  import {
    type ApiResponseDataWrapper,
    type CrawledNode,
    type GraphNode,
    type WebsiteRecord
  } from "$types/visualizationTypes";

  let liveModeStatus: boolean = false;
  let domainModeStatus: boolean = false;
  let selectedNodeCrawled: boolean = false;
  let selectedNodeForDetailsCard: boolean = false;
  let recordSelected: boolean = false;

  let nodeTime: string = "";
  let nodeUrl: string = "";
  let recordsCrawled: string[] = [];
  let recordId: string = "";
  let recordData: any = null;

  // Button related variables
  let addWebsiteRecordModalVisible: boolean = false;
  let executionStartedModalVisible: boolean = false;
  let startExecutionId: string = "";

  // Fetching data on component mount
  onMount(async () => {
    const params = new URLSearchParams(window.location.search);
    const isLiveModeSet = params.get("livemode") === "true";
    
    recordId = window.location.pathname.split('/').pop()!;
    try {
      recordData = await getNodesByRecordId(recordId);
      liveModeStatus = isLiveModeSet;
    } catch (error) {
      console.error('Error fetching nodes by record id:', error);
    }
  });

  function handleAddWebsiteRecord() {
    addWebsiteRecordModalVisible = true;
  }

  async function onStartExecution(websiteRecordId: string) {
    executionStartedModalVisible = true;
    startExecutionId = websiteRecordId;

    try {
      const response = await fetch(
        `http://localhost:3000/api/websiteRecords/start/${websiteRecordId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (!response.ok) {
        throw new Error("Failed to start execution");
      }

      console.log(`Execution of Record ${websiteRecordId} started successfully!`);
    } catch (error) {
      console.error("Error starting execution:", error);
    }
  }

  function convertToTime(time: string, locale: string = "cs-CZ") {
    const date = new Date(parseInt(time));
    return date.toLocaleString(locale);
  }

  function isSameNode(node1Url: string, node2Url: string): boolean {
    return node1Url === node2Url;
  }

  function unselectNode(): void {
    selectedNodeForDetailsCard = false;
    selectedNodeCrawled = false;
    nodeUrl = "";
    nodeTime = "";
  }

  async function updateDetailsCard(chosenNode: GraphNode): Promise<void> {
    const selectedNodeData = chosenNode.value;
    const isCrawledNode = chosenNode.classes.includes("uncrawled") ? false : true;
    const selectedNodeUrl = selectedNodeData.url;
    const selectedNodeCrawlTime = selectedNodeData.crawlTime;

    if (isSameNode(nodeUrl, selectedNodeUrl)) {
      unselectNode();
    } else {
      selectedNodeForDetailsCard = true;
      selectedNodeCrawled = isCrawledNode;
      nodeUrl = selectedNodeUrl;
      nodeTime = convertToTime(selectedNodeCrawlTime);
      
      if (isCrawledNode) {
        const records = await getWebsiteRecordsByNodeId((selectedNodeData as CrawledNode).id);
        recordsCrawled = Array.from(new Set(records.map(record => record.id.toString())));
      }
    }
  }
</script>

<AddRecordModal
  bind:showModal={addWebsiteRecordModalVisible}
  url={nodeUrl}
  goToNewWebsiteRecord={true}
/>
<ExecutionStartedModal
  bind:showModal={executionStartedModalVisible}
  id={parseInt(startExecutionId)}
/>

<Navbar activePage="" />
<div class="visualization-i-container">
  <div class="visualization-i-info">
    <Header type={3}>Graph of Record with ID {recordId}</Header>
  </div>
</div>
<div class="visualization-i-graph">
  <div class="node-details-card">
    <Card>
      <Header type={2}>Node Details</Header>
      {#if selectedNodeForDetailsCard}
        <div class="record-card-info-item">
          <span class="record-card-info-label">URL</span>
          <a class="record-card-info-value" href={nodeUrl} target="_blank">{nodeUrl}</a>
        </div>
        {#if selectedNodeCrawled}
          <div class="record-card-info-item">
            <span class="record-card-info-label">Crawl Time</span>
            <span class="record-card-info-value">{nodeTime}</span>
          </div>
          <div class="record-card-info-item record-card-info-item__button">
            <div>
              <span class="record-card-info-label">Records Crawled</span>
              <SelectInput
                options={recordsCrawled}
                bind:value={startExecutionId}
                on:change={() => {
                  recordSelected = true;
                }}
              />
            </div>
            <div class="record-card-start-execution-button">
              <Button
                type="primary"
                disabled={!recordSelected}
                action={() => onStartExecution(startExecutionId)}
              >
                Start Execution
              </Button>
            </div>
          </div>
        {:else}
          <div class="record-card-info-item">
            <div class="record-card-create-website-record-button">
              <Button type="primary" action={handleAddWebsiteRecord}>Add Website Record</Button>
            </div>
          </div>
        {/if}
      {/if}
    </Card>
  </div>
  <div class="visualization-i-graph__main">
    <div class="visualization-i-graph__main__toggles">
      <div class="visualization__toggle-container">
        <span> Live Mode </span>
        <Toggle bind:checked={liveModeStatus} />
      </div>
      <div class="visualization__toggle-container">
        <span> Domain Mode </span>
        <Toggle bind:checked={domainModeStatus} />
      </div>
    </div>
    <div class="visualization-i-graph__main__graph">
      <div class="visualization__graph-container">
        {#if recordData && Object.keys(recordData).length > 0}
          <NodeGraph
            bind:liveMode={liveModeStatus}
            domainMode={domainModeStatus}
            fetchedRecordId={recordId}
            fetchedData={recordData}
            updateNodeDetailsCardCallback={updateDetailsCard}
          />
        {/if}
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  @import "../../../styles/variables.scss";

  .visualization {
    &__toggle-container {
      display: flex;
      flex-direction: row;
      gap: 12px;
      align-items: end;
      justify-content: end;
    }

    &__graph-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border: 1px solid $c-gray-outline;
      width: 100%;
      border-radius: 8px;
    }
    &-i {
      &-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 96px 0;
        background-color: $c-gray-bg;
      }

      &-info {
        display: flex;
        gap: 12px;
        flex-direction: column;
      }

      &-graph {
        display: flex;
        flex-direction: row;
        gap: 32px;
        padding: 32px;
        max-width: 1200px;
        width: 100%;
        margin: auto;

        &__main {
          display: flex;
          flex-direction: column;
          width: 100%;
          gap: 24px;

          &__toggles {
            display: flex;
            flex-direction: row;
            gap: 12px;
            justify-content: flex-end;
          }
        }

        .record-card-info-item {
          display: flex;
          gap: 2px;
          flex-direction: column;
          margin: 4px 8px;

          &__button {
            display: flex;
            gap: 8px;
            flex-direction: column;
          }

          .record-card-info-label {
            font-size: 14px;
            line-height: 140%;
            font-weight: 400;
            color: $c-gray-light;
          }

          .record-card-info-value {
            font-size: 16px;
            line-height: 140%;
            font-weight: 600;
            max-width: min-content;
            overflow-wrap: break-word;

            a {
              text-decoration: none;
            }
          }
        }
      }
    }
  }
</style>
