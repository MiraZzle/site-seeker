<script lang="ts">
    import Modal from "./Modal.svelte";
    import Header from "$components/elements/typography/Header.svelte";
    import TextInput from "./TextInput.svelte";
    import Button from "$components/elements/typography/Button.svelte";

    export let showModal = false;
    export let action: (newTag : string) => void = (newTag = "My Test Tag") => {}
</script>

<Modal bind:open={showModal} width="600px">
    <Header type={2} color="black" textAlign="left">Add Tag to Search</Header>
    <TextInput description="Tag Name" placeholder="Enter Tag Name" />
    <Button type="dark" actionType="action" action={() => {action("My Test Tag"), showModal = false}}> Add Tag </Button>
</Modal>