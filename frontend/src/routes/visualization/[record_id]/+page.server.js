import { getNodesByRecordId } from "$utils/visualizationUtils";

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ fetch, params, url }) => {
	let record_id = params.record_id;

	const isLiveModeSet = url.searchParams.get("livemode") === "true";

	const responseData = await getNodesByRecordId(record_id);
	// This below is the ApiResponseDataWrapper type
	const dataWrapper = {
		recordId: record_id,
		recordData: responseData,
		liveModeState: isLiveModeSet,
	};
	return dataWrapper;
};
