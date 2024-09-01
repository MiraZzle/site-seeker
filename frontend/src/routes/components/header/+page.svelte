<script lang="ts">
    import Header from "$components/elements/typography/Header.svelte";
</script>

<div class='header-container'>
    <Header type={1} color="black">Header 1</Header>
    <Header type={2} color="blue">Header 2</Header>
    <Header type={3} color="red">Header 3</Header>
</div>

<style lang="scss">
    .header-container {
        padding: 10px;
        display: flex;
        gap: 8px;
    }
</style>