<script lang="ts">
  import Logo from "$components/utils/Logo.svelte";
  import GithubButton from "$components/utils/GithubButton.svelte";

  export let activePage: "Home" | "Records" | "Executor" | "Api" | "" = "Home";
</script>

<nav class="navbar">
  <div class="nav-container">
    <Logo />
    <div class="nav-container-links">
      <div class="page-nav">
        <a class="nav-link {activePage === 'Home' ? 'active' : ''}" href="/">Home</a>
        <a class="nav-link {activePage === 'Records' ? 'active' : ''}" href="/records">Records</a>
        <a class="nav-link {activePage === 'Executor' ? 'active' : ''}" href="/executor">Executor</a
        >
        <a
          class="nav-link {activePage === 'Api' ? 'active' : ''}"
          href="http://localhost:3000/api-docs/"
          target="_blank">API</a
        >
      </div>
      <GithubButton />
    </div>
  </div>
</nav>

<style lang="scss">
  @import "../../styles/variables.scss";

  .navbar {
    display: flex;
    justify-content: center;
    padding: 24px;
    border-bottom: 1px solid $c-gray-outline;
  }

  .nav-container {
    max-width: 1200px;
    display: flex;
    justify-content: space-between;
    width: 100%;

    &-links {
      display: flex;
      gap: 24px;
      align-items: right;
      justify-content: center;
    }
  }

  .page-nav {
    display: flex;
    gap: 8px;
    width: max-content;
    align-items: center;

    .nav-link {
      text-decoration: none;
      color: $c-black;
      font-size: 16px;
      font-weight: 400;
      padding: 8px;
      border-radius: 8px;
      transition: background-color 0.2s;

      &.active {
        background-color: $c-gray-bg;
        color: $c-black;
      }
    }
  }
</style>
