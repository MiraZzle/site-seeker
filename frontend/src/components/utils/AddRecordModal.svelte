<script lang="ts">
    import Modal from "./Modal.svelte";
    import TextInput from "./TextInput.svelte";
    import Button from "$components/elements/typography/Button.svelte";
    import Toggle from "./Toggle.svelte";
    import SelectInput from "./SelectInput.svelte";
    import Header from "$components/elements/typography/Header.svelte";
    import Paragraph from "$components/elements/typography/Paragraph.svelte";
    import TextAreaInput from "./TextAreaInput.svelte";

    const timeOptions = ["Seconds", "Minutes", "Hours", "Days"];
    export let currentPage;
    export let getWebsiteRecords;
    export let selectedTime = timeOptions[0];
    export let showModal = false;

    // Form data
    let url = "";
    let boundaryRegExp = "";
    let periodicity = "";
    let label = "";
    let tags = "";
    let isActive = false;

    // Submit function
    async function addRecord() {
        // Convert periodicity to seconds based on the selected time unit
        let periodicityInSeconds = parseFloat(periodicity); // Parse the input to a number

        switch (selectedTime) {
            case "Minutes":
                periodicityInSeconds *= 60;
                break;
            case "Hours":
                periodicityInSeconds *= 3600; // 60 * 60
                break;
            case "Days":
                periodicityInSeconds *= 86400; // 60 * 60 * 24
                break;
            // No need to multiply for seconds since it's the base unit
        }

        const newRecord = {
            url,
            boundaryRegExp,
            periodicity: periodicityInSeconds, // Use the calculated periodicity in seconds
            label,
            tags: tags.split(",").map((tag) => tag.trim()), // Split tags by comma and trim
            isActive,
        };

        try {
            const response = await fetch(
                "http://localhost:3000/api/websiteRecords/add",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newRecord),
                },
            );

            if (response.ok) {
                const result = await response.json();
                console.log("Record added:", result);
                getWebsiteRecords(currentPage); // Reload records after successful addition
                showModal = false; // Close modal after success

                // Clear the form fields
                url = "";
                boundaryRegExp = "";
                periodicity = "";
                label = "";
                tags = "";
                isActive = false;
                selectedTime = timeOptions[0]; // Reset selected time to default
            } else {
                console.error("Failed to add record:", response.statusText);
            }
        } catch (error) {
            console.error("Error adding record:", error);
        }
    }
</script>

<Modal
    bind:open={showModal}
    width="480px"
    closeOnEscape={true}
    closeOnOutsideClick={true}
>
    <div class="modal-desc">
        <Header type={2} color="black" textAlign="center">Add New Site Record</Header>
        <Paragraph type={3} color="grayLight" textAlign="center">Define Settings for Crawling</Paragraph>
    </div>
    <TextInput
        bind:value={url}
        description="Starting URL"
        placeholder="https://www.example.com/"
    />
    <TextInput
        bind:value={boundaryRegExp}
        description="Boundary RegExp"
        placeholder="^https://www.example.com"
    />
    <div class="periodicity-container">
        <TextInput
            bind:value={periodicity}
            description="Periodicity"
            placeholder="Time"
        />
        <SelectInput options={timeOptions} bind:value={selectedTime} />
    </div>
    <TextInput
        bind:value={label}
        description="Label"
        placeholder="Enter a descriptive label"
    />
    <TextAreaInput
        bind:value={tags}
        id="tags"
        label="Tags"
        placeholder="Enter tags separated by commas"
    />
    <div class="active-container">
        <span class="active-container__label">Active</span>
        <Toggle bind:checked={isActive} />
    </div>
    <Button type="dark" actionType="submit" action={addRecord}>
        Add Record
    </Button>
</Modal>

<style lang="scss">
    @import "../../styles/variables.scss";

    .modal-desc {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .periodicity-container {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: end;
        gap: 8px;
        color: $c-black;
    }

    .active-container {
        display: flex;
        gap: 8px;
        align-items: center;
        justify-content: space-between;
        line-height: 140%;
        font-size: 16px;

        &__label {
            color: $c-black;
        }
    }
</style>
