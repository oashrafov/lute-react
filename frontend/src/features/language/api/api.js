async function createLanguage(data) {
  const response = await fetch(`http://localhost:5001/api/languages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const message = await response.json();
    throw new Error(message);
  }

  return await response.json();
}

export { createLanguage };
