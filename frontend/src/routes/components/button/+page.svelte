<script lang="ts">
    import Button from "$components/elements/typography/Button.svelte";
    import Explore from "$components/utils/icons/Explore.svelte"
    import Eye from "$components/utils/icons/Eye.svelte";
</script>

<div class='btn-container'>
    <Button type="primary"><Explore /> Primary </Button>
    <Button type="secondary"><Eye /> Secondary</Button>
    <Button type="dark">Dark</Button>
    <Button type="danger">Danger</Button>
</div>

<style lang="scss">
    @import '../../../styles/variables.scss';

    .btn-container {
        padding: 10px;
        display: flex;
        gap: 8px;
    }
</style>