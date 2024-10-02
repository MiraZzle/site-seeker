const apiUrl = import.meta.env.VITE_API_URL;

export async function fetchExecutions() {
  const response = await fetch(`${apiUrl}/api/executions`);
  const data = await response.json();
  return data;
}

export async function fetchExecutionsByRecordId(recordId: number) {
  try {
    const response = await fetch(`${apiUrl}/api/executions/${recordId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch executions");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function fetchStartExecution(websiteRecordId: number) {
  try {
    // Send POST request to backend
    const response = await fetch(
      `${apiUrl}/api/websiteRecords/start/${websiteRecordId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    // Check if the request was successful
    if (!response.ok) {
      throw new Error("Failed to start execution");
    }

    // Handle success (e.g., show a notification or log)
    console.log(`Execution of Record ${websiteRecordId} started successfully!`);
  } catch (error) {
    // Handle error (e.g., show an error message or log)
    console.error("Error starting execution:", error);
  }
}
