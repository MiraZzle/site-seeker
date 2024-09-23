<script lang="ts">
  import Modal from "./Modal.svelte";
  import TextInput from "./TextInput.svelte";
  import Button from "$components/elements/typography/Button.svelte";
  import Toggle from "./Toggle.svelte";
  import SelectInput from "./SelectInput.svelte";
  import Header from "$components/elements/typography/Header.svelte";
  import Paragraph from "$components/elements/typography/Paragraph.svelte";
  import TextAreaInput from "./TextAreaInput.svelte";
  import { goto } from "$app/navigation";

  const timeOptions = ["Seconds", "Minutes", "Hours", "Days"];
  export let getWebsiteRecords: () => void = () => console.log("getWebsiteRecords not provided");
  export let selectedTime = timeOptions[0];
  export let showModal = false;
  export let url: string = "";
  export let goToNewWebsiteRecord: boolean = false;

  // Form data
  let boundaryRegExp = "";
  let periodicity = "";
  let label = "";
  let tags = "";
  let isActive = false;

  // Error messages
  let urlError = "";
  let boundaryRegExpError = "";
  let periodicityError = "";
  let labelError = "";
  let tagsError = "";

  // Submit function with validation
  async function addRecord() {
    // Reset error messages
    urlError = "";
    boundaryRegExpError = "";
    periodicityError = "";
    labelError = "";
    tagsError = "";

    // Validace URL
    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/;
    if (!url || !urlPattern.test(url)) {
      urlError = "Invalid URL format. Make sure it starts with http:// or https://";
    }

    // Validace Boundary RegExp
    try {
      new RegExp(boundaryRegExp);
    } catch (e) {
      boundaryRegExpError = "Invalid Regular Expression format.";
    }

    // Validace periodicity (musí být číslo a větší než 0)
    if (!periodicity || isNaN(Number(periodicity)) || Number(periodicity) <= 0) {
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

    // Pokud nejsou chyby, pokračujeme s odesláním dat
    let periodicityInSeconds = parseFloat(periodicity);

    // Převod periodicity na sekundy
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
    }

    const newRecord = {
      url,
      boundaryRegExp,
      periodicity: periodicityInSeconds,
      label,
      tags: tags.split(",").map((tag) => tag.trim()),
      isActive
    };

    try {
      const response = await fetch("http://localhost:3000/api/websiteRecords/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newRecord)
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Record added:", result);
        getWebsiteRecords(); // Reload records after successful addition
        showModal = false; // Close modal after success

        // Clear the form fields
        url = "";
        boundaryRegExp = "";
        periodicity = "";
        label = "";
        tags = "";
        isActive = false;
        selectedTime = timeOptions[0]; // Reset selected time to default

        // Go to the new record if the flag is set
        const newWebsiteRecordId = result.lastId;
        if (goToNewWebsiteRecord) {
          window.location.href = `/visualization/${newWebsiteRecordId}?livemode=true`;
        }
      } else {
        console.error("Failed to add record:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding record:", error);
    }
  }
</script>

<Modal bind:open={showModal} width="480px" closeOnEscape={true} closeOnOutsideClick={true}>
  <div class="modal-desc">
    <Header type={2} color="black" textAlign="center">Add New Site Record</Header>
    <Paragraph type={3} color="grayLight" textAlign="center">
      Define Settings for Crawling
    </Paragraph>
  </div>
  <TextInput bind:value={url} description="Starting URL" placeholder="https://www.example.com/" />
  {#if urlError}
    <span class="error-message">{urlError}</span>
  {/if}
  <TextInput
    bind:value={boundaryRegExp}
    description="Boundary RegExp"
    placeholder="^https://www.example.com"
  />
  {#if boundaryRegExpError}
    <span class="error-message">{boundaryRegExpError}</span>
  {/if}
  <div class="periodicity-container">
    <TextInput bind:value={periodicity} description="Periodicity" placeholder="Time" />
    <SelectInput options={timeOptions} bind:value={selectedTime} />
  </div>
  {#if periodicityError}
    <span class="error-message">{periodicityError}</span>
  {/if}
  <TextInput bind:value={label} description="Label" placeholder="Enter a descriptive label" />
  {#if labelError}
    <span class="error-message">{labelError}</span>
  {/if}
  <TextAreaInput
    bind:value={tags}
    id="tags"
    label="Tags"
    placeholder="Enter tags separated by commas"
  />
  {#if tagsError}
    <span class="error-message">{tagsError}</span>
  {/if}
  <div class="active-container">
    <span class="active-container__label">Active</span>
    <Toggle bind:checked={isActive} />
  </div>
  <Button type="dark" actionType="action" action={addRecord}>Add Record</Button>
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
