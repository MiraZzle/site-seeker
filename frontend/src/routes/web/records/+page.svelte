<script lang="ts">
    import Header from "$components/elements/typography/Header.svelte";
    import Navbar from "$components/web/Navbar.svelte";
    import Footer from "$components/web/Footer.svelte";
    import Button from "$components/elements/typography/Button.svelte";
    import SortOptions from "$components/utils/SortOptions.svelte";
    import RecordCard from "$components/elements/RecordCard.svelte";
    import Card from "$components/utils/Card.svelte";
    import TextInput from "$components/utils/TextInput.svelte";
    import PaginationBar from "$components/elements/PaginationBar.svelte";
    import TagButton from "$components/utils/TagButton.svelte";
    import Tag from "$components/utils/Tag.svelte";

    import { writable } from 'svelte/store';
    import { onMount } from 'svelte';

    let currentPage: number = 1;
    const dummyRecords : any[] = [
        1,2,3,4,5,6,7,8,9
    ]

    let tags : any[] = ["Test", "Automation", "Web"];

    function removeTag(tagName: string) {
        console.log('Removing tag', tagName);
        tags = tags.filter(tag => tag !== tagName);
    }

    let totalRecords = dummyRecords.length;

    const sortingOptions = [
        'URL ascending',
        'URL descending',
        'Crawled ascending',
        'Crawled descending'
    ];

    let selectedOption = writable(sortingOptions[0]);

    function handleSelect(option: string) {
        selectedOption.set(option);
    }

    let displayedRecords : any[] = [];

    function loadRecords(newPage: number) {
        console.log('Loading records');
        currentPage = newPage;
        console.log('Current page', currentPage);
        let topRange = currentPage * 5 < totalRecords ? currentPage * 5 : totalRecords;
        displayedRecords = dummyRecords.slice((currentPage - 1) * 5, topRange);
        console.log(displayedRecords);
        return displayedRecords;
    }


    onMount(() => {
        loadRecords(currentPage);
    });
</script>

<Navbar />
<div class="records-cta">
    <Header type={3}> Your Web Records </Header>
    <Button type="primary"> Create Website Record </Button>
</div>
<div class="records-view">
    <Card>
        <TextInput description="URL" id="url"/>
        <TextInput description="Label" id="label"/>
        Tags
        <div class="records-view__tags">
            <TagButton/>
            {#each tags as tag}
                <Tag name={tag} removeTagAction={removeTag}/>
            {/each}
        </div>
        <Button type="dark"> Filter </Button>
    </Card>
    <div class="records-view__pagination-container">
        <div class="records-view__pagination-container__sorting">
            <SortOptions options={sortingOptions} bind:selectedOption={$selectedOption} onSelect={handleSelect} />
        </div>
        <div class="records-view__pagination-container__records">
            {#each displayedRecords as record}
                <RecordCard label={record}/>
            {/each}
        </div>
        <div class="records-view__pagination-container__bar">
            <PaginationBar perPage={5} currentPage={currentPage} records={dummyRecords} onPageChange={loadRecords}/>
        </div>
    </div>
</div>
<Footer />

<style lang="scss">
    @import '../../../styles/variables.scss';

    .records-cta {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 96px 0;
        background-color: $c-gray-bg;
        gap: 12px;
    }

    .records-view {
        margin: auto;
        max-width: 1200px;
        display: flex;
        padding: 32px;
        gap: 64px;
        flex-direction: row;

        &__tags {
            display: flex;
            gap: 4px;
            flex-wrap: wrap;
        }

        &__pagination-container {
            display: flex;
            flex-direction: column;
            gap: 48px;
            width: 100%;

            &__sorting {
                display: flex;
                justify-content: flex-end;
            }

            &__records {
                display: flex;
                flex-direction: column;
                gap: 24px;
            }

            &__bar {
                display: flex;
                justify-content: center;
            }
        }
    }
</style>