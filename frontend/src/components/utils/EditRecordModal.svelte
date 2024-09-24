<script lang="ts">
  import Modal from "./Modal.svelte";
  import TextInput from "./TextInput.svelte";
  import Button from "$components/elements/typography/Button.svelte";
  import Toggle from "./Toggle.svelte";
  import SelectInput from "./SelectInput.svelte";
  import Header from "$components/elements/typography/Header.svelte";
  import TextAreaInput from "./TextAreaInput.svelte";

  const timeOptions = ["Seconds", "Minutes", "Hours", "Days"];

  // Export variables to populate the fields
  export let currentPage: number;
  export let getWebsiteRecords: (currentPage: number) => Promise<void>;
  export let record: WebRecord;
  export let showModal = true;
  export let showDeleteModal: (id: number) => void;
  export let startingUrl = record?.url;
  export let boundaryRegExp = record?.boundaryRegExp;
  export let periodicity = record?.periodicity; // this is in seconds
  export let label = record?.label;
  export let isActive = record?.isActive;
  export let onDeleteSuccess: (id: number) => void;

  let tags = record?.tags ? record.tags.join(", ") : ""; // Safe fallback to an empty string
  let selectedTime = timeOptions[0]; // Default to "Seconds"
  let displayedPeriodicity: string = convertPeriodicity(periodicity).toString();

  // Error messages
  let urlError = "";
  let boundaryRegExpError = "";
  let periodicityError = "";
  let labelError = "";
  let tagsError = "";

  // Function to convert seconds to the appropriate time unit
  function convertPeriodicity(seconds: number) {
    if (seconds < 60) {
      selectedTime = "Seconds";
      return seconds;
    } else if (seconds < 3600) {
      selectedTime = "Minutes";
      return seconds / 60;
    } else if (seconds < 86400) {
      selectedTime = "Hours";
      return seconds / 3600;
    } else {
      selectedTime = "Days";
      return seconds / 86400;
    }
  }

  // When the modal opens, convert periodicity to the appropriate unit
  $: {
    displayedPeriodicity = convertPeriodicity(periodicity).toString();
  }

  // Function to handle form submission with validation
  async function handleUpdate() {
    // Reset error messages
    urlError = "";
    boundaryRegExpError = "";
    periodicityError = "";
    labelError = "";
    tagsError = "";

    // Validace URL
    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/;
    if (!startingUrl || !urlPattern.test(startingUrl)) {
      urlError = "Invalid URL format. Make sure it starts with http:// or https://";
    }

    // Validace Boundary RegExp
    try {
      new RegExp(boundaryRegExp);
    } catch (e) {
      boundaryRegExpError = "Invalid Regular Expression format.";
    }

    // Validace periodicity (musí být číslo a větší než 0)
    if (
      !displayedPeriodicity ||
      isNaN(Number(displayedPeriodicity)) ||
      Number(displayedPeriodicity) <= 0
    ) {
      periodicityError = "Periodicity must be a number greater than 0.";
    }

    // Validace label (nesmí být prázdný)
    if (!label) {
      labelError = "Label cannot be empty.";
    }

    // Validace tags (žádné speciální znaky)
    if (!tags || tags.split(",").some((tag) => /[^a-zA-Z0-9 ]/.test(tag))) {
      tagsError = "Tags can only contain alphanumeric characters and spaces.";
    }

    // Pokud jsou nějaké chyby, zastav proces a nezobrazuj modal
    if (urlError || boundaryRegExpError || periodicityError || labelError || tagsError) {
      return;
    }

    let periodicityInSeconds = parseFloat(displayedPeriodicity);

    // Convert back to seconds before sending
    switch (selectedTime) {
      case "Minutes":
        periodicityInSeconds *= 60;
        break;
      case "Hours":
        periodicityInSeconds *= 3600;
        break;
      case "Days":
        periodicityInSeconds *= 86400;
        break;
      // Seconds doesn't need conversion
    }

    const updatedRecord = {
      id: record.id,
      url: startingUrl,
      boundaryRegExp: boundaryRegExp,
      periodicity: periodicityInSeconds, // Use the converted value in seconds
      label: label,
      tags: tags.split(",").map((tag) => tag.trim()), // Convert back to array
      isActive: isActive
    };

    try {
      const response = await fetch(`http://localhost:3000/api/websiteRecords/update/${record.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedRecord)
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Record updated successfully:", data);
        getWebsiteRecords(currentPage); // Reload records after successful update
        showModal = false; // Close modal
      } else {
        console.error("Failed to update record:", response.status);
      }
    } catch (error) {
      console.error("Error updating record:", error);
    }
  }

  // Function to delete the record
  async function handleDelete() {
    try {
      const response = await fetch(`http://localhost:3000/api/websiteRecords/delete/${record.id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        console.log(`Record with ID ${record.id} deleted successfully.`);
        showDeleteModal(record.id); // Show confirmation modal

        // Zavolání callbacku v případě úspěšného smazání
        onDeleteSuccess(record.id);

        showModal = false; // Close this modal
      } else {
        console.error("Failed to delete record:", response.status);
      }
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  }
</script>

<Modal bind:open={showModal} width="480px" closeOnEscape={true} closeOnOutsideClick={true}>
  <div class="modal-desc">
    <Header type={2} color="black" textAlign="center">Edit Existing Record</Header>
  </div>
  <TextInput description="Starting URL" bind:value={startingUrl} />
  {#if urlError}
    <span class="error-message">{urlError}</span>
  {/if}

  <TextInput description="Boundary RegExp" bind:value={boundaryRegExp} />
  {#if boundaryRegExpError}
    <span class="error-message">{boundaryRegExpError}</span>
  {/if}

  <div class="periodicity-container">
    <TextInput description="Periodicity" bind:value={displayedPeriodicity} />
    <SelectInput options={timeOptions} bind:value={selectedTime} />
  </div>
  {#if periodicityError}
    <span class="error-message">{periodicityError}</span>
  {/if}

  <TextInput description="Label" bind:value={label} placeholder="Enter a descriptive label" />
  {#if labelError}
    <span class="error-message">{labelError}</span>
  {/if}

  <TextAreaInput
    id="tags"
    label="Tags"
    bind:value={tags}
    placeholder="Enter tags separated by commas"
  />
  {#if tagsError}
    <span class="error-message">{tagsError}</span>
  {/if}

  <div class="active-container">
    <span class="active-container__label">Active</span>
    <Toggle bind:checked={isActive} />
  </div>
  <Button type="dark" width="full" action={handleUpdate}>Update Record</Button>
  <Button type="danger" width="full" action={handleDelete}>Delete Record</Button>
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

  .error-message {
    color: red;
    font-size: 10px;
  }
</style>
