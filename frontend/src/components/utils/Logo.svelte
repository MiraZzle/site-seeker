<script lang="ts">
  import Icon from "$components/utils/icons/Icon.svelte";
</script>

<a href="/web/home" class="logo-container">
  <Icon />
  <span class="logo-name">SiteSeeker</span>
</a>

<style lang="scss">
  @import "../../styles/variables.scss";

  .logo-container {
    display: flex;
    align-items: center;
    gap: 6px;

    .logo-name {
      font-size: 24px;
      line-height: 120%;
      letter-spacing: -0.5px;
      font-weight: 600;
      text-decoration: none;
      color: $c-black;
    }
  }
</style>
