<script lang="ts">
    import Paragraph from "$components/elements/typography/Paragraph.svelte";
    import { colors } from '$types/colors.ts';
</script>

<div class="paragraph-container">
    <Paragraph type={1} color="grayLight"> Type1 </Paragraph>
    <Paragraph type={2} color="blue"> Type2 </Paragraph>
    <Paragraph type={3} color="red"> Type3 </Paragraph>
    <Paragraph type={4} color="black"> Type4 </Paragraph>
</div>

<style lang="scss">
    @import '../../../styles/variables.scss';

    .paragraph-container {
        margin: 20px;
        padding: 10px;
    }
</style>