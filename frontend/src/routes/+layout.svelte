<script lang="ts">
    import '$styles/global.scss';
    import Footer from '$components/web/Footer.svelte';
</script>

<div id="page-content">
    <div>
        <slot />
    </div>
    <Footer />
</div>