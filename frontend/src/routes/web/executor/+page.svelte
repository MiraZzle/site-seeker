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

    let currentPage: number = 1;
    let executionsPerPage: number = 5;
    let executions: any[] = [];
    let filteredExecutions: any[] = [];
    let displayedExecutions: any[] = [];

    // Filtry
    let labelFilter = "";

    // Načítání exekucí z backendu
    async function loadExecutions() {
        executions = await fetchExecutions(); // Získáváme všechny exekuce z backendu
        filterAndPaginateExecutions();
    }

    $: filterAndPaginateExecutions();

    // Funkce na filtrování a stránkování exekucí
    function filterAndPaginateExecutions() {
        // Filtrujeme podle labelu
        filteredExecutions = executions.filter(execution => {
            const matchesLabel = labelFilter === "" || execution.websiteLabel.toLowerCase().includes(labelFilter.toLowerCase());
            return matchesLabel;
        });

        // Stránkujeme vyfiltrované exekuce
        const totalExecutions = filteredExecutions.length;
        const topRange = currentPage * executionsPerPage < totalExecutions ? currentPage * executionsPerPage : totalExecutions;
        displayedExecutions = filteredExecutions.slice((currentPage - 1) * executionsPerPage, topRange);
    }

    function handleFilter() {
        // Reset na první stránku a okamžitá aplikace filtru
        currentPage = 1;
        filterAndPaginateExecutions();
    }

    onMount(() => {
        // Načteme všechna data při první montáži komponenty
        loadExecutions();
    });

    function handlePageChange(newPage: number) {
        // Změna stránky pro stránkování
        currentPage = newPage;
        filterAndPaginateExecutions();
    }
</script>

<Navbar activePage="Executor"/>
<div class="execution-info-container">
    <Header type={2} textAlign="center">Displaying all Executions</Header>
</div>
<div class="execution-view">
    <Card>
        <TextInput bind:value={labelFilter} placeholder="Your Label" description="Label"/>
        <Button type="dark" action={handleFilter}> Filter </Button>
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
                />
            {/each}
        </div>        
        <div class="execution-view__pagination-container__pagination">
            <PaginationBar
                currentPage={currentPage}
                records={filteredExecutions}
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
</style>
