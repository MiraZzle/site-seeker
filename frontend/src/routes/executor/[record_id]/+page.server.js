/** @type {import('./$types').PageServerLoad} */

import { fetchExecutionsByRecordId } from "$lib/api/executions";

export const load = async ({ params }) => {
  let record_id = Number(params.record_id);

  // Zavolání funkce a získání výsledků
  let executions = await fetchExecutionsByRecordId(record_id);

  return { recordId: record_id, executions: executions };
};
