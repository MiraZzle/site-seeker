export async function fetchExecutions() {
  const response = await fetch(`http://localhost:3000/api/executions`);
  const data = await response.json();
  return data;
}

export async function fetchExecutionsByRecordId(recordId: number) {
  try {
    const response = await fetch(`http://localhost:3000/api/executions/${recordId}`);
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
