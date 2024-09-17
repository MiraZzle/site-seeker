<script lang="ts">
    import PaginationButton from '$components/utils/PaginationButton.svelte';
    import { writable, type Writable } from 'svelte/store';

    export let onPageChange: (newPage: number) => void = () => { };
    export let perPage: number;
    export let currentPage: number;
    export let records: any[];

    let pageCount: number;
    let pages: Writable<any[]> = writable([]);

    // 💀 SHITTY CODE AHEAD 💀
    // tahle funkce je mega blitka
    // pokud mas cas (ja ho nemam), prepis ji
    // diky - Matej
    function createPages() {
        const totalRecords: number = records.length;
        const totalPages = Math.ceil(totalRecords / perPage);
        pageCount = totalPages;

        let pagesArray: any[] = [];

        if (currentPage === 1) {
            if (totalPages === 1) {
                pagesArray = [1];
            } else if (totalPages === 2) {
                pagesArray = [1, 2];
            }
            else {
                pagesArray = [1, 2, 3];
            }
        } else if (currentPage > 1 && currentPage < totalPages) {
            pagesArray = [currentPage - 1, currentPage, currentPage + 1];
        } else if (currentPage === totalPages) {
            console.log('Current page is last page');
            if (totalPages === 2) {
                pagesArray = [totalPages - 1, totalPages];
            } else {
                pagesArray = [totalPages - 2, totalPages - 1, totalPages];
            }
        }

        if (currentPage > 3) {
            pagesArray = [1, '...', ...pagesArray];
        }

        if (currentPage < totalPages - 2) {
            pagesArray = [...pagesArray, '...', totalPages];
        }

        pages.set(pagesArray);
    }

    $: if (records.length > 0) {
        createPages();
    }

    function goToPage(page: number) {
        if (page > 0 && page <= pageCount) {
            currentPage = page;
            onPageChange(currentPage);
            createPages();
        }
    }
</script>

<div class="pagination">
    <PaginationButton type="previous" disabled={currentPage === 1} on:click={() => goToPage(currentPage - 1)}
        action={() => goToPage(currentPage - 1)} />

    {#each $pages as page}
        {#if page === '...'}
            <span class="pagination-dots">...</span>
        {:else}
            <button class="pagination-button {currentPage === page ? 'active' : ''}" on:click={() => goToPage(page)}>
                {page}
            </button>
        {/if}
    {/each}

    <PaginationButton type="next" disabled={currentPage === pageCount} on:click={() => goToPage(currentPage + 1)}
        action={() => goToPage(currentPage + 1)} />
</div>

<style lang="scss">
    .pagination {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .pagination-button {
        padding: 8px 12px;
        background-color: white;
        border: 1px solid #cccccc00;
        border-radius: 8px;
        cursor: pointer;

        &:hover {
            background-color: #f9f9f9;
            border: 1px solid #ccc;
        }
    }

    .pagination-button.active {
        background-color: #333;
        color: white;
        border-color: #333;
    }

    .pagination-dots {
        font-size: 16px;
        color: #999;
    }
</style>
