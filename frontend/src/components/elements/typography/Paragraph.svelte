<script lang="ts">
    import { colors } from '$types/colors.ts';
    import type { ColorType } from '$types/colors.ts';

    export let type: 1 | 2 | 3 | 4 = 1;
    export let textAlign: 'left' | 'center' | 'right' = 'center';
    export let color: ColorType = 'grayLight';


    $: actualColor = colors[color];
</script>

<svelte:element
    this="p"
    class="paragraph paragraph--{type}"
    style={`text-align: ${textAlign}; color: ${actualColor}`}
><slot/></svelte:element>

<style lang="scss">
    @import '../../../styles/variables.scss';

    .paragraph {
        font-size: 16px;
        font-weight: 400;
        line-height: 120%;
        margin: 0;

        &--1 {
            font-size: 32px;
        }

        &--2 {
            font-size: 20px;
        }

        &--3 {
            font-size: 14px;
            line-height: 140%;
        }

        &--4 {
            font-size: 16px;
            line-height: 140%;
        }
    }
</style>