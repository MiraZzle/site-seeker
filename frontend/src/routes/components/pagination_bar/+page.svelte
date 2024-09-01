<script lang="ts">
    import PaginationBar from "$components/elements/PaginationBar.svelte";

    const dummyRecords = Array.from({ length: 100 }, (_, i) => i + 1);
</script>

<div class="pagination-bar">
    <PaginationBar perPage={10} currentPage={1} records={dummyRecords} />
</div>

<style lang="scss">
    .pagination-bar {
        display: flex;
        justify-content: center;
        gap: 16px;
        margin: 16px;
    }
</style>