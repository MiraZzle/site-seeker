<script lang="ts">
  export let value = "";
  export let id = "";
  export let placeholder = "Value";
  export let description = "Label";
  export let type: "text" | "password" | "number" = "text";
</script>

<div class="input-block">
  <label for={id} class="input-block__label">
    {description}
  </label>
  {#if type === "text"}
    <input {id} bind:value {placeholder} class="input-block__input" type="text" />
  {:else if type === "password"}
    <input {id} bind:value {placeholder} class="input-block__input" type="password" />
  {:else if type === "number"}
    <input {id} bind:value {placeholder} class="input-block__input" type="number" />
  {/if}
</div>

<style lang="scss">
  @import "../../styles/variables.scss";

  .input-block {
    display: flex;
    flex-direction: column;
    gap: 8px;
    &__label {
      font-size: 16px;
      line-height: 140%;
      font-weight: 400;
      color: $c-black;
    }
    &__input {
      border: 1px solid $c-gray-outline;
      border-radius: 8px;
      padding: 12px;
    }
  }
</style>
