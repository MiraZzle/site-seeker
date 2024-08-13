<script lang="ts">

</script>

<div class="card shadow">
    <slot></slot>
</div>

<style lang="scss">
    @import '../../styles/variables.scss';

    .card {
        display: flex;
        flex-direction: column;
        gap: 24px;
        background-color: $c-white;
        border-radius: 8px;
        padding: 16px;
        border-width: 1px;
        border-style: solid;
        border-color: #D9D9D9;
        width: 240px;
        height: fit-content;
    }
</style>