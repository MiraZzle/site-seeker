<script lang="ts">
    export let label = '';
    export let checked = false;
</script>

<div class="checkbox-container">
    <input id={label} type="checkbox" bind:checked={checked} class="checkbox-container__input" />
    <label for={label} class="checkbox-container__label">
        {label}
    </label>
</div>

<style lang="scss">
    @import "../../styles/variables.scss";

    .checkbox-container {
        display: flex;
        gap: 12px;
        align-items: left;
        &__label {
            font-size: 16px;
            line-height: 140%;
            font-weight: 400;
            color: $c-black;
        }
        &__input {
            border: 1px solid $c-gray-outline;
            border-radius: 4px;
            margin: 0;
        }

        input[type="checkbox"]:checked {
            accent-color: $c-black;
        }
    }


</style>

