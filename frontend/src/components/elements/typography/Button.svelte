<script lang="ts">
    export let type: 'primary' | 'secondary' | 'dark' = 'primary';
    let btnType = `btn_${type}`;
</script>

<button class="btn {btnType}">
    <slot></slot>
</button>

<style lang="scss">
    .btn {
        display: flex;
        border-radius: 8px;
        padding: 12px;
        border: none;
        gap: 8px;

        &_primary {
            background-color: #007bff;
            color: #fff;
        }
        &_secondary {
            background-color: #6c757d;
            color: #fff;
        }
        &_dark {
            background-color: #343a40;
            color: #fff;
        }
    }
</style>