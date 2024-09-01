<script lang="ts">
    import ArrowLeft from "./icons/ArrowLeft.svelte";
    import ArrowRight from "./icons/ArrowRight.svelte";

    export let type: "previous" | "next" = "previous";
    export let disabled: boolean = false;
    export let action: () => void = () => {}; // Action prop to handle the click event
</script>

<button class="nav-button nav-button--disabled-{disabled}" disabled={disabled} on:click={action}>
    {#if type === "previous"}
        <ArrowLeft /> Previous
    {:else}
        Next <ArrowRight />
    {/if}
</button>

<style lang="scss">
    .nav-button {
        display: flex;
        align-items: center;
        font-size: 16px;
        padding: 8px 12px;

        gap: 8px;
        border-radius: 8px;
        border: 1px solid #cccccc00;
        margin: 0 12px;
        background-color: rgba(255, 255, 255, 0);
        cursor: pointer;


        &:hover {
            background-color: #f9f9f9;
            border: 1px solid #ccc;
        }

        &--disabled-true {
            cursor: auto;
            opacity: 0.5;
        }
    }
</style>
