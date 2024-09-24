<script lang="ts">
  import Modal from "$components/utils/Modal.svelte";
  import Header from "$components/elements/typography/Header.svelte";
  import Paragraph from "$components/elements/typography/Paragraph.svelte";

  export let showModal = false;
  export let id = 0;
</script>

<Modal bind:open={showModal} width="600px">
  <Header type={2} color="black" textAlign="left">Execution Started</Header>
  <Paragraph type={3} color="grayLight" textAlign="left"
    >Execution of Record {id} started!</Paragraph
  >
</Modal>
