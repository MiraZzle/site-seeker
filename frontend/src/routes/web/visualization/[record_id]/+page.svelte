<script lang="ts">
    import Navbar from "$components/web/Navbar.svelte";
    import Footer from "$components/web/Footer.svelte";
    import Header from "$components/elements/typography/Header.svelte";
    import SelectInput from "$components/utils/SelectInput.svelte";
    import Card from "$components/utils/Card.svelte";
    import Toggle from "$components/utils/Toggle.svelte";
	import NodeGraph from "$components/utils/NodeGraph.svelte";
    import { type CrawledNode, type GraphNode } from "$types/visualizationTypes";
	import Button from "$components/elements/typography/Button.svelte";
    import AddRecordModal from "$components/utils/AddRecordModal.svelte";
	import ExecutionStartedModal from "$components/utils/ExecutionStartedModal.svelte";

    let liveMode: boolean = false;
    let domainMode: boolean = false;
    let selectedNodeCrawled: boolean = false;
    let selectedNodeForDetailsCard: boolean = false;
    let recordSelected: boolean = false;

    let nodeTime: string;
    let nodeUrl: string;
    let recordsCrawled: string[] = [];

    // Button related variables
    let addWebsiteRecordModalVisible: boolean = false;
    let executionStartedModalVisible: boolean = false;
    let startExecutionId: string = "";

    function handleAddWebsiteRecord() {
        addWebsiteRecordModalVisible = true;
    }

    function onStartExecution(websiteRecordId: string) {
        executionStartedModalVisible = true;
        startExecutionId = websiteRecordId;
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

    function updateDetailsCard(chosenNode: GraphNode): void {
        const selectedNodeData = chosenNode.value;
        const isCrawledNode = chosenNode.classes.includes("uncrawled") ? false : true;
        const selectedNodeUrl = selectedNodeData.url;
        const selectedNodeCrawlTime = selectedNodeData.crawlTime;
        if (isSameNode(nodeUrl, selectedNodeUrl)) {
            unselectNode();
        } else {
            selectedNodeForDetailsCard = true;
            selectedNodeCrawled = isCrawledNode
            nodeUrl = selectedNodeUrl;
            nodeTime = convertToTime(selectedNodeCrawlTime);
            // TODO: there should be multiple records????
            if (isCrawledNode) {
                recordsCrawled = [(selectedNodeData as CrawledNode).owner.identifier];
            }
        }
    }

    export let data;
    const { recordId, recordData } = data;
</script>

<AddRecordModal bind:showModal={addWebsiteRecordModalVisible} />
<ExecutionStartedModal bind:showModal={executionStartedModalVisible} id={parseInt(startExecutionId)} />

<Navbar activePage=""/>
<div class="visualization-i-container">
    <div class="visualization-i-info">
        <Header type={3}> Graph of Record with ID {recordId} </Header>
    </div>
</div>
<div class="visualization-i-graph">
    <div class="node-details-card">
        <Card>
            <Header type={2}> Node Details </Header>
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
            <div class="record-card-info-item">
                <span class="record-card-info-label">Records Crawled</span>
                <SelectInput 
                    options={recordsCrawled} 
                    bind:value={startExecutionId}
                    on:change={
                        (event) => {
                            console.log(startExecutionId);
                            recordSelected = true;
                        }
                    }
                />
                <div class="record-card-start-execution-button">
                    <Button type="primary" disabled={!recordSelected} action={() => onStartExecution(startExecutionId)}> Start Execution </Button>
                </div>
            </div>
            {:else}
            <div class="record-card-info-item">
                <div class="record-card-create-website-record-button">
                    <Button type="primary" action={handleAddWebsiteRecord}> Add Website Record </Button>
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
                <Toggle bind:checked={liveMode}/>
            </div>
            <div class="visualization__toggle-container">
                <span> Domain Mode </span>
                <Toggle bind:checked={domainMode}/>
            </div>
        </div>
        <div class="visualization-i-graph__main__graph">
                <div class="visualization__graph-container">
                    <NodeGraph liveMode={liveMode} domainMode={domainMode} fetchedData={recordData} updateNodeDetailsCardCallback={updateDetailsCard} />
                </div>
        </div>
    </div>
</div>

<style lang="scss">
    @import "../../../../styles/variables.scss";

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
            background-color: $c-gray-bg;
            width: 100%;
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
