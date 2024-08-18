<script lang="ts">
    import Navbar from "$components/web/Navbar.svelte";
    import Footer from "$components/web/Footer.svelte";
    import Header from "$components/elements/typography/Header.svelte";
    import SelectInput from "$components/utils/SelectInput.svelte";
    import Button from "$components/elements/typography/Button.svelte";
    import Card from "$components/utils/Card.svelte";
    import Toggle from "$components/utils/Toggle.svelte";

    let dummyOptions = ["Option 1", "Option 2", "Option 3"];

    let liveMode : boolean = false;
    let domainMode : boolean = false;
</script>


<Navbar activePage="Visualization"/>
<div class="visualization-i-container">
    <div class="visualization-i-info">
        <Header type={3}> Visualization </Header>
        <SelectInput options={dummyOptions} value="Option 1" />
        <Button type="primary" width="full"> Display </Button>
    </div>
</div>
<Footer />

<style lang="scss">
    @import "../../../styles/variables.scss";
    .visualization {
        &-i {
            &-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 96px 0;
                background-color: $c-gray-bg;
            }

            &-info {
                display: flex;
                gap: 12px;
                flex-direction: column;
            }
        }
    }
</style>