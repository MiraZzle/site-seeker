<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let checked: boolean = false;
    export let disabled: boolean = false;

    const dispatch = createEventDispatcher();

    function toggle() {
        if (!disabled) {
            checked = !checked;
            dispatch('change', { checked });
        }
    }
</script>

<div
    class="toggle {checked ? 'toggle--checked' : ''} {disabled ? 'toggle--disabled' : ''}"
    role="switch"
    aria-checked={checked}
    tabindex="0"
    on:click={toggle}
    on:keydown={(e) => e.key === 'Enter' || e.key === ' ' ? toggle() : null}
></div>


<style lang="scss">
    .toggle {
        position: relative;
        width: 40px;
        height: 24px;
        background-color: #2c2c2c;
        border-radius: 24px;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .toggle::before {
        content: '';
        position: absolute;
        width: 20px;
        height: 20px;
        background-color: #fff;
        border-radius: 50%;
        top: 50%;
        left: 2px;
        transform: translateY(-50%);
        transition: transform 0.3s;
    }

    .toggle--checked {
        background-color: CornflowerBlue;
    }

    .toggle--checked::before {
        transform: translate(16px, -50%);
    }

    .toggle--disabled {
        background-color: #1a1a1a;
        cursor: not-allowed;
    }
</style>