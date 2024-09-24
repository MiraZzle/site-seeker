<script lang="ts">
  import SelectInput from "$components/utils/SelectInput.svelte";
  import Header from "$components/elements/typography/Header.svelte";

  let options = ["Option 1", "Option 2", "Option 3"];
  let selectedOption = "Option 1";
</script>

<div class="select-container">
  <Header type={2}>Selected option: {selectedOption}</Header>
  <SelectInput {options} bind:value={selectedOption} />
</div>

<style lang="scss">
  .select-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin: auto;
    width: 200px;
  }
</style>
