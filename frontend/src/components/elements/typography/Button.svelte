<script lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
    export let type: 'primary' | 'secondary' | 'dark' | 'danger' = 'primary';
    export let width: 'full' | 'auto' | '150' = 'auto';
    let btnType = `btn_${type}`;
    let btnWidth = `btn-width_${width}`;
</script>

<button class="btn {btnType} {btnWidth}">
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
        justify-content: center;
        align-items: center;

        &.btn-width_full {
            width: 100%;
        }

        &.btn-width_auto {
            width: auto;
        }

        &.btn-width_150 {
            width: 150px;
            padding: 0;
        }

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