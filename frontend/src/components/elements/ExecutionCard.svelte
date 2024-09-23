<script lang="ts">
  export let label = "Test";
  export let status = "Finished";
  export let crawledSites = 13;
  export let startTime = "29/07/24 16:24";
  export let endTime = "29/07/24 16:29";
  export let websiteRecordId = "1";
  export let selected: boolean = false;
  export let executionId = "1";

  // Emit an event when the card is clicked
  const selectExecution = () => {
    const detail = { recordId: websiteRecordId, id: executionId };
    dispatch("select", detail);
  };

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
</script>

<!-- Add the selected class conditionally -->
<div
  class="execution-card shadow {selected ? 'execution-card__selected' : ''}"
  on:click={selectExecution}
  on:keydown={(event) => {
    if (event.key === "Enter" || event.key === " ") {
      selectExecution();
    }
  }}
  tabindex="0"
  role="button"
  aria-pressed={selected}
>
  <div class="execution-info">
    <div class="execution-info-item">
      <span class="execution-info-label">Label</span>
      <span class="execution-info-value"> {label} </span>
    </div>
    <div class="execution-info-item">
      <span class="execution-info-label">Status</span>
      <span class="execution-info-value"> {status} </span>
    </div>
    <div class="execution-info-item">
      <span class="execution-info-label">Number of crawled Sites</span>
      <span class="execution-info-value"> {crawledSites} </span>
    </div>
    <div class="execution-info-item">
      <span class="execution-info-label">Start Time</span>
      <span class="execution-info-value"> {startTime} </span>
    </div>
    <div class="execution-info-item">
      <span class="execution-info-label">End Time</span>
      <span class="execution-info-value"> {endTime} </span>
    </div>
    <div class="execution-info-item">
      <span class="execution-info-label">Parent Record ID</span>
      <span class="execution-info-value"> {websiteRecordId} </span>
    </div>
  </div>
</div>

<style lang="scss">
  @import "../../styles/variables.scss";

  .execution-card {
    display: flex;
    justify-content: space-between;
    border: 1px solid $c-gray-outline;
    border-radius: 8px;
    padding: 16px;
    width: auto;
    transition: all 0.1s ease-out;
    cursor: pointer;

    &__selected {
      border: 1px solid black;
      background-color: darken(white, 2%);
    }

    &:hover {
      transform: scale(1.04);
    }
  }

  .execution-info {
    display: flex;
    flex-direction: row;
    gap: 8px;
    width: 100%;
    justify-content: space-around;

    &-item {
      display: flex;
      gap: 2px;
      flex-direction: column;
      margin: 4px 8px;
    }

    &-label {
      font-size: 14px;
      line-height: 140%;
      font-weight: 400;
      color: $c-gray-light;
    }

    &-value {
      font-size: 16px;
      line-height: 140%;
      font-weight: 600;
    }
  }
</style>
