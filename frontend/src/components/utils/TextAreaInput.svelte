<script lang="ts">
    export let id = "";
    export let label = "";
    export let value = "";
    export let placeholder = "";
</script>

<div class="textarea-container">
    <label for={id} class="label"> {label} </label>
    <textarea class="textarea-input" id={id} placeholder={placeholder} bind:value={value}></textarea>
</div>

<style lang="scss">
    @import "../../styles/variables.scss";

    .textarea-container {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .textarea-input {
        padding: 12px 16px;
        border-radius: 8px;
        border: 1px solid $c-gray-outline;
        font-size: 14px;
        color: $c-black;
        background-color: $c-white;
        transition: all .1s ease-out;
        font-weight: 400;
        resize: none;

        &:focus {
            border-color: $c-blue;
        }
    }

    .label {
        font-size: 16px;
        color: $c-black;
    }
</style>