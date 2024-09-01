<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let options: string[] = [];
    export let value: string = '';

    const dispatch = createEventDispatcher();

    function handleChange(event : any) {
        const selectedValue = event.target.value;
        value = selectedValue;
        dispatch('change', selectedValue);
    }
</script>

<select class="select-input" value={value} on:change={handleChange}>
    {#each options as option}
        <option value={option}>{option}</option>
    {/each}
</select>

<style lang="scss">
    @import "../../styles/variables.scss";

    .select-input {
        height: 42px;
        padding: 12px 12px 12px 16px;
        border-radius: 8px;
        border: 1px solid $c-gray-outline;
        font-size: 16px;
        color: $c-black;
        background-color: $c-white;
        transition: all .1s ease-out;
        width: 100%;
        font-weight: 400;
        font-size: 14px;

        &:focus {
            border-color: $c-blue;
        }
    }
</style>