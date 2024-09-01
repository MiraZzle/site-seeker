<script lang="ts">
    import Modal from "$components/utils/Modal.svelte";
    import Header from "$components/elements/typography/Header.svelte";
    import TextInput from "$components/utils/TextInput.svelte";
    import Button from "$components/elements/typography/Button.svelte";
    import Paragraph from "$components/elements/typography/Paragraph.svelte";
    let showModal = true;
</script>

<div class="dummy-page">
    <Header type={1}>Modal</Header>
    <Paragraph>
        This is a modal component that can be used to <br> display content on top of the current page.
    </Paragraph>
    <Button type="dark" action={() => showModal = true}>Open Modal</Button>
</div>

<Modal bind:open={showModal} width="600px" closeOnEscape={true} closeOnOutsideClick={true}>
    <Header type={2}>Modal</Header>
    <TextInput id="Name" />
    <TextInput id="Email" />
    <Button type="dark" action={() => showModal = false}>Submit</Button>
</Modal>

<style>
    .dummy-page {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 16px;
        margin: 16px;
    }
</style>