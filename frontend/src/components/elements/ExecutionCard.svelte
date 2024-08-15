<script lang="ts">
    export let label = "Test";
    export let status = "Finished";
    export let crawledSites = 13;
    export let startTime = "29/07/24 16:24";
    export let endTime = "29/07/24 16:29";
</script>

<div class="execution-card shadow">
    <div class="execution-info">
        <div class="execution-info-item">
            <span class="execution-info-label">Label</span>
            <span class="execution-info-value"> {label} </span>
        </div>
        <div class="execution-info-item">
            <span class="execution-info-label">Status</span>
            <span class="execution-info-value"> {status} </span>
        </div>
        <div class="execution-info-item">
            <span class="execution-info-label">Number of crawled Sites</span>
            <span class="execution-info-value"> {crawledSites} </span>
        </div>
        <div class="execution-info-item">
            <span class="execution-info-label">Start Time</span>
            <span class="execution-info-value"> {startTime} </span>
        </div>
        <div class="execution-info-item">
            <span class="execution-info-label">End Time</span>
            <span class="execution-info-value"> {endTime} </span>
        </div>
    </div>
</div>

<style lang="scss">
    @import "../../styles/variables.scss";

    .execution-card {
        display: flex;
        justify-content: space-between;
        border: 1px solid $c-gray-outline;
        border-radius: 8px;
        padding: 16px;
        width: auto;
        transition: all .1s ease-out;

        &:hover {
            transform: scale(1.04);
        }
    }

    .execution-info {
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
        }
    }
</style>
