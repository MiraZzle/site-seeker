export const load = ({ fetch, params }) => {
  let record_id = params.record_id

  // fetchnout record data z api

  return { recordId: record_id, recordData: {} }
}
