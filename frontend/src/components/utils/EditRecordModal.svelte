<script lang="ts">
    import Modal from "./Modal.svelte";
    import TextInput from "./TextInput.svelte";
    import Button from "$components/elements/typography/Button.svelte";
    import Toggle from "./Toggle.svelte";
    import SelectInput from "./SelectInput.svelte";
    import Header from "$components/elements/typography/Header.svelte";
    import Paragraph from "$components/elements/typography/Paragraph.svelte";
    import TextAreaInput from "./TextAreaInput.svelte";

    const timeOptions = ["Seconds", "Minutes", "Hours", "Days"];
    
    // Export variables to populate the fields
    export let selectedTime = timeOptions[1];  // Default to "Minutes"
    export let showModal = true;
    export let startingUrl = "https://www.example.com/";
    export let boundaryRegExp = "^https://www.example.com";
    export let periodicity = "360";
    export let label = "";
    export let tags = "tag1, tag2";
    export let isActive = false;
</script>

<Modal bind:open={showModal} width="480px" closeOnEscape={true} closeOnOutsideClick={true}>
    <div class="modal-desc">
        <Header type={2} color="black" textAlign="center">Edit Existing Record</Header>
    </div>
    <TextInput description="Starting URL" bind:value={startingUrl} />
    <TextInput description="Boundary RegExp" bind:value={boundaryRegExp} />
    <div class="periodicity-container">
        <TextInput description="Periodicity" bind:value={periodicity} />
        <SelectInput options={timeOptions} bind:value={selectedTime} />
    </div>
    <TextInput description="Label" bind:value={label} placeholder="Enter a descriptive label" />
    <TextAreaInput id="tags" label="Tags" bind:value={tags} placeholder="Enter tags separated by commas" />
    <div class="active-container">
        <span class="active-container__label">Active</span>
        <Toggle bind:checked={isActive} />
    </div>
    <Button type="dark"> View all executions </Button>
    <div class="action-buttons">
        <Button type="dark" width="full"> Update Record </Button>
        <Button type="danger" width="full"> Delete Record </Button>
    </div>
</Modal>

<style lang="scss">
    @import "../../styles/variables.scss";

    .modal-desc {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .periodicity-container {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: end;
        gap: 8px;
        color: $c-black;
    }

    .active-container {
        display: flex;
        gap: 8px;
        align-items: center;
        justify-content: space-between;
        line-height: 140%;
        font-size: 16px;

        &__label {
            color: $c-black;
        }
    }

    .action-buttons {
        display: flex;
        justify-content: space-between;
        gap: 24px;

        button {
            width: 48%;
        }
    }
</style>
