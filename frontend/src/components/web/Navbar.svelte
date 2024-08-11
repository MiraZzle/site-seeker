<script lang="ts">
    import Logo from "$components/utils/Logo.svelte";
    import GithubButton from "$components/utils/GithubButton.svelte";
</script>

<nav class="navbar">
    <Logo />

    <div class="nav-container">
    <div class="page-nav">
        <a class="nav-link" href="/">Home</a>
        <a class="nav-link" href="/records">Records</a>
        <a class="nav-link" href="/executor">Executor</a>
        <a class="nav-link" href="/visualization">Visualization</a>
        <a class="nav-link" href="/api">API</a>
    </div>
    <GithubButton/>
    </div>
</nav>

<style lang="scss">
    @import "../../styles/variables.scss";

    .navbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 32px;
        border-bottom: 1px solid #d9d9d9;
    }

    .nav-container {
        display: flex;
        gap: 24px;
        align-items: right;
        justify-content: center;
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
        }
    }
</style>