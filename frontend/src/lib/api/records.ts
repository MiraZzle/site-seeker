export async function fetchWebsiteRecords() {
  const response = await fetch("http://localhost:3000/api/websiteRecords", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch website records");
  }

  const websiteRecords = await response.json();
  return websiteRecords;
}
