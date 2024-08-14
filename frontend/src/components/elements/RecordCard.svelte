<script lang="ts">
    import Start from "$components/utils/icons/Start.svelte";
    import Edit from "$components/utils/icons/Edit.svelte";

    export let status = "Finished";
    export let time = "29/07/24 16:24";
    export let tags = ["Test", "Automation", "Web"];
    export let label = "Test";
    export let periodicity = "Every Hour";

    export let editAction : () => void = () => {};
    export let startAction : () => void = () => {};
</script>

<div class="record-card shadow">
    <div class=record-card-info>
        <div class="record-card-info-item">
            <span class="record-card-info-label">Label</span>
            <span class="record-card-info-value"> {label} </span>
        </div>
        <div class="record-card-info-item">
            <span class="record-card-info-label">Periodicity</span>
            <span class="record-card-info-value"> {periodicity} </span>
        </div>
        <div class="record-card-info-item">
            <span class="record-card-info-label">Last Exec Status</span>
            <span class="record-card-info-value"> {status} </span>
        </div>
        <div class="record-card-info-item">
            <span class="record-card-info-label">Last Exec Time</span>
            <span class="record-card-info-value"> {time} </span>
        </div>
        <div class="record-card-info-item">
            <span class="record-card-info-label">Tags</span>
            <span class="record-card-info-value record-card-info-value--tags"> {tags.join(", ")} </span>
        </div>
    </div>
    <div class="record-card-actions">
        <div class="record-card-action">
            <span class="record-card-info-label">Edit</span>
            <button class="record-card__button" on:click={() => editAction()}> <Edit/> </button>
        </div>
        <div class="record-card-action">
            <span class="record-card-info-label">Start</span>
            <button class="record-card__button" on:click={() => startAction()}> <Start/> </button>
        </div>
    </div>
</div>

<style lang="scss">
    @import "../../styles/variables.scss";

    .record-card {
        display: flex;
        justify-content: space-between;
        border: 1px solid $c-gray-outline;
        border-radius: 8px;
        padding: 16px;
        width: auto;
        //max-width: 830px;

        &__button {
            background-color: transparent;
            border: none;
            cursor: pointer;
            padding: 0;
            margin: 0;
        }

        &-info {
            display: flex;
            flex-direction: row;
            gap: 8px;

            &-item {
                display: flex;
                gap: 2px;
                flex-direction: column;
                margin: 4px 8px;
            }
            &-label {
                font-size: 14px;
                line-height: 140%;
                font-weight: 400;
                color: $c-gray-light;
            }

            &-value {
                font-size: 16px;
                line-height: 140%;
                font-weight: 600;

                &--tags {
                    font-weight: 400;
                    max-width: 200px;
                }
            }
        }
    }

    .record-card-actions {
        display: flex;
        flex-direction: row;
        gap: 8px;
    }

    .record-card-action {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }
</style>