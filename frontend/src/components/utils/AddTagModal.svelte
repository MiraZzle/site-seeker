<script lang="ts">
    import Modal from "./Modal.svelte";
    import Header from "$components/elements/typography/Header.svelte";
    import TextInput from "./TextInput.svelte";
    import Button from "$components/elements/typography/Button.svelte";

    export let showModal = false;
    export let action: (newTag: string) => void = (newTag = "") => {};

    let newTag = "";
</script>

<Modal bind:open={showModal} width="600px" on:close={() => { newTag = ""; }}>
    <Header type={2} color="black" textAlign="left">Add Tag to Search</Header>
    <TextInput bind:value={newTag} description="Tag Name" placeholder="Enter Tag Name" />
    <Button type="dark" actionType="action" action={() => {
        action(newTag);
        newTag = "";
        showModal = false;
    }}> Add Tag </Button>
</Modal>
