<script lang="ts">
    import Modal from "./Modal.svelte";
    import TextInput from "./TextInput.svelte";
    import Button from "$components/elements/typography/Button.svelte";
    import Toggle from "./Toggle.svelte";
    import SelectInput from "./SelectInput.svelte";
    import Header from "$components/elements/typography/Header.svelte"
    import Paragraph from "$components/elements/typography/Paragraph.svelte"
    import TextAreaInput from "./TextAreaInput.svelte";

    const timeOptions = ["Seconds", "Minutes", "Hours", "Days"];
    export let selectedTime = timeOptions[0];
    export let showModal = false;
</script>

<Modal bind:open={showModal} width="480px" closeOnEscape={true} closeOnOutsideClick={true}>
    <div class="modal-desc">
        <Header type={2} color="black" textAlign="center">Add New Site Record</Header>
        <Paragraph type={3} color="grayLight" textAlign="center">Define Settings for Crawling</Paragraph>
    </div>
    <TextInput description="Starting URL" placeholder="https://www.example.com/" />
    <TextInput description="Boundary RegExp" placeholder="^https://www.example.com" />
    <div class="periodicity-container">
        <TextInput description="Periodicity" placeholder="Time" />
        <SelectInput options={timeOptions} bind:value={selectedTime} />
    </div>
    <TextInput description="Label" placeholder="Enter a descriptive label" />
    <TextAreaInput id="tags" label="Tags" placeholder="Enter tags separated by commas" />
    <div class="active-container">
        <span class="active-container__label">Active</span>
        <Toggle />
    </div>
    <Button type="dark"> Add Record </Button>
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
</style>