<script lang="ts">
  import SortOptions from "$components/utils/SortOptions.svelte";
  import { writable } from "svelte/store";

  const sortingOptions = [
    "URL ascending",
    "URL descending",
    "Crawled ascending",
    "Crawled descending"
  ];

  let selectedOption = writable(sortingOptions[0]);

  function handleSelect(option: string) {
    selectedOption.set(option);
  }
</script>

<div class="sorting-options">
  <SortOptions
    options={sortingOptions}
    bind:selectedOption={$selectedOption}
    onSelect={handleSelect}
  />
  <h2>Selected: {$selectedOption}</h2>
</div>

<style lang="scss">
  .sorting-options {
    margin: 16px;
    display: flex;
    gap: 8px;
    align-items: center;
    flex-direction: column;
  }
</style>
