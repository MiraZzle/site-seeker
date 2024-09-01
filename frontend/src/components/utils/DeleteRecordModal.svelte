<script lang="ts">
    import Modal from "$components/utils/Modal.svelte";
    import Header from "$components/elements/typography/Header.svelte";
    import Paragraph from "$components/elements/typography/Paragraph.svelte";

    export let showModal = true;
    export let id = 0;
</script>

<Modal bind:open={showModal} width="600px">
    <Header type={2} color="black" textAlign="left">Record Deleted</Header>
    <Paragraph type={3} color="grayLight" textAlign="left">Record with ID {id} and all its Executions were deleted!</Paragraph>
</Modal>

