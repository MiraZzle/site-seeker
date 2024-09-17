export async function fetchWebsiteRecords() {
  const response = await fetch('http://localhost:3000/api/websiteRecords', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch website records');
  }

  const result = await response.json();
  return result;  // assuming the result is already an array of website records
}