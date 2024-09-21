<script lang="ts">
    import Navbar from "$components/web/Navbar.svelte";
    import Footer from "$components/web/Footer.svelte";
    import Header from "$components/elements/typography/Header.svelte";
    import Card from "$components/utils/Card.svelte";
    import PaginationBar from "$components/elements/PaginationBar.svelte";
    import TextInput from "$components/utils/TextInput.svelte";
    import Button from "$components/elements/typography/Button.svelte";
    import ExecutionCard from "$components/elements/ExecutionCard.svelte";
    import { onMount } from 'svelte';
    import { fetchExecutions } from "$lib/api/executions";
    import { goto } from "$app/navigation";

    let currentPage: number = 1;
    let executionsPerPage: number = 5;
    let executions: any[] = [];
    let allExecutions: any[] = [];
    let displayedExecutions: any[] = [];

    let selectedRecordId: string = ""; // Store the selected record ID
    let selectedExecutionId: string = ""; // Store the selected execution ID

    async function loadExecutions() {
        executions = await fetchExecutions();
        paginateExecutions();
    }

    $: paginateExecutions();

    function paginateExecutions() {
        allExecutions = executions;

        const totalExecutions = executions.length;
        const topRange = currentPage * executionsPerPage < totalExecutions ? currentPage * executionsPerPage : totalExecutions;
        displayedExecutions = executions.slice((currentPage - 1) * executionsPerPage, topRange);
    }

    function handlePageChange(newPage: number) {
        currentPage = newPage;
        paginateExecutions();
    }

    // Function to handle card selection
    function handleCardSelect(event: CustomEvent) {
        selectedRecordId = event.detail.recordId;
        selectedExecutionId = event.detail.id;
    }

    function goToExecutions() {
        goto(`/web/executor/${selectedRecordId}`);
    }

    onMount(() => {
        loadExecutions();
    });
</script>

<Navbar activePage="Executor"/>
<div class="execution-info-container">
    <Header type={3} textAlign="center">Displaying all Executions</Header>
</div>
<div class="execution-view">
    <Card>
        <Header type={2}>Execution Detail</Header>
        <!-- Insert the selected record and execution IDs after the header -->
        {#if selectedRecordId && selectedExecutionId}
            <div class="execution-card-info-item">
                <span class="execution-card-info-label">Record ID</span>
                <span class="execution-card-info-value">{selectedRecordId}</span>
            </div>
            <div class="execution-card-info-item">
                <span class="execution-card-info-label">Execution ID</span>
                <span class="execution-card-info-value">{selectedExecutionId}</span>
            </div>
            <Button type="dark" action={goToExecutions}> Show Record Executions </Button>
        {/if}
    </Card>
    <div class="execution-view__pagination-container">
        <div class="execution-view__pagination-container__executions">
            {#each displayedExecutions as execution}
                <ExecutionCard
                    label={execution.websiteLabel}
                    status={execution.status}
                    crawledSites={execution.crawledSites}
                    startTime={execution.startTime}
                    endTime={execution.endTime}
                    websiteRecordId={execution.websiteRecordId}
                    executionId={execution.id}
                    selected={selectedExecutionId === execution.id}
                    on:select={handleCardSelect}
                />
            {/each}
        </div>
        <div class="execution-view__pagination-container__pagination">
            <PaginationBar
                currentPage={currentPage}
                records={allExecutions}
                perPage={executionsPerPage}
                onPageChange={handlePageChange}
            />
        </div>
    </div>
</div>

<style lang="scss">
    @import '../../../styles/variables.scss';

    .execution-info-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 96px 0;
        background-color: $c-gray-bg;
        gap: 12px;
    }

    .execution-view {
        margin: auto;
        max-width: 1200px;
        display: flex;
        padding: 32px;
        gap: 64px;
        flex-direction: row;

        &__pagination-container {
            display: flex;
            flex-direction: column;
            gap: 48px;
            width: 100%;

            &__executions {
                display: flex;
                flex-direction: column;
                gap: 24px;
            }

            &__pagination {
                display: flex;
                justify-content: center;
            }
        }
    }

    /* Execution card info style */
    .execution-card-info-item {
        display: flex;
        gap: 2px;
        flex-direction: column;
        margin: 4px 8px;

        .execution-card-info-label {
            font-size: 14px;
            line-height: 140%;
            font-weight: 400;
            color: $c-gray-light;
        }

        .execution-card-info-value {
            font-size: 16px;
            line-height: 140%;
            font-weight: 600;
            max-width: min-content;
            overflow-wrap: break-word;
        }
    }
</style>
