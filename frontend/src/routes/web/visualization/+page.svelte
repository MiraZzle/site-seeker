<script lang="ts">
    import Navbar from "$components/web/Navbar.svelte";
    import Footer from "$components/web/Footer.svelte";
    import Header from "$components/elements/typography/Header.svelte";
    import SelectInput from "$components/utils/SelectInput.svelte";
    import Card from "$components/utils/Card.svelte";
    import Toggle from "$components/utils/Toggle.svelte";

    let dummyOptions = ["Option 1", "Option 2", "Option 3"];

    let liveMode: boolean = false;
    let domainMode: boolean = false;
    let selectedNodeCrawled: boolean = true;

    let nodeTime = "29/07/24 16:24";
    let nodeUrl = "https://www.example.com";
    let recordsCrawled = ["Record 1", "Record 2", "Record 3"]; // Dummy records for the crawled data
</script>

<Navbar activePage="Visualization"/>
<div class="visualization-i-container">
    <div class="visualization-i-info">
        <Header type={3}> Graph of Record with ID 1 </Header>
    </div>
</div>
<div class="visualization-i-graph">
    <Card>
        <Header type={2}> Node Details </Header>
        <div class="record-card-info-item">
            <span class="record-card-info-label">Crawl Time</span>
            <span class="record-card-info-value">{nodeTime}</span>
        </div>
        <div class="record-card-info-item">
            <span class="record-card-info-label">URL</span>
            <a class="record-card-info-value" href={nodeUrl} target="_blank">{nodeUrl}</a>
        </div>
        {#if selectedNodeCrawled}
            <div class="record-card-info-item">
                <span class="record-card-info-label">Records Crawled</span>
                <SelectInput options={recordsCrawled}/>
            </div>
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
            padding: 96px 0;
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
                        flex-direction: column;
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

                            a {
                                text-decoration: none;
                            }
                        }
                    }
                }
            }
        }
</style>
