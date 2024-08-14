<script lang="ts">
    import Toggle from "$components/utils/Toggle.svelte";
    let isChecked = false;

    function handleChange(event: CustomEvent) {
        isChecked = event.detail.checked;
    }
</script>

<div class="toggle-container">
    <Toggle bind:checked={isChecked} on:change={handleChange} />
    <p>The switch is {isChecked ? 'On' : 'Off'}</p>
</div>

<style lang="scss">
    .toggle-container {
        display: flex;
        align-items: center;
        gap: 16px;
        margin: 16px;
    }
</style>