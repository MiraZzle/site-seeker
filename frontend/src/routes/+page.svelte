<script lang="ts">
    import Navbar from "$components/web/Navbar.svelte";
    import FeatureCard from "$components/elements/FeatureCard.svelte";
    import Button from "$components/elements/typography/Button.svelte";
    import Header from "$components/elements/typography/Header.svelte";
    import Paragraph from "$components/elements/typography/Paragraph.svelte";
    import Explore from "$components/utils/icons/Explore.svelte";
    import Eye from "$components/utils/icons/Eye.svelte";
    import { goto } from "$app/navigation";

    function goToExecutions() {
        goto(`/executor`);
    }

    function goToRecords() {
        goto(`/records`);
    }
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
        <Button type="primary" action={goToRecords}><Explore /> Explore </Button>
        <Button type="secondary" action={goToExecutions}><Eye />  Visualize </Button>
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
            <svelte:fragment slot="header"> Editable Crawling </svelte:fragment>
            <svelte:fragment slot="description"> Set crawling boundaries with RegExp and define crawl frequency to capture relevant data tailored to your needs. </svelte:fragment>
        </FeatureCard>
                <FeatureCard>
            <svelte:fragment slot="header"> Execution Tracker </svelte:fragment>
            <svelte:fragment slot="description"> Monitor and manage all crawling executions with detailed logs and statuses to ensure smooth data collection. </svelte:fragment>
        </FeatureCard>
        <FeatureCard>
            <svelte:fragment slot="header"> Data Visualization </svelte:fragment>
            <svelte:fragment slot="description"> Visualize crawled data with interactive graphs. Switch between website and domain views for better insights. </svelte:fragment>
        </FeatureCard>
        <FeatureCard>
            <svelte:fragment slot="header"> GraphQL API </svelte:fragment>
            <svelte:fragment slot="description"> Access your crawled data seamlessly through a powerful GraphQL API for custom integrations and solutions. </svelte:fragment>
        </FeatureCard>
                <FeatureCard>
            <svelte:fragment slot="header"> Manual Execution </svelte:fragment>
            <svelte:fragment slot="description"> Start crawls manually with one click, ensuring timely data updates whenever needed.
            </svelte:fragment>
        </FeatureCard>
    </div>
</div>

<style lang="scss">
    @import "../styles/variables.scss";

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
            flex-wrap: wrap;
            justify-content: center;
            gap: 64px;
            max-width: 1200px;
        }
    }
</style>