<script lang="ts">
  import Cross from "./icons/Cross.svelte";

  export let name: string = "world";
  export let removeTagAction: (tagName: string) => void;
</script>

<div class="tag">
  <span class="tag-name"> {name} </span>
  <button class="tag-button" on:click={() => removeTagAction(name)}> <Cross /> </button>
</div>

<style lang="scss">
  @import "../../styles/variables.scss";

  .tag {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    border-radius: 8px;
    background-color: $c-gray-bg;
    color: $c-black;
    font-size: 16px;
    font-weight: 400;

    &-button {
      background-color: transparent;
      border: none;
      cursor: pointer;
      padding: 0;
      margin: 0;
    }
  }
</style>
