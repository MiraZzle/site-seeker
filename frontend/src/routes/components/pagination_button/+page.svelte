<script lang="ts">
  import PaginationButton from "$components/utils/PaginationButton.svelte";
</script>

<div class="pagination-button-container">
  <PaginationButton type="previous" disabled={true} />
  <PaginationButton type="next" disabled={false} />
</div>

<style lang="scss">
  .pagination-button-container {
    display: flex;
    justify-content: center;
    gap: 8px;
  }
</style>
