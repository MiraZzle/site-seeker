<script lang="ts">
  import { apiDocsHref } from "$lib/api/navigation";
</script>

<footer class="footer">
  <div class="footer-links">
    <a href="/">Home</a>
    <a href={apiDocsHref} target="_blank">API</a>
    <a href="/">GitHub</a>
  </div>
</footer>

<style lang="scss">
  @import "../../styles/variables.scss";

  .footer {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px 0;
    border-top: 1px solid #d9d9d9;
  }

  .footer-links {
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: center;
    a {
      text-align: center;
      text-decoration: none;
      color: $c-black;
      font-size: 12px;
      font-weight: 400;
      line-height: 140%;
      padding: 8px;
      width: 48px;
    }
  }
</style>
