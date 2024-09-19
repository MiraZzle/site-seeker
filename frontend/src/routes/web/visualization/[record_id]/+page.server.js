import axios from "axios";

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ fetch, params }) => {
	let record_id = params.record_id;

	const graphqlQuery = `
    query GetNodesByRecordId($webPageIds: [ID!]) {
      nodes(webPages: $webPageIds) {
        id
        title
        url
        crawlTime
        links {
          title
          url
        }
        owner {
          identifier
          label
          url
        }
      }
    }`;

  const response = await axios
    .post("http://localhost:3000/graphql", {
      query: graphqlQuery,
      variables: { webPageIds: [record_id] },
      headers: {
        "Content-Type": "application/json",
      },
    })
    .catch((error) => {
      console.error("Error fetching data from GraphQL API", error);
    });
	return { recordId: record_id, recordData: response?.data };
};
