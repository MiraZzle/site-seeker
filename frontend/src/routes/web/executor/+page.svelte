<script lang="ts">
    import Navbar from "$components/web/Navbar.svelte";
    import Footer from "$components/web/Footer.svelte";
    import Header from "$components/elements/typography/Header.svelte";
    import Card from "$components/utils/Card.svelte";
    import PaginationBar from "$components/elements/PaginationBar.svelte";
    import TextInput from "$components/utils/TextInput.svelte";
    import Checkbox from "$components/utils/Checkbox.svelte";
    import Button from "$components/elements/typography/Button.svelte";
    import ExecutionCard from "$components/elements/ExecutionCard.svelte";
    import { onMount } from 'svelte';

    let recordId = 12;
    let currentPage: number = 1;
    const dummyExecutions: any[] = [
        { label: "Test", status: "Finished", crawledSites: 13, startTime: "29/07/24 16:24", endTime: "29/07/24 16:29" },
        { label: "Test", status: "Finished", crawledSites: 13, startTime: "29/07/24 16:24", endTime: "29/07/24 16:29" },
        // Add more dummy executions here...
    ];

    let displayedExecutions: any[] = [];

    function loadExecutions(newPage: number) {
        console.log('Loading executions');
        currentPage = newPage;
        let totalExecutions = dummyExecutions.length;
        let topRange = currentPage * 5 < totalExecutions ? currentPage * 5 : totalExecutions;
        displayedExecutions = dummyExecutions.slice((currentPage - 1) * 5, topRange);
        console.log(displayedExecutions);
        return displayedExecutions;
    }

    onMount(() => {
        loadExecutions(currentPage);
    });

    function handleFilter() {
        console.log('Filtering executions');
    }
</script>

<Navbar activePage="Executor"/>
<div class="execution-info-container">
    <Header type={2} textAlign="center">Displaying all Executions</Header>
</div>
<div class="execution-view">
    <Card>
        <TextInput placeholder="Your Label" description="Label"/>
        <Checkbox label="Finished"/>
        <Button type="dark" on:click={handleFilter}> Filter </Button>
    </Card>
    <div class="execution-view__pagination-container">
        <div class="execution-view__pagination-container__executions">
            {#each displayedExecutions as execution}
                <ExecutionCard
                    label={execution.label}
                    status={execution.status}
                    crawledSites={execution.crawledSites}
                    startTime={execution.startTime}
                    endTime={execution.endTime}
                />
            {/each}
        </div>
        <div class="execution-view__pagination-container__pagination">
            <PaginationBar currentPage={currentPage} records={dummyExecutions} perPage={5} onPageChange={loadExecutions}/>
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
</style>
