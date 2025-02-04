async function wipeDemoDatabase() {
  const response = await fetch(`http://localhost:5001/api/settings/db`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const message = await response.json();
    throw new Error(message);
  }

  return await response.json();
}

async function deactivateDemoMode() {
  const response = await fetch(`http://localhost:5001/api/settings/db`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ deactiveDemo: true }),
  });

  if (!response.ok) {
    const message = await response.json();
    throw new Error(message);
  }

  return await response.json();
}

export { wipeDemoDatabase, deactivateDemoMode };
