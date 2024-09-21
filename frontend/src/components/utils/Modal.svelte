<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { createEventDispatcher } from 'svelte';
    import Cross from './icons/Cross.svelte';

    export let width: 'auto' | '600px' | '480px' = 'auto'; // Supports 'auto' and '600px'
    export let closeOnEscape: boolean = true;
    export let closeOnOutsideClick: boolean = true;
    export let closeOnCross: boolean = false;
    export let open: boolean = false;

    const dispatch = createEventDispatcher();

    const closeModal = () => {
        open = false;
        dispatch('close');
    };

    const handleEscape = (event: KeyboardEvent) => {
        if (closeOnEscape && event.key === 'Escape') {
            closeModal();
        }
    };

    const handleOverlayClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (closeOnOutsideClick && target.classList.contains('modal-overlay')) {
            closeModal();
        }
    };

    const handleOverlayKeydown = (event: KeyboardEvent) => {
        const target = event.target as HTMLElement;
        if (
            closeOnOutsideClick &&
            target.classList.contains('modal-overlay') &&
            (event.key === 'Enter' || event.key === ' ')
        ) {
            event.preventDefault();
            closeModal();
        }
    };

    onMount(() => {
        if (typeof window !== 'undefined' && closeOnEscape) {
            window.addEventListener('keydown', handleEscape);
        }
    });

    onDestroy(() => {
        if (typeof window !== 'undefined' && closeOnEscape) {
            window.removeEventListener('keydown', handleEscape);
        }
    });
</script>

{#if open}
    <div
        class="modal-overlay"
        tabindex="0"
        on:click={handleOverlayClick}
        on:keydown={handleOverlayKeydown}
    >
        <div class="modal modal--width-{width}">
            <button class="close-button" on:click={closeModal}> <Cross/> </button>
            <slot></slot>
        </div>
    </div>
{/if}


<style lang="scss">
    @import "../../styles/variables.scss";

    .close-button {
        background-color: transparent;
        border: none;
        cursor: pointer;
        padding: 0;
        margin: 0;
        align-self: flex-end;
        position: relative;
        top: 24px;
        margin-top: -24px;
    }

    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.25);
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(2px);
        z-index: 1000;
        outline: none; /* Remove default focus outline */
    }

    .modal {
        max-height: 90%;
        overflow-y: scroll;
        display: flex;
        margin: auto;
        flex-direction: column;
        padding: 24px;
        gap: 14px;
        color: $c-white;
        border: 1px solid $c-gray-outline;
        background-color: $c-white;
        border-radius: 8px;

        &--width-auto {
            width: auto;
        }

        &--width-600px {
            width: 600px;
        }

        &--width-480px {
            width: 480px;
        }
    }
</style>