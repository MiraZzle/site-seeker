<script lang="ts">
  import GitHub from "./icons/GitHub.svelte";
  import Button from "$components/elements/typography/Button.svelte";

  function goToGithub() {
    window.open("https://github.com/MiraZzle/site-seeker", "_blank");
  }
</script>

<Button type="dark" width="150" action={goToGithub}>
  <GitHub />
  GitHub
</Button>
