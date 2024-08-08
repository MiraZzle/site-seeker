<script lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
    export let type: 'primary' | 'secondary' | 'dark' | 'danger' = 'primary';
    let btnType = `btn_${type}`;
</script>

<button class="btn {btnType}">
    <slot></slot>
</button>

<style lang="scss">
    @import '../../../styles/variables.scss';

    .btn {
        display: flex;
        border-radius: 8px;
        padding: 12px;
        border: none;
        gap: 8px;

        &_primary {
            background-color: $c-blue;
            color: $c-white;
        }
        &_secondary {
            background: none;
            border: 1px solid $c-gray-dark;
            color: $c-gray-dark;
        }
        &_dark {
            background-color: $c-gray-dark;
            color: $c-white;
        }
        &_danger {
            background-color: $c-red;
            color: $c-white;
        }
    }
</style>