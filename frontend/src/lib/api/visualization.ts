import axios from "axios";
import { type ApiResponseData, type WebsiteRecord } from "$types/visualizationTypes";
const apiUrl = import.meta.env.VITE_API_URL;

export async function getWebsiteRecordsByNodeId(nodeId: string): Promise<WebsiteRecord[]> {
  try {
    const response = await axios.get(`${apiUrl}/api/websiteRecords/nodes/${nodeId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching website records:", error);
    throw error;
  }
}

export async function getNodesByRecordId(record_id: string): Promise<ApiResponseData> {
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
    .post(`${apiUrl}/graphql`, {
      query: graphqlQuery,
      variables: { webPageIds: [record_id] },
      headers: {
        "Content-Type": "application/json"
      }
    })
    .catch((error) => {
      console.error("Error fetching data from GraphQL API", error);
    });
  return response?.data;
}
