<script lang="ts">
    import Info from "$components/utils/icons/Info.svelte";
    import Header from "$components/elements/typography/Header.svelte";
    import Paragraph from "$components/elements/typography/Paragraph.svelte";
</script>

<div class="feature-card shadow">
    <div class="feature-card__icon">
        <Info />
    </div>
    <div class="feature-card__content">
        <Header type={2} color="black" textAlign="left"> <slot name="header"> 123 </slot> </Header>
        <Paragraph type={3} color="grayLight" textAlign="left"> <slot name="description"> aaa </slot> </Paragraph>
    </div>
</div>

<style lang="scss">
    @import "../../styles/variables.scss";

    .feature-card {
        display: flex;
        align-items: center;
        padding: 24px;
        gap: 24px;
        border-radius: 8px;
        width: calc(314px - 2*24px);
        height: calc(165px - 2*24px);
        border-width: 1px;
        border-style: solid;
        border-color: #D9D9D9;

        &__icon {
            display: flex;
            align-items:flex-start;
            height: 100%;
        }

        &__content {
            gap: 8px;
            display: flex;
            flex-direction: column;
        }
    }
</style>