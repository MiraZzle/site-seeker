<script lang="ts">
    import FeatureCard from "$components/elements/FeatureCard.svelte";
</script>

<div class="feature-card-container">
    <FeatureCard>
        <svelte:fragment slot="header"> Site Management </svelte:fragment>
        <svelte:fragment slot="description"> Easily manage your website records with full CRUD operations, keeping your web crawling tasks organized. </svelte:fragment>
    </FeatureCard>
</div>


<style lang="scss">

    .feature-card-container {
        display: flex;
        margin: 16px;
    }
</style>
