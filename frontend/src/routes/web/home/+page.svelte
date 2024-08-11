<script lang="ts">
    import Navbar from "$components/web/Navbar.svelte";
    import Footer from "$components/web/Footer.svelte";
    import FeatureCard from "$components/elements/FeatureCard.svelte";
    import Button from "$components/elements/typography/Button.svelte";
    import Header from "$components/elements/typography/Header.svelte";
    import Paragraph from "$components/elements/typography/Paragraph.svelte";
    import Explore from "$components/utils/icons/Explore.svelte";
    import Eye from "$components/utils/icons/Eye.svelte";
</script>

<Navbar />
<div class="hero">
    <div class="hero-content">
        <Header type={1}> Crawl the <span class="highlight--blue">Web</span> Today</Header>
        <Paragraph>
            Effortlessly Manage, Execute, <br/>
            and Visualize Web Data
        </Paragraph>
    </div>
    <div class="hero-buttons">
        <Button type="primary"><Explore /> Explore </Button>
        <Button type="secondary"><Eye />  Visualize </Button>
    </div>
</div>
<div class="features">
    <div class="features-description">
        <Header type={2} textAlign="center">Features</Header>
        <Paragraph textAlign="center" type={2}>
            Unlock the Full Potential of Web Crawling
        </Paragraph>
    </div>
    <div class="features-cards">
        <FeatureCard>
            <svelte:fragment slot="header"> Site Management </svelte:fragment>
            <svelte:fragment slot="description"> Easily manage your website records with full CRUD operations, keeping your web crawling tasks organized. </svelte:fragment>
        </FeatureCard>
        <FeatureCard>
            <svelte:fragment slot="header"> Site Management </svelte:fragment>
            <svelte:fragment slot="description"> Easily manage your website records with full CRUD operations, keeping your web crawling tasks organized. </svelte:fragment>
        </FeatureCard>
                <FeatureCard>
            <svelte:fragment slot="header"> Site Management </svelte:fragment>
            <svelte:fragment slot="description"> Easily manage your website records with full CRUD operations, keeping your web crawling tasks organized. </svelte:fragment>
        </FeatureCard>
    </div>
    <div class="features-cards">
        <FeatureCard>
            <svelte:fragment slot="header"> Site Management </svelte:fragment>
            <svelte:fragment slot="description"> Easily manage your website records with full CRUD operations, keeping your web crawling tasks organized. </svelte:fragment>
        </FeatureCard>
        <FeatureCard>
            <svelte:fragment slot="header"> Site Management </svelte:fragment>
            <svelte:fragment slot="description"> Easily manage your website records with full CRUD operations, keeping your web crawling tasks organized. </svelte:fragment>
        </FeatureCard>
                <FeatureCard>
            <svelte:fragment slot="header"> Site Management </svelte:fragment>
            <svelte:fragment slot="description"> Easily manage your website records with full CRUD operations, keeping your web crawling tasks organized. </svelte:fragment>
        </FeatureCard>
    </div>
</div>
<Footer />

<style lang="scss">
    @import "../../../styles/variables.scss";

    .hero {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: column;
        padding: 96px 0;
        background-color: $c-gray-bg;
        gap: 24px;

        .hero-content {
            width: 70%;
            gap: 8px;
        }

        .hero-buttons {
            display: flex;
            gap: 16px;
        }
    }

    .features {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 64px;
        gap: 32px;

        .features-description {
            display: flex;
            flex-direction: column;
            align-items: left;
            justify-content: left;
            text-align: left;
            gap: 8px;
            width: 100%;
        }

        .features-cards {
            display: flex;
            gap: 64px;
        }
    }
</style>