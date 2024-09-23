<script lang="ts">
  import RecordCard from "$components/elements/RecordCard.svelte";
</script>

<div class="card-container">
  <RecordCard label="Test" periodicity="Every Hour" time="29/07/24 16:24" status="Finished" />
</div>

<style lang="scss">
  .card-container {
    display: flex;
    margin: 16px;
  }
</style>
