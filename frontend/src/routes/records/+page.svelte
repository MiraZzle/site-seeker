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
    import AddTagModal from "$components/utils/AddTagModal.svelte";

    import { goto } from "$app/navigation";
    import { writable } from "svelte/store";
    import { onMount } from "svelte";

    import { fetchWebsiteRecords } from "$lib/api/records";

    let websiteRecords: WebRecord[] = [];
    let filteredWebsiteRecords: WebRecord[] = [];
    let loading = true;
    let error = null;
    let currentRecord: WebRecord;

    // Execution
    let chosenRecordForExecution: number = 0;

    // Filters
    let filterURL = "";
    let filterLabel = "";
    let filterTags: string[] = [];

    let recordId = 1;
    let currentPage: number = 1;

    let createModalVisible = false;
    let tagModalVisible = false;
    let executionModalVisible = false;
    let editModalVisible = false;
    let deleteModalVisible = false;

    let tags: any[] = ["Test", "Automation", "Web"];

    let deletedRecordId = 0;

    function showCreateRecordModal() {
        createModalVisible = true;
    }

    function showDeleteModal(id: number) {
        deletedRecordId = id;
        deleteModalVisible = true;
    }

    function visualizeRecord(id: number) {
        recordId = id;
        goto(`/visualization/${id}`);
    }

    function removeRecordFromUI(id: number) {
        websiteRecords = websiteRecords.filter((record) => record.id !== id);
        filteredWebsiteRecords = filteredWebsiteRecords.filter(
            (record) => record.id !== id,
        );
        displayedRecords = displayedRecords.filter(
            (record) => record.id !== id,
        );
    }

    function showTagModal() {
        tagModalVisible = true;
    }

    function showEditModal(record: WebRecord) {
        currentRecord = record;
        editModalVisible = true;
    }

    async function showExecutionModal(websiteRecordId: number) {
        chosenRecordForExecution = websiteRecordId;
        executionModalVisible = true;

        try {
            // Send POST request to backend
            const response = await fetch(
                `http://localhost:3000/api/websiteRecords/start/${websiteRecordId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            // Check if the request was successful
            if (!response.ok) {
                throw new Error("Failed to start execution");
            }

            // Handle success (e.g., show a notification or log)
            console.log(
                `Execution of Record ${websiteRecordId} started successfully!`,
            );
        } catch (error) {
            // Handle error (e.g., show an error message or log)
            console.error("Error starting execution:", error);
        }
    }

    function addTag(tagName: string) {
        if (!filterTags.includes(tagName)) {
            filterTags = [...filterTags, tagName];
        }
    }

    function removeTag(tagName: string) {
        filterTags = filterTags.filter((tag) => tag !== tagName);
    }

    let recordsPerPage = 5;

    const sortingOptions = [
        "URL ascending",
        "URL descending",
        "Crawled ascending",
        "Crawled descending",
    ];

    let selectedSortingOption = writable(sortingOptions[0]);

    function handleSortSelect(option: string) {
        selectedSortingOption.set(option);
        loadRecords(1);
    }

    let displayedRecords: any[] = [];

    function loadRecords(newPage: number) {
        currentPage = newPage;

        // Apply filtering based on URL, Label, and Tags
        filteredWebsiteRecords = websiteRecords.filter((record) => {
            const matchesURL =
                !filterURL ||
                record.url.toLowerCase().includes(filterURL.toLowerCase());
            const matchesLabel =
                !filterLabel ||
                record.label.toLowerCase().includes(filterLabel.toLowerCase());
            const matchesTags =
                filterTags.length === 0 ||
                filterTags.every((tag) =>
                    record.tags.some(
                        (recordTag) =>
                            recordTag.toLowerCase() === tag.toLowerCase(),
                    ),
                ); // Compare tags case-insensitively

            return matchesURL && matchesLabel && matchesTags;
        });

        let sortedRecords = [...filteredWebsiteRecords]; // Make a copy of the filtered records

        // Apply sorting based on the selected sorting option
        if ($selectedSortingOption === "URL ascending") {
            sortedRecords.sort((a, b) => a.url.localeCompare(b.url));
        } else if ($selectedSortingOption === "URL descending") {
            sortedRecords.sort((a, b) => b.url.localeCompare(a.url));
        } else if ($selectedSortingOption === "Crawled ascending") {
            sortedRecords.sort((a, b) => {
                const timeA = a.latestExecution?.startTime || "";
                const timeB = b.latestExecution?.startTime || "";
                return new Date(timeA).getTime() - new Date(timeB).getTime();
            });
        } else if ($selectedSortingOption === "Crawled descending") {
            sortedRecords.sort((a, b) => {
                const timeA = a.latestExecution?.startTime || "";
                const timeB = b.latestExecution?.startTime || "";
                return new Date(timeB).getTime() - new Date(timeA).getTime();
            });
        }

        // Paginate the sorted records
        const start = (currentPage - 1) * recordsPerPage;
        const end = start + recordsPerPage;
        displayedRecords = sortedRecords.slice(start, end);
    }

    async function getWebsiteRecords(currentPage: number) {
        websiteRecords = await fetchWebsiteRecords();
        loadRecords(currentPage);
    }

    onMount(async () => {
        try {
            loading = true;
            await getWebsiteRecords(currentPage);
        } catch (err: any) {
            error = err.message;
        } finally {
            loading = false;
        }
    });

    function handleFilter() {
        console.log(filterLabel);
        loadRecords(1);
    }
</script>

<AddTagModal bind:showModal={tagModalVisible} action={addTag} />
<AddRecordModal
    bind:showModal={createModalVisible}
    getWebsiteRecords={() => getWebsiteRecords(currentPage)}
/>
<ExecutionStartedModal
    bind:showModal={executionModalVisible}
    id={chosenRecordForExecution}
/>
{#key currentRecord?.id}
    <EditRecordModal
        bind:showModal={editModalVisible}
        record={currentRecord}
        {getWebsiteRecords}
        {currentPage}
        {showDeleteModal}
        onDeleteSuccess={removeRecordFromUI}
    />
{/key}
<DeleteRecordModal bind:showModal={deleteModalVisible} id={deletedRecordId} />

<Navbar activePage="Records" />
<div class="records-cta">
    <Header type={3}>Your Web Records</Header>
    <Button
        type="primary"
        actionType="action"
        action={() => showCreateRecordModal()}
    >
        Create Website Record
    </Button>
</div>
<div class="records-view">
    <Card>
        <TextInput bind:value={filterURL} description="URL" id="url" />
        <TextInput bind:value={filterLabel} description="Label" id="label" />
        Tags
        <div class="records-view__tags">
            {#each filterTags as tag}
                <Tag name={tag} removeTagAction={removeTag} />
            {/each}
            <TagButton action={showTagModal} />
            <!-- Otevře modal pro přidání tagů -->
        </div>
        <Button type="dark" action={handleFilter}>Filter</Button>
    </Card>
    <div class="records-view__pagination-container">
        <div class="records-view__pagination-container__sorting">
            <SortOptions
                options={sortingOptions}
                bind:selectedOption={$selectedSortingOption}
                onSelect={handleSortSelect}
            />
        </div>
        <div class="records-view__pagination-container__records">
            {#each displayedRecords as record}
                <RecordCard
                    id={record.id}
                    label={record.label}
                    periodicity={record.periodicity}
                    tags={record.tags}
                    time={new Date(
                        record.latestExecution?.startTime,
                    ).toString()}
                    status={record.latestExecution?.status}
                    startAction={() => showExecutionModal(record.id)}
                    editAction={() => showEditModal(record)}
                    showAction={() => {
                        visualizeRecord(record.id);
                    }}
                />
            {/each}
        </div>
        <div class="records-view__pagination-container__bar">
            <PaginationBar
                perPage={recordsPerPage}
                {currentPage}
                records={filteredWebsiteRecords}
                onPageChange={loadRecords}
            />
        </div>
    </div>
</div>

<style lang="scss">
    @import "../../styles/variables.scss";

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
