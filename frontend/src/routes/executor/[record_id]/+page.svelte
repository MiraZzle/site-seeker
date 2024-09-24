<script lang="ts">
  import { onMount } from "svelte";
  import Navbar from "$components/web/Navbar.svelte";
  import Header from "$components/elements/typography/Header.svelte";
  import PaginationBar from "$components/elements/PaginationBar.svelte";
  import ExecutionCard from "$components/elements/ExecutionCard.svelte";

  export let data;
  const { recordId, executions } = data;

  let currentPage: number = 1;
  let executionsPerPage: number = 5;
  let displayedExecutions: any[] = [];

  function paginateExecutions() {
    const totalExecutions = executions.length;
    const topRange =
      currentPage * executionsPerPage < totalExecutions
        ? currentPage * executionsPerPage
        : totalExecutions;
    displayedExecutions = executions.slice((currentPage - 1) * executionsPerPage, topRange);
  }

  onMount(() => {
    paginateExecutions();
  });

  function handlePageChange(newPage: number) {
    currentPage = newPage;
    paginateExecutions();
  }

  onMount(() => {
    paginateExecutions();
  });
</script>

<Navbar activePage="Executor" />
<div class="execution-info-container">
  <Header type={2} textAlign="center">Displaying Executions of Website Record {recordId}</Header>
</div>
<div class="execution-view">
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
        />
      {/each}
    </div>
    <div class="execution-view__pagination-container__pagination">
      <PaginationBar
        {currentPage}
        records={executions}
        perPage={executionsPerPage}
        onPageChange={handlePageChange}
      />
    </div>
  </div>
</div>

<style lang="scss">
  @import "../../../styles/variables.scss";

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
