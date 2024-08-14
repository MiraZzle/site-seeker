<script lang="ts">
    import Button from "$components/elements/typography/Button.svelte";
    import Plus from "./icons/Plus.svelte";
    export let action: () => void = () => {};
</script>

<Button type="dark" actionType="action" action={action}> Add Tag <Plus/> </Button>