<script lang="ts">
  import Check from "./icons/Check.svelte";

  export let options: string[] = [];
  export let selectedOption: string;
  export let onSelect: (option: string) => void;

  function handleSelect(option: string) {
    if (option !== selectedOption) {
      onSelect(option);
    }
  }
</script>

<div class="sorting-options">
  {#each options as option}
    <button
      class="sorting-button {selectedOption === option ? 'active' : ''}"
      on:click={() => handleSelect(option)}
    >
      {#if selectedOption === option}
        <Check />
      {/if}
      &nbsp;
      {option}
    </button>
  {/each}
</div>

<style lang="scss">
  @import "../../styles/variables.scss";

  .sorting-options {
    display: flex;
    gap: 8px;
  }

  .sorting-button {
    display: flex;
    align-items: center;
    padding: 8px;
    background-color: $c-gray-bg;
    color: $c-gray-dark;
    border-radius: 8px;
    cursor: pointer;
    font-size: 12px;

    &.active {
      background-color: $c-gray-dark;
      color: $c-gray-bg;
    }
  }
</style>
