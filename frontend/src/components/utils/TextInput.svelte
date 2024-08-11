<script lang="ts">
    export let value = '';
    export let id = '';
    export let placeholder = 'Value';
    export let description = 'Label';
    export let type : 'text' | 'password' | 'number' = 'text';
</script>

<div class="input-block">
<label for={id} class="input-block__label">
    {description}
</label>
<input id={id} type={type} value={value} placeholder={placeholder} class="input-block__input" />
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
            width: 100%;
        }
    }
</style>