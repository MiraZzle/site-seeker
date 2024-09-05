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
    import AddRecordModal from "$components/utils/AddRecordModal.svelte";
    import ExecutionStartedModal from "$components/utils/ExecutionStartedModal.svelte";
    import EditRecordModal from "$components/utils/EditRecordModal.svelte";
    import DeleteRecordModal from "$components/utils/DeleteRecordModal.svelte";
    import AddTagModal from "$components/utils/AddTagModal.svelte"

    import { goto } from '$app/navigation';
    import { writable } from 'svelte/store';
    import { onMount } from 'svelte';

    let recordId = 1;
    let currentPage: number = 1;
    const dummyRecords : any[] = [
        1,2,3,4,5,6,7,8,9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32
    ]

    let createModalVisible = false;
    let tagModalVisible = false;
    let executionModalVisible = false;
    let editModalVisible = false;
    let deleteModalVisible = false;

    let tags : any[] = ["Test", "Automation", "Web"];


    function visualizeRecord(id: number) {
        recordId = id;
        goto(`/web/visualization/${id}`);
    }

    function showTagModal(){
        tagModalVisible = true;
    }

    function showEditModal(){
        editModalVisible = true;
    }

    function showExecutionModal(){
        executionModalVisible = true;
    }

    function addTag(tagName: string) {
        tags = [...tags, tagName];
    }

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

    let selectedSortingOption = writable(sortingOptions[0]);

    function handleSortSelect(option: string) {
        console.log('Selected option', option);
        selectedSortingOption.set(option);
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

    function handleFilter() {
        console.log('Filtering records');
    }

</script>

<AddTagModal bind:showModal={tagModalVisible} action={addTag}/>
<AddRecordModal bind:showModal={createModalVisible}/>
<ExecutionStartedModal bind:showModal={executionModalVisible}/>
<EditRecordModal bind:showModal={editModalVisible}/>
<DeleteRecordModal bind:showModal={deleteModalVisible} id={recordId}/>

<Navbar activePage="Records"/>
<div class="records-cta">
    <Header type={3}> Your Web Records </Header>
    <Button type="primary" actionType="action" action={() => {createModalVisible = true}}> Create Website Record </Button>
</div>
<div class="records-view">
    <Card>
        <TextInput description="URL" id="url"/>
        <TextInput description="Label" id="label"/>
        Tags
        <div class="records-view__tags">
            <TagButton action={() => {tagModalVisible = true}}/>
            {#each tags as tag}
                <Tag name={tag} removeTagAction={removeTag}/>
            {/each}
        </div>
        <Button type="dark"> Filter </Button>
    </Card>
    <div class="records-view__pagination-container">
        <div class="records-view__pagination-container__sorting">
            <SortOptions options={sortingOptions} bind:selectedOption={$selectedSortingOption} onSelect={handleSortSelect} />
        </div>
        <div class="records-view__pagination-container__records">
            {#each displayedRecords as record}
            <!-- az budeme mit displayed records jako datovy typ z query - tak passneme do visualizeRecord(id) id toho recordu -->
                <RecordCard label={record} startAction={showExecutionModal} editAction={showEditModal} showAction={() =>{visualizeRecord(1)}}/>
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