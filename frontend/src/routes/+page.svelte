<script lang="ts">
    import Button from "$components/elements/typography/Button.svelte";
    import Paragraph from "$components/elements/typography/Paragraph.svelte";
    import Header from "$components/elements/typography/Header.svelte";

    const funPages = [
        "https://www.youtube.com/watch?v=2aiGY74UStY",
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "https://www.youtube.com/watch?v=qCmRga2fIy0",
        "https://www.youtube.com/watch?v=U0LjDZGMzMY",
        "https://www.youtube.com/watch?v=i4NOEx2-6xk"
    ]

    let ourFunPage = funPages[Math.floor(Math.random() * funPages.length)];

    function goToPage() {
        window.location.href = '/web/home/';
    }

    function haveSomeFun() {
        window.location.href = ourFunPage;
    }
</script>

<div class="hello-container">

    <Header>Riddle Me This, Shitman: Can You Crack the Code or Will You Fold?</Header>
    <Paragraph> Morpheus guides through the digital night, <br>
        Where Skibidi Toilets dance in the light. <br>
        In the chaos of code, truth he finds, <br>
        Unlocking the freedom within our minds.
    </Paragraph>
    <img src="https://mmacoach.net/wp-content/uploads/2021/04/kisspng-morpheus-the-matrix-neo-red-pill-and-blue-pill-you-good-pills-will-play-5adf94a99c4d73.4062390915246020256402.png" alt="Svelte logo" width="200" />
    <div class="hello-container__buttons">
        <Button type="primary" action={goToPage}> 😇 Click me! </Button>
        <Button type="danger" action={haveSomeFun}> 😈 No Click me! </Button>
    </div>
</div>

<style lang="scss">

    .hello-container {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: auto;
        flex-direction: column;
        gap:8px;

        &__buttons {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 12px;
        }
    }
</style>
