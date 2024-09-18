<script lang="ts">
    import Navbar from "$components/web/Navbar.svelte";
    import Footer from "$components/web/Footer.svelte";
    import Header from "$components/elements/typography/Header.svelte";
    import SelectInput from "$components/utils/SelectInput.svelte";
    import Card from "$components/utils/Card.svelte";
    import Toggle from "$components/utils/Toggle.svelte";
	import NodeGraph from "$components/utils/NodeGraph.svelte";
    import { type ApiResponseData, type GraphNode } from "$types/visualizationTypes";
	import Button from "$components/elements/typography/Button.svelte";

    let liveMode: boolean = false;
    let domainMode: boolean = false;
    let selectedNodeCrawled: boolean = false;
    let selectedNodeForDetailsCard: boolean = false;
    let recordSelected: boolean = false;

    let nodeTime: string;
    let nodeUrl: string;
    let recordsCrawled: string[] = ["Record 1", "Record 2"];

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

    function populateRecordsCrawled(): void {

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
        }
    }

    // sample data:
    const sampleFetchedData: ApiResponseData = {
            "data": {
            "nodes": [
                {
                "title": "Example Domain",
                "url": "https://example.com/",
                "crawlTime": "1725827466416",
                "links": [
            {
                "title": "Example Domains",
                "url": "https://iana.org/domains/example",
                "crawlTime": "1725827467543"
            }
            ],
            "owner": {
            "identifier": "4",
            "label": "Test",
            "url": "https://www.example.com"
            }
        },
        {
            "title": "Example Domains",
            "url": "https://iana.org/domains/example",
            "crawlTime": "1725827467543",
            "links": [
            {
                "title": "Example Domains",
                "url": "https://iana.org/domains/example",
                "crawlTime": "1725827467543"
            },
            {
                "title": "Internet Assigned Numbers Authority",
                "url": "https://iana.org/",
                "crawlTime": "1725827468146"
            },
            {
                "title": "Domain Name Services",
                "url": "https://iana.org/domains",
                "crawlTime": "1725827468553"
            },
            {
                "title": "Protocol Registries",
                "url": "https://iana.org/protocols",
                "crawlTime": "1725827469551"
            },
            {
                "title": "Number Resources",
                "url": "https://iana.org/numbers",
                "crawlTime": "1725827470004"
            },
            {
                "title": "About us",
                "url": "https://iana.org/about",
                "crawlTime": "1725827470414"
            },
            {
                "title": "RFC 2606:  Reserved Top Level DNS Names ",
                "url": "https://iana.org/go/rfc2606",
                "crawlTime": "1725827471006"
            },
            {
                "title": "RFC 6761: Special-Use Domain Names",
                "url": "https://iana.org/go/rfc6761",
                "crawlTime": "1725827471640"
            },
            {
                "title": "IANA-managed Reserved Domains",
                "url": "https://iana.org/domains/reserved",
                "crawlTime": "1725827472270"
            },
            {
                "title": "Root Zone Management",
                "url": "https://iana.org/domains/root",
                "crawlTime": "1725827472669"
            },
            {
                "title": "Intergovernmental Treaty (.INT) Domains",
                "url": "https://iana.org/domains/int",
                "crawlTime": "1725827473073"
            }
            ],
            "owner": {
            "identifier": "4",
            "label": "Test",
            "url": "https://www.example.com"
            }
        },
        {
            "title": "Internet Assigned Numbers Authority",
            "url": "https://iana.org/",
            "crawlTime": "1725827468146",
            "links": [
            {
                "title": "Example Domains",
                "url": "https://iana.org/domains/example",
                "crawlTime": "1725827467543"
            },
            {
                "title": "Internet Assigned Numbers Authority",
                "url": "https://iana.org/",
                "crawlTime": "1725827468146"
            },
            {
                "title": "Domain Name Services",
                "url": "https://iana.org/domains",
                "crawlTime": "1725827468553"
            },
            {
                "title": "Protocol Registries",
                "url": "https://iana.org/protocols",
                "crawlTime": "1725827469551"
            },
            {
                "title": "Number Resources",
                "url": "https://iana.org/numbers",
                "crawlTime": "1725827470004"
            },
            {
                "title": "About us",
                "url": "https://iana.org/about",
                "crawlTime": "1725827470414"
            },
            {
                "title": "RFC 2606:  Reserved Top Level DNS Names ",
                "url": "https://iana.org/go/rfc2606",
                "crawlTime": "1725827471006"
            },
            {
                "title": "RFC 6761: Special-Use Domain Names",
                "url": "https://iana.org/go/rfc6761",
                "crawlTime": "1725827471640"
            },
            {
                "title": "IANA-managed Reserved Domains",
                "url": "https://iana.org/domains/reserved",
                "crawlTime": "1725827472270"
            },
            {
                "title": "Root Zone Management",
                "url": "https://iana.org/domains/root",
                "crawlTime": "1725827472669"
            },
            {
                "title": "Intergovernmental Treaty (.INT) Domains",
                "url": "https://iana.org/domains/int",
                "crawlTime": "1725827473073"
            }
            ],
            "owner": {
            "identifier": "4",
            "label": "Test",
            "url": "https://www.example.com"
            }
        },
        ]
    }
    };

    const sampleFetchedDataV2: ApiResponseData = {
      data: {
        nodes: [
            {
                    title: "Home Page",
                    url: "https://example-home.com/",
                    crawlTime: "1725827466416",
                    links: [
                    {
                        title: "About Us",
                        url: "https://example-home.com/about",
                        crawlTime: "1725827467543",
                    },
                    {
                        title: "Contact Us",
                        url: "https://example-home.com/contact",
                        crawlTime: "1725827468543",
                    },
                    ],
                    owner: {
                    identifier: "1",
                    label: "Example Home",
                    url: "https://example-home.com/",
                    },
                },
                {
                    title: "About Us",
                    url: "https://example-home.com/about",
                    crawlTime: "1725827467543",
                    links: [
                    {
                        title: "Team",
                        url: "https://example-home.com/team",
                        crawlTime: "1725827469543",
                    },
                    {
                        title: "Contact Us",
                        url: "https://example-home.com/contact",
                        crawlTime: "1725827468543",
                    },
                    ],
                    owner: {
                    identifier: "1",
                    label: "Example Home",
                    url: "https://example-home.com/",
                    },
                },
                {
                    title: "Contact Us",
                    url: "https://example-home.com/contact",
                    crawlTime: "1725827468543",
                    links: [
                    {
                        title: "Home Page",
                        url: "https://example-home.com/",
                        crawlTime: "1725827466416",
                    },
                    ],
                    owner: {
                    identifier: "1",
                    label: "Example Home",
                    url: "https://example-home.com/",
                    },
                },
                {
                    title: "Team",
                    url: "https://example-home.com/team",
                    crawlTime: "1725827469543",
                    links: [
                    {
                        title: "Home Page",
                        url: "https://example-home.com/",
                        crawlTime: "1725827466416",
                    },
                    ],
                    owner: {
                    identifier: "1",
                    label: "Example Home",
                    url: "https://example-home.com/",
                    },
                },
                {
                    title: "Products",
                    url: "https://example-products.com/",
                    crawlTime: "1725827466416",
                    links: [
                    {
                        title: "Product A",
                        url: "https://example-products.com/a",
                        crawlTime: "1725827467543",
                    },
                    {
                        title: "Product B",
                        url: "https://example-products.com/b",
                        crawlTime: "1725827468543",
                    },
                    ],
                    owner: {
                    identifier: "2",
                    label: "Example Products",
                    url: "https://example-products.com/",
                    },
                },
                {
                    title: "Product A",
                    url: "https://example-products.com/a",
                    crawlTime: "1725827467543",
                    links: [
                    {
                        title: "Home Page",
                        url: "https://example-home.com/",
                        crawlTime: "1725827466416",
                    },
                    ],
                    owner: {
                    identifier: "2",
                    label: "Example Products",
                    url: "https://example-products.com/",
                    },
                },
                {
                    title: "Product B",
                    url: "https://example-products.com/b",
                    crawlTime: "1725827468543",
                    links: [
                    {
                        title: "Product A",
                        url: "https://example-products.com/a",
                        crawlTime: "1725827467543",
                    },
                    {
                        title: "External Product",
                        url: "https://external.com/product",
                        crawlTime: "1725827469543",
                    }
                    ],
                    owner: {
                    identifier: "2",
                    label: "Example Products",
                    url: "https://example-products.com/",
                    },
                },
                ],
            },
    };

    export let data;
    const { recordId, recordData } = data;
</script>

<Navbar activePage=""/>
<div class="visualization-i-container">
    <div class="visualization-i-info">
        <Header type={3}> Graph of Record with ID {recordId} </Header>
    </div>
</div>
<div class="visualization-i-graph">
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
                on:change={
                    (event) => {
                        recordSelected = true;
                    }
                }
            />
            <div class="record-card-start-crawl-button">
                <Button type="primary" disabled={!recordSelected}> Start Crawling </Button>
            </div>
        </div>
        {:else}
        <div class="record-card-info-item">
            <div class="record-card-create-website-record-button">
                <Button type="primary"> Create Website Record </Button>
            </div>
        </div>
        {/if}
        {/if}
    </Card>
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

                            a {
                                text-decoration: none;
                            }
                        }

                        .record-card-start-crawl-button {
                            display: flex;
                            justify-content: flex-start;
                        }
                    }
                }
            }
        }
</style>
