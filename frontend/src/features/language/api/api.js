async function getUserLanguages() {
  const response = await fetch("http://localhost:5001/api/languages/user");
  return await response.json();
}

async function getPredefinedLanguages() {
  const response = await fetch(
    "http://localhost:5001/api/languages/predefined"
  );
  return await response.json();
}

async function getUserLanguage(id) {
  const response = await fetch(
    `http://localhost:5001/api/languages/user/${id}`
  );
  return await response.json();
}

async function getPredefinedLanguage(langName) {
  const response = await fetch(
    `http://localhost:5001/api/languages/predefined/${langName}`
  );
  return await response.json();
}

async function getLanguageParsers() {
  const response = await fetch("http://localhost:5001/api/languages/parsers");
  return await response.json();
}

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

export {
  getUserLanguages,
  getPredefinedLanguages,
  getLanguageParsers,
  getUserLanguage,
  getPredefinedLanguage,
  createLanguage,
};
