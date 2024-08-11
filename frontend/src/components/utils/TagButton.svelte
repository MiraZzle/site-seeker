<script lang="ts">
    import Button from "$components/elements/typography/Button.svelte";
    import Plus from "./icons/Plus.svelte";

    function addTag() {
        console.log("Tag added");
    }
</script>

<Button type="dark" action={addTag}> Add Tag <Plus/> </Button>